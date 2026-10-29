/**
 * Guards against the CMS configuration drifting away from the content files:
 * every field the CMS edits must exist in both languages of the file, every key in the file
 * must be editable in the CMS, and fields the CMS copies between languages must really match.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { languages } from './i18n/ui';

type I18nMode = true | 'duplicate';

interface CmsField {
  name: string;
  widget?: string;
  i18n?: I18nMode | false;
  fields?: CmsField[];
  field?: CmsField;
}

interface CmsCollection {
  name: string;
  files?: { name: string; file: string; fields: CmsField[] }[];
  folder?: string;
  fields?: CmsField[];
}

const config = parse(readFileSync('public/admin/config.yml', 'utf8')) as {
  i18n: { locales: string[] };
  collections: CmsCollection[];
};

const langs = Object.keys(languages);

interface Leaf {
  /** Key path, e.g. "links.donate" or "weekdays.rows[].time". */
  path: string;
  i18n: CmsField['i18n'];
}

/** Every editable value described by CMS fields. A duplicated object or list duplicates its children. */
function leaves(fields: CmsField[], prefix = '', inherited?: CmsField['i18n']): Leaf[] {
  return fields.flatMap((field) => {
    const path = `${prefix}${field.name}`;
    const i18n = inherited === 'duplicate' ? 'duplicate' : field.i18n;
    if (field.widget === 'object' && field.fields) return leaves(field.fields, `${path}.`, i18n);
    if (field.widget === 'list' && field.fields) return leaves(field.fields, `${path}[].`, i18n);
    return [{ path, i18n }];
  });
}

/** Every field, including objects and lists themselves. */
function allFields(fields: CmsField[]): CmsField[] {
  return fields.flatMap((field) => [
    field,
    ...allFields(field.fields ?? (field.field ? [field.field] : [])),
  ]);
}

/** Key paths present in a JSON value, using the same notation as `leaves`. */
function valuePaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    const objects = value.filter((item) => typeof item === 'object' && item !== null);
    if (objects.length === 0) return [prefix.slice(0, -1)];
    return [...new Set(objects.flatMap((item) => valuePaths(item, `${prefix.slice(0, -1)}[].`)))];
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, child]) =>
      typeof child === 'object' && child !== null
        ? valuePaths(child, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    );
  }
  return [prefix.slice(0, -1)];
}

/** The values found at a key path; `[]` steps into every item of a list. */
function valuesAt(value: unknown, path: string): unknown[] {
  return path.split('.').reduce<unknown[]>(
    (current, segment) =>
      current.flatMap((item) => {
        const key = segment.replace(/\[\]$/, '');
        const child = (item as Record<string, unknown> | undefined)?.[key];
        return segment.endsWith('[]') && Array.isArray(child) ? child : [child];
      }),
    [value],
  );
}

type Bilingual = Record<string, unknown>;

function readJson(file: string): Bilingual {
  return JSON.parse(readFileSync(file, 'utf8')) as Bilingual;
}

const fileEntries = config.collections.flatMap((collection) => collection.files ?? []);
const team = config.collections.find((collection) => collection.folder === 'src/content/team');
const teamFolder = 'src/content/team';
const teamFiles = readdirSync(teamFolder)
  .filter((name) => name.endsWith('.json'))
  .map((name) => join(teamFolder, name));

describe('CMS configuration', () => {
  it('edits the same languages as the site', () => {
    expect(config.i18n.locales).toEqual(langs);
  });

  it('says for every field whether it is translated or copied', () => {
    const fields = config.collections.flatMap((collection) => [
      ...(collection.fields ?? []),
      ...(collection.files ?? []).flatMap((file) => file.fields),
    ]);
    const unmarked = allFields(fields).filter(
      (field) => field.i18n !== true && field.i18n !== 'duplicate',
    );
    // A field without i18n is saved in Hebrew only, which the site's schemas reject.
    expect(unmarked.map((field) => field.name)).toEqual([]);
  });

  it.each(fileEntries.map((entry) => [entry.file, entry] as const))(
    'matches the keys of %s in every language',
    (file, entry) => {
      const json = readJson(file);
      expect(Object.keys(json)).toEqual(langs);
      const editable = leaves(entry.fields)
        .map((leaf) => leaf.path)
        .sort();
      for (const lang of langs) expect(valuePaths(json[lang]).sort(), lang).toEqual(editable);
    },
  );

  it.each(fileEntries.map((entry) => [entry.file, entry] as const))(
    'has the same copied values in every language in %s',
    (file, entry) => {
      const json = readJson(file);
      for (const { path } of leaves(entry.fields).filter((leaf) => leaf.i18n === 'duplicate')) {
        for (const lang of langs) {
          expect(valuesAt(json[lang], path), `${lang} ${path}`).toEqual(
            valuesAt(json[langs[0]], path),
          );
        }
      }
    },
  );

  it.each(teamFiles)('can edit every field of the team member in %s', (file) => {
    const json = readJson(file);
    expect(Object.keys(json)).toEqual(langs);
    const fields = leaves(team?.fields ?? []);
    const editable = new Set(fields.map((leaf) => leaf.path));
    for (const lang of langs) {
      const keys = Object.keys(json[lang] as object);
      expect(
        keys.filter((key) => !editable.has(key)),
        lang,
      ).toEqual([]);
    }
    for (const { path } of fields.filter((leaf) => leaf.i18n === 'duplicate')) {
      for (const lang of langs) {
        expect(valuesAt(json[lang], path), `${lang} ${path}`).toEqual(
          valuesAt(json[langs[0]], path),
        );
      }
    }
  });
});

/**
 * Guards against the CMS configuration drifting away from the content files:
 * every field the CMS edits must exist in the file, and every key in the file
 * must be editable in the CMS.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

interface CmsField {
  name: string;
  widget?: string;
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
  collections: CmsCollection[];
};

/** Key paths described by CMS fields, e.g. "links.donate" or "weekdays.rows[].time". */
function fieldPaths(fields: CmsField[], prefix = ''): string[] {
  return fields.flatMap((field) => {
    const path = `${prefix}${field.name}`;
    if (field.widget === 'object' && field.fields) return fieldPaths(field.fields, `${path}.`);
    if (field.widget === 'list' && field.fields) return fieldPaths(field.fields, `${path}[].`);
    return [path];
  });
}

/** Key paths present in a JSON value, using the same notation. */
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

describe('CMS configuration', () => {
  const fileEntries = config.collections.flatMap((collection) => collection.files ?? []);

  it.each(fileEntries.map((entry) => [entry.file, entry] as const))(
    'matches the keys of %s',
    (_file, entry) => {
      const json: unknown = JSON.parse(readFileSync(entry.file, 'utf8'));
      expect(fieldPaths(entry.fields).sort()).toEqual(valuePaths(json).sort());
    },
  );

  it('can edit every field used by the team members', () => {
    const team = config.collections.find((collection) => collection.folder === 'src/content/team');
    const editable = new Set(fieldPaths(team?.fields ?? []));
    const folder = 'src/content/team';
    for (const file of readdirSync(folder).filter((name) => name.endsWith('.md'))) {
      const frontmatter = readFileSync(join(folder, file), 'utf8').match(/^---\n([\s\S]*?)\n---/);
      const keys = Object.keys(parse(frontmatter?.[1] ?? '') as object);
      expect(
        keys.filter((key) => !editable.has(key)),
        file,
      ).toEqual([]);
    }
  });
});

import { z } from 'astro/zod';

/**
 * Every content file holds one complete copy per language: `{ "he": {...}, "en": {...} }`.
 * This is the layout Sveltia CMS uses for translations (`i18n.structure: single_file`); values that
 * are the same in both languages (times, links, colours) are kept in step by the CMS (`duplicate`).
 */
export function bilingual<T extends z.ZodType>(schema: T) {
  return z.object({ he: schema, en: schema });
}

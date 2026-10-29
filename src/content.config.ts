import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A link a visitor can use to reach someone: an email, phone or web link. */
const contactLink = z
  .string()
  .regex(/^(mailto:|tel:|https:\/\/)/, { error: 'Start with mailto:, tel: or https://' });

/**
 * Team members: one JSON file per person in src/content/team/, with a Hebrew and an English copy
 * (`{ "he": {...}, "en": {...} }`). Order, colour, photo and contact are the same in both; the CMS
 * keeps them in step.
 */
const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: ({ image }) => {
    const member = z.object({
      name: z.string().trim().min(1),
      role: z.string().trim().min(1),
      /** A short bio. Separate paragraphs with a blank line. */
      bio: z.string().trim().min(1),
      /** Position in the list, lowest first. */
      order: z.number().int(),
      /** Background of the letter circle when there is no photo. */
      color: z.enum(['cobalt', 'forest', 'orange', 'teal', 'red']),
      photo: image().optional(),
      contact: contactLink.optional(),
    });
    return z.object({ he: member, en: member });
  },
});

export const collections = { team };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A link a visitor can use to reach someone: an email, phone or web link. */
const contactLink = z
  .string()
  .regex(/^(mailto:|tel:|https:\/\/)/, { error: 'Start with mailto:, tel: or https://' });

/**
 * Team members: one Markdown file per person in src/content/team/.
 * The frontmatter holds the details below; the body is the person's bio.
 */
const team = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().trim().min(1),
      role: z.string().trim().min(1),
      /** Position in the list, lowest first. */
      order: z.number().int(),
      /** Letter shown when there is no photo. Defaults to the first letter of the name, after "הרב". */
      initial: z.string().length(1).optional(),
      /** Background of the letter circle when there is no photo. */
      color: z.enum(['cobalt', 'forest', 'orange', 'teal', 'red']),
      photo: image().optional(),
      contact: contactLink.optional(),
    }),
});

export const collections = { team };

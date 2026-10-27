import { z } from 'astro/zod';
import siteJson from '@/content/settings/site.json';

/** An external link that may not be set yet. The CMS saves an unset link as an empty string. */
const optionalUrl = z.union([z.url(), z.literal('')]).default('');

const siteSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
  }),
  phone: z.string().min(1),
  officeHours: z.string().min(1),
  links: z.object({
    donate: optionalUrl,
    whatsapp: optionalUrl,
    midrashSchedule: optionalUrl,
  }),
  features: z.object({
    /** Show the English language switch. Turn on once the English pages have content. */
    english: z.boolean(),
  }),
});

export type SiteSettings = z.infer<typeof siteSchema>;

/** Site-wide settings, validated at build time so a bad CMS edit fails the build instead of the page. */
export const site: SiteSettings = siteSchema.parse(siteJson);

/** `tel:` link for a phone number written for people (e.g. "03-5224047"). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

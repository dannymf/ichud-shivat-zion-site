/**
 * Editable copy for the home-page sections. Each section has one JSON file in
 * `src/content/home/`, edited through the CMS and validated here at build time.
 */
import { z } from 'astro/zod';
import aboutJson from '@/content/home/about.json';
import donateJson from '@/content/home/donate.json';
import heroJson from '@/content/home/hero.json';
import joinJson from '@/content/home/join.json';

const text = z.string().trim().min(1);
/** A heading split into lines, so editors control where it breaks. */
const lines = z.array(text).min(1);

const heroSchema = z.object({
  titleLines: lines,
  /** Last line of the heading, shown in green. */
  titleAccent: text,
  intro: text,
  primaryCta: text,
  whatsappCta: text,
});

const aboutSchema = z.object({
  titleLines: lines,
  paragraphs: z.array(text).min(1),
  imageAlt: text,
  verse: z.object({ text, source: text }),
});

const donateSchema = z.object({
  titleLines: lines,
  text,
  cardTitle: text,
  cardNote: text,
  /** Suggested amounts in shekels. Shown only when the provider can pre-fill an amount. */
  amounts: z.array(z.number().int().positive()).max(6),
  otherAmountLabel: text,
  cta: text,
  membershipCta: text,
});

const joinSchema = z.object({
  title: text,
  text,
  cta: text,
});

export const hero = heroSchema.parse(heroJson);
export const about = aboutSchema.parse(aboutJson);
export const donate = donateSchema.parse(donateJson);
export const join = joinSchema.parse(joinJson);

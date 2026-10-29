/**
 * Editable copy for the home-page sections. Each section has one JSON file in
 * `src/content/home/`, edited through the CMS and validated here at build time.
 */
import { z } from 'astro/zod';
import aboutJson from '@/content/home/about.json';
import donateJson from '@/content/home/donate.json';
import heroJson from '@/content/home/hero.json';
import joinJson from '@/content/home/join.json';
import midrashJson from '@/content/home/midrash.json';
import teamJson from '@/content/home/team.json';
import { scheduleRowSchema } from './schedule';

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
  purposeLegend: text,
  /** What the gift is for. `value` is what the donation provider receives (settings → purposeParam). */
  purposes: z.array(z.object({ value: text, label: text })).max(6),
  cardNote: text,
  /** Suggested amounts in shekels. Shown only when the provider can pre-fill an amount. */
  amounts: z.array(z.number().int().positive()).max(6),
  otherAmountLabel: text,
  cta: text,
});

const joinSchema = z.object({
  title: text,
  text,
  cta: text,
});

const midrashSchema = z.object({
  eyebrow: text,
  intro: text,
  detail: text,
  schedule: z.object({
    title: text,
    subtitle: text,
    rows: z.array(scheduleRowSchema).min(1),
  }),
  fullScheduleCta: text,
});

/** Section copy only; the people themselves are the `team` content collection. */
const teamSchema = z.object({
  eyebrow: text,
  title: text,
  /** Shown above the circles once the page's script has made them clickable. */
  hint: text,
  contactCta: text,
});

export const hero = heroSchema.parse(heroJson);
export const about = aboutSchema.parse(aboutJson);
export const donate = donateSchema.parse(donateJson);
export const join = joinSchema.parse(joinJson);
export const midrash = midrashSchema.parse(midrashJson);
export const team = teamSchema.parse(teamJson);

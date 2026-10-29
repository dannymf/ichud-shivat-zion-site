import { z } from 'astro/zod';
import prayerTimesJson from '@/content/home/prayer-times.json';
import { scheduleRowSchema } from './schedule';

const text = z.string().trim().min(1);

const prayerTimesSchema = z.object({
  title: text,
  /** Minutes before sunset for the candle-lighting time shown for Friday. */
  candleLightingMinutes: z.number().int().min(10).max(60),
  weekdays: z.object({
    title: text,
    subtitle: text,
    rows: z.array(scheduleRowSchema).min(1),
  }),
  shabbat: z.object({
    title: text,
    rows: z.array(scheduleRowSchema).min(1),
  }),
  fullScheduleCta: text,
});

export const prayerTimes = prayerTimesSchema.parse(prayerTimesJson);

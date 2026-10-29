/** Shared schema pieces for the timetables (prayer times, Midrash Aviv). */
import { z } from 'astro/zod';

/** A 24-hour time such as "06:30". */
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
  error: 'Use a 24-hour time such as 06:30',
});

export const scheduleRowSchema = z.object({
  label: z.string().trim().min(1),
  time: timeSchema,
});

export type ScheduleRow = z.infer<typeof scheduleRowSchema>;

import { describe, expect, it } from 'vitest';
import { getWeekInfo, israelCalendarDate, upcomingShabbat } from './jewish-calendar';

const options = { candleLightingMinutes: 18, lang: 'he' } as const;

describe('israelCalendarDate', () => {
  it('uses the date in Israel, not the build machine’s time zone', () => {
    // 22:30 UTC on Friday is already 01:30 on Saturday in Israel (UTC+3 in October).
    const date = israelCalendarDate(new Date('2026-10-09T22:30:00Z'));
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([2026, 10, 10]);
  });
});

describe('upcomingShabbat', () => {
  it('finds the next Saturday', () => {
    expect(upcomingShabbat(new Date(2026, 9, 4)).getDate()).toBe(10);
  });

  it('returns the same day on a Saturday', () => {
    expect(upcomingShabbat(new Date(2026, 9, 10)).getDate()).toBe(10);
  });
});

describe('getWeekInfo', () => {
  it('describes an ordinary week', () => {
    const info = getWeekInfo(new Date('2026-10-04T09:00:00Z'), options);
    expect(info.today).toEqual({ weekday: 'יום ראשון', hebrewDate: 'כ״ג תשרי תשפ״ז' });
    expect(info.shabbat).toEqual({
      title: 'פרשת בראשית',
      candleLighting: '17:55',
      havdalah: '18:51',
    });
  });

  it('names the festival when it replaces the weekly portion', () => {
    // Shemini Atzeret falls on Shabbat, 3 October 2026.
    const info = getWeekInfo(new Date('2026-09-30T09:00:00Z'), options);
    expect(info.shabbat.title).toContain('שמיני עצרת');
  });

  it('respects the candle-lighting setting', () => {
    const info = getWeekInfo(new Date('2026-10-04T09:00:00Z'), {
      ...options,
      candleLightingMinutes: 30,
    });
    expect(info.shabbat.candleLighting).toBe('17:45');
  });

  it('speaks English on the English site', () => {
    const info = getWeekInfo(new Date('2026-10-04T09:00:00Z'), { ...options, lang: 'en' });
    expect(info.today).toEqual({ weekday: 'Sunday', hebrewDate: '23rd of Tishrei, 5787' });
    expect(info.shabbat.title).toBe('Parashat Bereshit');
    expect(info.shabbat.candleLighting).toBe('17:55');
  });
});

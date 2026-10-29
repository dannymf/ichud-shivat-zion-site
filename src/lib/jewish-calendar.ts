/**
 * Dates and Shabbat times for the prayer-times section, computed with Hebcal at build time.
 *
 * Everything here is in Israel time, whatever the time zone of the machine running the build.
 * The site is rebuilt every night, so "today" and "this Shabbat" stay current.
 */
import {
  CandleLightingEvent,
  HavdalahEvent,
  HDate,
  HebrewCalendar,
  HolidayEvent,
  Location,
  ParshaEvent,
} from '@hebcal/core';

const TIME_ZONE = 'Asia/Jerusalem';
const HEBREW = 'he-x-NoNikud';

export interface CalendarOptions {
  /** Minutes before sunset for candle lighting. */
  candleLightingMinutes: number;
}

export interface WeekInfo {
  today: {
    /** e.g. "יום ראשון" */
    weekday: string;
    /** e.g. "כ״ג תשרי תשפ״ז" */
    hebrewDate: string;
  };
  shabbat: {
    /** The weekly portion ("פרשת בראשית"), or the festival's name when a festival replaces it. */
    title: string | undefined;
    /** Friday candle lighting, "HH:MM" */
    candleLighting: string | undefined;
    /** Saturday night havdalah, "HH:MM" */
    havdalah: string | undefined;
  };
}

/** The calendar date in Israel at the given moment, as a local-midnight Date (what Hebcal expects). */
export function israelCalendarDate(moment: Date): Date {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(moment)
    .split('-')
    .map(Number);
  return new Date(year, month - 1, day);
}

/** The Saturday on or after the given calendar date. */
export function upcomingShabbat(date: Date): Date {
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysUntilSaturday);
}

function formatTime(moment: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(moment);
}

export function getWeekInfo(now: Date, options: CalendarOptions): WeekInfo {
  const today = israelCalendarDate(now);
  const saturday = upcomingShabbat(today);
  const friday = new Date(saturday.getFullYear(), saturday.getMonth(), saturday.getDate() - 1);

  const events = HebrewCalendar.calendar({
    start: friday,
    end: saturday,
    location: Location.lookup('Tel Aviv'),
    il: true,
    candlelighting: true,
    candleLightingMins: options.candleLightingMinutes,
    sedrot: true,
  });

  const onDay = (day: Date) => (event: { getDate: () => HDate }) =>
    event.getDate().isSameDate(new HDate(day));

  const candleLighting = events
    .filter(onDay(friday))
    .find((event): event is CandleLightingEvent => event instanceof CandleLightingEvent);
  const havdalah = events
    .filter(onDay(saturday))
    .find((event): event is HavdalahEvent => event instanceof HavdalahEvent);
  const parasha = events.find((event) => event instanceof ParshaEvent);
  const festival = events
    .filter(onDay(saturday))
    .find((event) => event instanceof HolidayEvent && event.hasFlag('CHAG'));

  return {
    today: {
      weekday: new Intl.DateTimeFormat('he-IL', { timeZone: TIME_ZONE, weekday: 'long' }).format(
        now,
      ),
      hebrewDate: new HDate(today).renderGematriya(true),
    },
    shabbat: {
      title: (parasha ?? festival)?.render(HEBREW),
      candleLighting: candleLighting && formatTime(candleLighting.eventTime),
      havdalah: havdalah && formatTime(havdalah.eventTime),
    },
  };
}

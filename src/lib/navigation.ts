import type { UiKey } from '@/i18n/ui';

/**
 * Sections of the home page, in page order. Section components use these ids,
 * and the header and footer build their links from this list.
 */
export const sectionIds = {
  hero: 'top',
  about: 'about',
  prayerTimes: 'prayer-times',
  midrash: 'midrash-aviv',
  team: 'team',
  donate: 'donate',
} as const;

export interface NavItem {
  id: (typeof sectionIds)[keyof typeof sectionIds];
  label: UiKey;
}

/** Links in the header menu. */
export const primaryNav: NavItem[] = [
  { id: sectionIds.about, label: 'nav.about' },
  { id: sectionIds.prayerTimes, label: 'nav.prayerTimes' },
  { id: sectionIds.midrash, label: 'nav.midrash' },
  { id: sectionIds.team, label: 'nav.team' },
];

/** Links in the footer: the header menu plus donations. */
export const footerNav: NavItem[] = [...primaryNav, { id: sectionIds.donate, label: 'nav.donate' }];

/**
 * Link to a home-page section. Root-relative, so it also works from other pages such as the 404;
 * on the home page itself the browser just scrolls.
 */
export function sectionHref(id: NavItem['id']): string {
  return `/#${id}`;
}

/**
 * Interface strings (labels, buttons, accessible names). Editable page content
 * lives in `src/content/` instead, so staff can change it through the CMS.
 */
export const languages = { he: 'עברית', en: 'English' } as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'he';

export const textDirection: Record<Lang, 'rtl' | 'ltr'> = { he: 'rtl', en: 'ltr' };

const he = {
  'site.name': 'איחוד שיבת ציון',
  'site.tagline': 'בית כנסת וקהילה · תל אביב',
  'site.description': 'איחוד שיבת ציון – בית כנסת וקהילה ברחוב בן יהודה 86 בתל אביב.',
  'a11y.skipToContent': 'דילוג לתוכן',
  'nav.primary': 'ניווט ראשי',
  'nav.footer': 'ניווט תחתון',
  'nav.openMenu': 'פתיחת התפריט',
  'nav.about': 'אודות',
  'nav.prayerTimes': 'זמני תפילות',
  'nav.midrash': 'מדרש אביב',
  'nav.team': 'צוות',
  'nav.donate': 'תרומה',
  'cta.donate': 'לתרומה',
  'hero.arkAlt': 'ארון הקודש באולם התפילה, ומעליו הכתובת: הס כל בשר מפני ה׳',
  'hero.windowAlt': 'חלון ויטראז׳ בבית הכנסת',
  'prayerTimes.today': 'היום',
  'prayerTimes.candleLighting': 'הדלקת נרות · ערב שבת',
  'prayerTimes.havdalah': 'צאת השבת',
  'prayerTimes.weekOf': 'שבוע',
  'donate.amountLegend': 'סכום התרומה',
  'footer.office': 'המשרד',
  'footer.rights': 'בית הכנסת איחוד שיבת ציון',
  'lang.label': 'שפה',
} as const;

export type UiKey = keyof typeof he;

/** English strings are filled in when the English site launches; missing keys fall back to Hebrew. */
const en: Partial<Record<UiKey, string>> = {};

const ui: Record<Lang, Partial<Record<UiKey, string>>> = { he, en };

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? he[key];
}

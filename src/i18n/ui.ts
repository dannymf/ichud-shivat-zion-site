/**
 * Interface strings (labels, buttons, accessible names). Editable page content
 * lives in `src/content/` instead, so staff can change it through the CMS.
 */
export const languages = { he: 'עברית', en: 'English' } as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'he';

export const textDirection: Record<Lang, 'rtl' | 'ltr'> = { he: 'rtl', en: 'ltr' };

/** Labels for the language switch, each written in its own language. */
export const languageShort: Record<Lang, string> = { he: 'עב', en: 'EN' };

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
  'hero.arkAlt': 'אולם התפילה: ארון הקודש, הבימה והנברשת',
  'hero.windowAlt': 'חלון ויטראז׳ בבית הכנסת',
  'prayerTimes.today': 'היום',
  'prayerTimes.candleLighting': 'הדלקת נרות · ערב שבת',
  'prayerTimes.havdalah': 'צאת השבת',
  'prayerTimes.weekOf': 'שבוע',
  'donate.amountLegend': 'סכום התרומה',
  'notFound.title': 'הדף לא נמצא',
  'notFound.text': 'ייתכן שהקישור השתנה או שהדף הוסר.',
  'notFound.home': 'לדף הבית',
  'footer.office': 'המשרד',
  'footer.rights': 'בית הכנסת איחוד שיבת ציון',
  'lang.label': 'שפה',
} as const;

export type UiKey = keyof typeof he;

/** Every key is required, so a missing English string is a type error rather than Hebrew on the English site. */
const en: Record<UiKey, string> = {
  'site.name': 'Ichud Shivat Zion',
  'site.tagline': 'Synagogue & community · Tel Aviv',
  'site.description':
    'Ichud Shivat Zion – a synagogue and community at 86 Ben Yehuda Street, Tel Aviv.',
  'a11y.skipToContent': 'Skip to content',
  'nav.primary': 'Main menu',
  'nav.footer': 'Footer menu',
  'nav.openMenu': 'Open the menu',
  'nav.about': 'About',
  'nav.prayerTimes': 'Prayer times',
  'nav.midrash': 'Midrash Aviv',
  'nav.team': 'Team',
  'nav.donate': 'Donate',
  'cta.donate': 'Donate',
  'hero.arkAlt': 'The sanctuary: the ark, the bimah and the chandelier',
  'hero.windowAlt': 'A stained-glass window in the synagogue',
  'prayerTimes.today': 'Today',
  'prayerTimes.candleLighting': 'Candle lighting · Friday',
  'prayerTimes.havdalah': 'Shabbat ends',
  'prayerTimes.weekOf': 'Week of',
  'donate.amountLegend': 'Amount',
  'notFound.title': 'Page not found',
  'notFound.text': 'The link may have changed, or the page may have been removed.',
  'notFound.home': 'Back to the home page',
  'footer.office': 'Office',
  'footer.rights': 'Ichud Shivat Zion Synagogue',
  'lang.label': 'Language',
};

const ui: Record<Lang, Record<UiKey, string>> = { he, en };

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}

# Content

All editable content is in `src/content/`, and staff change it through the CMS at `/admin/`. Every
file is validated when the site builds, so a mistake (a time written as `6:30pm`, an empty heading)
fails the build with a clear message instead of breaking the page.

## Two languages

The site is in Hebrew at `/` and in English at `/en/`. Every content file holds both languages:

```json
{ "he": { "title": "זמני תפילות" }, "en": { "title": "Prayer Times" } }
```

In the CMS each field is either translated (written in each language) or copied (entered once in
Hebrew and copied to English): times, numbers, links, colours, photos and contact links are copied.
A list such as the weekday prayers is edited per language, so a row added in Hebrew needs its English
name too; its time is copied. The build rejects a file that is missing either language, and `npm test`
checks that copied values are the same in both.

Interface text that is not content (menu labels, accessible names) is in `src/i18n/ui.ts`, where a
missing English string is a type error.

| What                                | File                                 | Validated in              |
| ----------------------------------- | ------------------------------------ | ------------------------- |
| Address, phone, office hours, links | `src/content/settings/site.json`     | `src/lib/settings.ts`     |
| Opening section                     | `src/content/home/hero.json`         | `src/lib/home-content.ts` |
| About                               | `src/content/home/about.json`        | `src/lib/home-content.ts` |
| Prayer times                        | `src/content/home/prayer-times.json` | `src/lib/home-content.ts` |
| Midrash Aviv                        | `src/content/home/midrash.json`      | `src/lib/home-content.ts` |
| Team section headings               | `src/content/home/team.json`         | `src/lib/home-content.ts` |
| Team members (one file each)        | `src/content/team/*.json`            | `src/content.config.ts`   |
| Donations                           | `src/content/home/donate.json`       | `src/lib/home-content.ts` |
| WhatsApp band                       | `src/content/home/join.json`         | `src/lib/home-content.ts` |

## Computed, not edited

- **Today's Hebrew date, the parasha, candle lighting and havdalah** come from Hebcal for Tel Aviv
  (`src/lib/jewish-calendar.ts`). Only the candle-lighting minutes are a setting.
- They are computed when the site builds, in Hebrew for `/` and in English for `/en/`, so they are
  as current as the last deploy. Rerun the deploy workflow to refresh them, or schedule it.
- Team bios are plain text; a blank line starts a new paragraph.

## Adding a field

1. Add it to both languages (`he` and `en`) in the JSON file.
2. Add it to the matching Zod schema (table above).
3. Add it to `public/admin/config.yml` with `i18n: true` (translated) or `i18n: duplicate` (copied).
4. Use it in the section component.

`npm test` checks that the CMS configuration and the content files have the same fields in both
languages and that every field is marked translated or copied, so forgetting a step fails CI.

## Images

- Section photos are fixed assets in `src/assets/images/` and are not editable in the CMS.
- Team photos are uploaded through the CMS into `src/assets/team/`. The build resizes and converts
  them, so any reasonably sized JPEG or PNG is fine; a square crop looks best.

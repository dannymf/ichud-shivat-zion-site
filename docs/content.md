# Content

All editable content is in `src/content/`, and staff change it through the CMS at `/admin/`. Every
file is validated when the site builds, so a mistake (a time written as `6:30pm`, an empty heading)
fails the build with a clear message instead of breaking the page.

| What                                | File                                 | Validated in              |
| ----------------------------------- | ------------------------------------ | ------------------------- |
| Address, phone, office hours, links | `src/content/settings/site.json`     | `src/lib/settings.ts`     |
| Opening section                     | `src/content/home/hero.json`         | `src/lib/home-content.ts` |
| About                               | `src/content/home/about.json`        | `src/lib/home-content.ts` |
| Prayer times                        | `src/content/home/prayer-times.json` | `src/lib/prayer-times.ts` |
| Midrash Aviv                        | `src/content/home/midrash.json`      | `src/lib/home-content.ts` |
| Team section headings               | `src/content/home/team.json`         | `src/lib/home-content.ts` |
| Team members (one file each)        | `src/content/team/*.md`              | `src/content.config.ts`   |
| Donations                           | `src/content/home/donate.json`       | `src/lib/home-content.ts` |
| WhatsApp band                       | `src/content/home/join.json`         | `src/lib/home-content.ts` |

## Computed, not edited

- **Today's Hebrew date, the parasha, candle lighting and havdalah** come from Hebcal for Tel Aviv
  (`src/lib/jewish-calendar.ts`). Only the candle-lighting minutes are a setting.
- They are computed when the site builds; the nightly rebuild keeps them current.

## Adding a field

1. Add it to the JSON or Markdown file.
2. Add it to the matching Zod schema (table above).
3. Add it to `public/admin/config.yml`.
4. Use it in the section component.

`npm test` includes a check that the CMS configuration and the content files have the same fields,
so forgetting step 1 or 3 fails CI.

## Images

- Section photos are fixed assets in `src/assets/images/` and are not editable in the CMS.
- Team photos are uploaded through the CMS into `src/assets/team/`. The build resizes and converts
  them, so any reasonably sized JPEG or PNG is fine; a square crop looks best.

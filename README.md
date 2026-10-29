# Ichud Shivat Zion — website

The website of Ichud Shivat Zion (איחוד שיבת ציון), the synagogue and community at Ben Yehuda 86, Tel Aviv.

A single Hebrew page of full-screen sections: about, prayer times, Midrash Aviv, the team and
donations. It is built with [Astro](https://astro.build) as a static site, with no client-side
framework.

## Getting started

Requires Node 22.12 or later (see `.nvmrc`).

```sh
npm ci
npm run dev       # http://localhost:4321
```

| Script            | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the dev server                                  |
| `npm run build`   | Build the static site into `dist/`                    |
| `npm run preview` | Serve the built site                                  |
| `npm run check`   | Type-check `.astro` and `.ts` files                   |
| `npm run lint`    | ESLint                                                |
| `npm test`        | Unit tests (Vitest)                                   |
| `npm run format`  | Format everything with Prettier                       |
| `npm run verify`  | Everything CI runs: format, lint, types, tests, build |

## Project structure

```
src/
  layouts/BaseLayout.astro     <html> shell: language and direction, meta, fonts, header and footer
  components/
    layout/                    SiteHeader, SiteFooter, JoinBand, Section (one full-screen panel)
    ui/                        Building blocks: Button, SectionHeading, ScheduleCard, Plaque, Avatar…
    sections/                  One component per home-page section, in page order in pages/index.astro
  content/                     Everything staff can edit (see docs/content.md)
  content.config.ts            The `team` content collection
  lib/                         Plain TypeScript: content loading and validation, the Jewish calendar
  i18n/ui.ts                   Interface strings (labels, accessible names)
  styles/                      tokens.css (design tokens) and global.css (reset and base styles)
  assets/                      Fonts and images processed at build time
public/
  admin/                       Sveltia CMS (index.html and config.yml)
docs/                          content.md (what lives where), deployment.md (hosting, CMS sign-in)
```

## Conventions

- **Design tokens.** Colours, fonts, sizes and spacing come from `src/styles/tokens.css`. Components
  use the variables rather than literal values.
- **Right-to-left first.** Use logical CSS properties (`margin-inline`, `inset-inline-start`,
  `padding-block`) so the layout also works left-to-right for the future English pages.
- **Content vs. interface text.** Anything staff should be able to change lives in `src/content/`
  and is validated with a Zod schema at build time. Fixed interface text (menu labels, button text,
  accessible names) lives in `src/i18n/ui.ts`.
- **Sections.** Each home-page section is one component in `components/sections/`, wrapped in
  `<Section>`, with its id taken from `src/lib/navigation.ts`, which also builds the header and footer
  menus.
- **JavaScript only where needed.** Interactivity is a small `<script>` in the component that needs
  it. Prefer built-in browser features (for example the `popover` attribute used by the mobile menu).
- **Accessibility.** Real `<a>` and `<button>` elements, visible focus, 4.5:1 text contrast, and every
  section named by its heading.

## Fonts

| Font             | Used for                      | Source                                    |
| ---------------- | ----------------------------- | ----------------------------------------- |
| Kehila Serif     | Headings and the wordmark     | `src/assets/fonts` (Hebrew letters, bold) |
| Frank Ruhl Libre | Body text, digits and Latin   | `@fontsource-variable/frank-ruhl-libre`   |
| Aviv Display     | The Midrash Aviv section only | `src/assets/fonts`                        |

They are registered with Astro's Fonts API in `astro.config.mjs`.

## Editing and deployment

Staff edit content at `/admin/` with [Sveltia CMS](https://github.com/sveltia/sveltia-cms), which
commits to `main`. The site is hosted on Cloudflare Pages and rebuilt nightly so the Hebrew date and
Shabbat times stay current. See [docs/content.md](docs/content.md) and
[docs/deployment.md](docs/deployment.md).

## Before launch

The code is complete; these are content and accounts that only the community can supply.

- [ ] Real prayer times, Midrash Aviv shiurim, team bios and photos (placeholders are marked with
      square brackets in `src/content/`)
- [ ] The founding year in `src/content/home/about.json`
- [ ] Links in `src/content/settings/site.json`: donation page, membership, full prayer schedule,
      WhatsApp group, Midrash Aviv schedule (the build lists any that are still empty)
- [ ] The donation provider's amount parameter, if it has one
- [ ] Domain → `site` in `astro.config.mjs` (enables the canonical URL and share image)
- [ ] Cloudflare Pages, the nightly deploy hook and CMS sign-in ([docs/deployment.md](docs/deployment.md))

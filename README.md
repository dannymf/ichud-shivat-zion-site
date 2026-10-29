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

| Script            | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the dev server                                |
| `npm run build`   | Build the static site into `dist/`                  |
| `npm run preview` | Serve the built site                                |
| `npm run check`   | Type-check `.astro` and `.ts` files                 |
| `npm run lint`    | ESLint                                              |
| `npm run format`  | Format everything with Prettier                     |
| `npm run verify`  | Formatting, lint, type check and build (same as CI) |

## Project structure

```
src/
  layouts/BaseLayout.astro     <html> shell: language and direction, meta, fonts, header and footer
  components/
    layout/                    SiteHeader, SiteFooter, Section (one full-screen panel)
    ui/                        Small building blocks: Button, Divider, Icon, Logo
    sections/                  One component per home-page section (added in upcoming PRs)
  content/settings/            Editable site settings (address, phone, links); edited through the CMS
  lib/                         Plain TypeScript: settings loading and validation, navigation
  i18n/ui.ts                   Interface strings (labels, accessible names)
  styles/                      tokens.css (design tokens) and global.css (reset and base styles)
  assets/                      Fonts and images processed at build time
public/                        Files served as-is (favicon)
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

## Roadmap

1. Scaffold: tooling, CI, tokens, fonts, layout, header and footer, `<Section>` _(this PR)_
2. Hero, About, Donate, and the WhatsApp band in the footer
3. Prayer times, with Hebcal for the Hebrew date, parasha, candle lighting and havdalah
4. Midrash Aviv and the team section
5. Sveltia CMS, hosting on Cloudflare Pages, and a nightly rebuild
6. Mobile polish, accessibility audit, SEO basics

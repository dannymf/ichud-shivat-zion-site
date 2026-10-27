// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

const frankRuhl = './node_modules/@fontsource-variable/frank-ruhl-libre/files';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: set to the production domain once it is chosen (used for canonical URLs and the sitemap).
  // site: 'https://example.org.il',

  i18n: {
    // Hebrew is the default and lives at `/`. English will live at `/en/` once it has content.
    defaultLocale: 'he',
    locales: ['he', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  fonts: [
    {
      // Display face for headings and the wordmark. Hebrew letters only, bold only.
      provider: fontProviders.local(),
      name: 'Kehila Serif',
      cssVariable: '--font-kehila',
      fallbacks: ['Frank Ruhl Libre', 'serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/KehilaSerif-Bold.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
    {
      // Body face. Also covers digits and Latin, which Kehila Serif lacks.
      provider: fontProviders.local(),
      name: 'Frank Ruhl Libre',
      cssVariable: '--font-frank-ruhl',
      fallbacks: ['serif'],
      options: {
        variants: [
          {
            src: [`${frankRuhl}/frank-ruhl-libre-hebrew-wght-normal.woff2`],
            weight: '300 900',
            style: 'normal',
            unicodeRange: [
              'U+0307-0308',
              'U+0590-05FF',
              'U+200C-2010',
              'U+20AA',
              'U+25CC',
              'U+FB1D-FB4F',
            ],
          },
          {
            src: [`${frankRuhl}/frank-ruhl-libre-latin-wght-normal.woff2`],
            weight: '300 900',
            style: 'normal',
            unicodeRange: [
              'U+0000-00FF',
              'U+0131',
              'U+0152-0153',
              'U+02BB-02BC',
              'U+02C6',
              'U+02DA',
              'U+02DC',
              'U+2000-206F',
              'U+2122',
              'U+2191',
              'U+2193',
              'U+2212',
              'U+2215',
              'U+FEFF',
              'U+FFFD',
            ],
          },
        ],
      },
    },
    {
      // Midrash Aviv sub-brand face, used only inside that section.
      provider: fontProviders.local(),
      name: 'Aviv Display',
      cssVariable: '--font-aviv',
      fallbacks: ['Frank Ruhl Libre', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/AvivDisplay-Regular.woff2'], weight: 400, style: 'normal' },
        ],
      },
    },
  ],
});

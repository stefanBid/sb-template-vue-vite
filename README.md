# sb-template-vue-vite

Production-ready **Vue 3 + Vite** starter for client-side web applications: Tailwind CSS v4 closed design system, base components, i18n, dark/light theme, notification system.

**Stack:** Vue 3 (`<script setup>`) · Vite · Vue Router · Tailwind v4 · vue-i18n · VueUse · unplugin-icons (lucide, flagpack) · Fontsource · `sb-floating-panel-vue` · TypeScript strict · ESLint · Netlify.

It is the client-side sibling of `sb-template-nuxt`: same components, same design system, same conventions — configured the Vue + Vite way (explicit imports, no SSR, no auto-imports).

---

## Quick start

### 1. Create your project

Click **Use this template** on GitHub (leave *Include all branches* off), then clone your new repo:

```bash
git clone https://github.com/<you>/<your-project>.git
cd <your-project>
```

### 2. Install

Requires Node **24.19.0** (`nvm use`).

```bash
npm ci
npm run dev          # http://localhost:5173
```

### 3. Make it yours

| What | Where |
|---|---|
| Project name, version (`0.0.1`) | `package.json` |
| Site name, title template, social links | `src/config/app.ts` |
| Default `<title>`, `theme-color`, favicon | `index.html`, `public/` |
| Pages and their title/description | `src/views/`, `src/router/index.ts`, `meta.*` keys in `src/i18n/locales/` |
| Languages | `src/i18n/index.ts` (`SUPPORTED_LOCALES`), one `src/i18n/locales/<code>.json` each, the `langs` list in `src/layouts/DefaultLayout.vue` |
| Palette | `--sb-primary*` tokens in `src/assets/css/theme.css` (both themes) |
| Fonts | see [Fonts](#fonts) |

Then delete `CHANGELOG.md` (if present) and `.github/workflows/release-please.yml`, or keep release-please and remove its `if: github.repository == …` guard. `.template-version` records which template release you started from — keep it, it helps with future migrations.

---

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type check + production build (`dist/`) |
| `npm run build-only` | Production build without type check |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | `vue-tsc --build` |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run si` | Safe install: `npm ci` on `main`, `npm install` elsewhere |

On `main` always `npm ci`, never `npm install`.

---

## Project layout

```
index.html          entry HTML: base meta, noindex, theme script (no flash of the wrong theme)
public/             static files served as-is (favicon, logo, robots.txt, example images)
src/
  main.ts           creates the app: fonts, global CSS, i18n, router, global error handler
  App.vue           picks the layout from route.meta, page transition, title/description, error view
  assets/css/       main.css, theme.css, typography.css, animation.css
  components/       base/ (reusable) · the-* (layout singletons)
  composables/      useAppColorMode, useAppError, useAppNotifications, useLockScroll,
                    usePageTransition, usePointerHighlight, useSanitize, useScrollSpy
  config/app.ts     public branding (site name, title template, social links)
  i18n/             vue-i18n instance (index.ts) and locales/*.json
  layouts/          DefaultLayout.vue (header, footer, notifications)
  router/           routes, scroll behaviour, route meta typing
  types/global.d.ts shared global types
  utils/            pure helpers (blocksToHtml, generateUuid)
  views/            one component per route (HomeView, ErrorView)
vite.config.ts      Vite plugins: vue, tailwindcss, unplugin-icons, unplugin-vue-i18n · alias @ → src
eslint.config.ts    ESLint flat config (eslint-plugin-vue + typescript-eslint + @stylistic)
```

---

## Conventions

- **i18n:** never hardcode strings. Use `t()` from `useI18n()` (or `$t()` in templates); add every key to all files in `src/i18n/locales/`. Code and comments in English.
- **Components:** `Base*` = reusable, no business logic; `The*` = layout singletons. Files PascalCase, composables `useX.ts` with a named export, utils camelCase.
- **Imports:** explicit everywhere — Vue APIs from `vue`, components by path (`@/components/...`), composables from `@/composables/...`. No auto-imports.
- **Script order:** Dependencies → Input/Output → Data → Events. Handlers `onX`, private helpers `_x`.
- **Props:** inline interface + `withDefaults`; `defineEmits` with call signatures; `defineModel<T>('name')`.
- **TypeScript strict:** no `any`. Shared types live in `src/types/global.d.ts`.
- **Styling:** Tailwind utilities only, closed design system — role tokens (`text-ink`, `bg-surface`, `bg-primary`, `border-border`), type roles (`sb-h1`…`sb-small`), `sb-transition`, `sb-focus`. No raw hex, no `dark:` variants, no `<style>` blocks. Dynamic classes via `:class` bindings.
- **Icons:** components from `~icons/<collection>/<name>` (see [Icons](#icons)), `aria-label` on icon-only buttons.
- **Accessibility:** labels, `aria-describedby` / `aria-invalid` on form errors.
- **ESLint:** no semicolons, single quotes, trailing commas, alphabetical attributes. Never use `eslint-disable` — fix the code.
- Never write `v-html` directly; use `BaseRichText` (sanitized with DOMPurify).

Explore `src/components/base/` for the available components and their props — the component file is the source of truth.

---

## Pages and routing

Routes are declared in `src/router/index.ts`. The home page is imported statically; every other page is lazy-loaded:

```ts
{
  path: '/about',
  name: 'about',
  component: () => import('@/views/AboutView.vue'),
  meta: { titleKey: 'meta.about.title', descriptionKey: 'meta.about.description' },
}
```

Route meta (typed in the same file):

| Field | Effect |
|---|---|
| `titleKey` | i18n key of the document title, combined with `appConfig.site.titleTemplate` |
| `descriptionKey` | i18n key of the `<meta name="description">` |
| `layout` | `'default'` (when omitted) or `false` to render the page without header and footer |

`scrollBehavior` restores the saved position on back/forward and scrolls smoothly to `#hash` anchors. Navigating between two URLs of the same route (only params change) skips the page transition.

**Errors:** unknown URLs hit the catch-all route and render `ErrorView` (404). Uncaught errors in components, hooks or lazy page loading go through `app.config.errorHandler` / `router.onError` and replace the page with the same view (`useAppError`).

**Deploy:** being a single-page app, the server must answer every path with `index.html` — `netlify.toml` already has the rewrite.

**SEO:** this is a web application, not a website — `index.html` sets `noindex, nofollow` and `public/robots.txt` disallows crawling. Pages only manage their title and description.

---

## Design system

Colours, shadows, radii, type scale and motion are closed token sets in `src/assets/css/` — read `theme.css` and `typography.css`, they are the reference.

- `main.css` is the only file imported (from `src/main.ts`); it imports Tailwind and the other three.
- `theme.css`: colour roles for both themes (`:root` / `[data-theme="dark"]`), shadows, radii, breakpoints. Literal colours live only here.
- `typography.css`: families, type scale and the `sb-*` type roles.
- `animation.css`: durations, easings, `sb-transition`, `sb-focus` and the Vue transition classes (`page`, `fade`, `slide-down`, `scale-fade`).

### Theme

`useAppColorMode()` (VueUse `useColorMode`) writes `data-theme` on `<html>` and saves the choice in `localStorage` (`sb-color-mode`); `auto` follows the system. The inline script in `index.html` applies the same value before the app mounts, so the first paint already has the right theme.

### Fonts

Self-hosted with [Fontsource](https://fontsource.org): the `.woff2` files are npm packages bundled by Vite, no request to Google at runtime. Only the weights the type scale uses are imported, in `src/main.ts`:

```ts
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

To change a font: install `@fontsource/<name>`, update those imports, then `--font-display` / `--font-body` in `typography.css` (the family name must match the one Fontsource registers).

### Icons

[unplugin-icons](https://github.com/unplugin/unplugin-icons) compiles each icon into a Vue component at build time from the local `@iconify-json/*` collections — only the icons you import end up in the bundle, nothing is fetched at runtime.

```vue
<script setup lang="ts">
import IconLucideCheck from '~icons/lucide/check'
</script>

<template>
  <IconLucideCheck class="size-5 text-primary" />
</template>
```

Components that show an icon take it as a prop of type `Component` (`<BaseIconButton :icon="IconLucideX" />`). Browse names on [icones.js.org](https://icones.js.org); to add a collection, install `@iconify-json/<collection>`.

---

## Internationalization

[vue-i18n](https://vue-i18n.intlify.dev) in Composition API mode; messages in `src/i18n/locales/*.json` are precompiled at build time by `@intlify/unplugin-vue-i18n`. The message schema is typed from `en.json` (`DefineLocaleMessage`), which gives key autocompletion in the editor; `t()` still accepts any string, so keep every locale file in sync by hand.

There is no locale prefix in the URL: on the first visit the locale comes from the browser languages (fallback `en`), then the user's choice is saved in `localStorage` (`sb-locale`) and mirrored on `<html lang>`.

To add a language: add its code to `SUPPORTED_LOCALES` and its JSON to `messages` in `src/i18n/index.ts`, create the locale file with the same keys, and add an entry (with a flag icon) to `langs` in `src/layouts/DefaultLayout.vue`.

---

## Environment variables

Vite exposes only variables prefixed with `VITE_` through `import.meta.env`. Copy `.env.example` to `.env.local`, and type every new variable in `src/env.d.ts`. Everything ends up in the client bundle: no secrets.

---

## Versioning and branches

- Releases use [release-please](https://github.com/googleapis/release-please) on conventional commits (`feat:`, `fix:`, `feat!:`). In **this template** it manages tags and `CHANGELOG.md`; its workflow only runs on the template repository.
- `main` is the only long-lived branch and changes only through pull requests from short-lived branches (`feat/…`, `fix/…`, `chore/deps-…`). PR titles are linted against the conventional-commit format.
- CI (`.github/workflows/ci.yml`): lint, type check and build on every pull request into `main`.
- Deployment target: Netlify (`netlify.toml`).

## License

See `LICENSE`.

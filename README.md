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
| Project name, version (reset it, e.g. `0.0.1`) | `package.json` |
| Site name, title template, social links | `src/config/app.ts` |
| Default `<title>`, `theme-color` | `index.html` |
| Logo and icons | `public/logo.svg`, `public/favicon.svg`, `public/favicon.ico` (16/32/48), `public/apple-touch-icon.png` (180, opaque) |
| Pages and their title/description | `src/views/`, `src/router/index.ts`, `meta.*` keys in `src/i18n/locales/` |
| Languages | `src/i18n/index.ts` (`SUPPORTED_LOCALES`), one `src/i18n/locales/<code>.json` each, the `langs` list in `src/layouts/DefaultLayout.vue` |
| Palette | `--sb-primary*` and neutral tokens in `src/assets/css/theme.css` (both themes), `--sb-brand-*` for your logo colors |
| Fonts | see [Fonts](#fonts) |

Then delete `CHANGELOG.md` (if present), `.github/workflows/release-please.yml`, `release-please-config.json` and `.release-please-manifest.json`, or keep release-please: remove the workflow's `if: github.repository == …` guard, set `package-name` in `release-please-config.json` and the version in `.release-please-manifest.json`. `.template-version` records which template release you started from — keep it, it helps with future migrations.

GitHub does not copy repository settings, rulesets or security features from a template: set them up again on your repo (see [CI and repository rules](#ci-and-repository-rules)).

---

## Claude Code plugins (optional)

The `sb-context-fe` plugins (`sb-core`, `sb-github`, `sb-health`, `sb-design`) add shortcuts. They live outside your repo. The context they write goes in `.sb-context/`, which this template ignores (it is the maintainer's local context); in your project, remove the `.sb-context/` line from `.gitignore` to commit it (personal files then stay out through the folder's own `.gitignore`):

```
/plugin marketplace add stefanBid/sb-context-fe
/plugin install sb-context-fe@sb-context-fe
```

| Skill | Say |
|---|---|
| `/sb-core:setup` | "set up the plugin on this project" (run first) |
| `/sb-core:context` | "set up the project docs" (the links block in `CLAUDE.md`) |
| `/sb-health:build` | "check the build" |
| `/sb-health:lint` | "check the lint" |
| `/sb-health:deps` | "check dependencies" |
| `/sb-health:docs` | "update the documentation" |
| `/sb-design:align` | "reorganize the global style" |
| `/sb-github:admin` | "open a PR", "set up the branch rules" |

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
| `npm run clear` | Removes `dist`, `dist-ssr`, `coverage`, `.netlify` and `node_modules`, then cleans the npm cache (reinstall with `npm run si`) |

On `main` always `npm ci`, never `npm install`.

---

## Project layout

```
.github/workflows/  build-check.yml, commitlint.yml, release-please.yml
.github/rulesets/   main-protected.json: the main ruleset, to apply on your repo
CLAUDE.md           instructions for Claude Code: links to the official docs of the stack
index.html          entry HTML: base meta, noindex, theme script (no flash of the wrong theme)
netlify.toml        Netlify build and SPA rewrite
public/             static files served as-is (favicon, logo, robots.txt, example images)
scripts/            safe-install.sh (npm run si), clear.sh (npm run clear)
src/
  main.ts           creates the app: fonts, global CSS, i18n, router, global error handler
  env.d.ts          Vite client types and ImportMetaEnv (type VITE_* variables here)
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
- Brand tokens (`--sb-brand-green`, `-purple`, `-cyan`, `-yellow`, `--sb-brand-gradient`, utility `bg-brand-gradient`) carry the logo colors and are the same in both themes. The UI reaches them through roles, each with an AA-safe shade per theme (`#42b883` and `#41d1ff` stay pure in the dark theme, darker in the light one):

  | Brand color | Role | Used for |
  |---|---|---|
  | green `#42b883` | `primary` | actions, links, active navigation |
  | purple `#bd34fe` | `accent` | focus ring (`focus-ring`), `accent` badges |
  | cyan `#41d1ff` | `info` | info notifications, badges and tints |
  | yellow `#ffdd35` | `highlight` / `on-highlight` | text selection, `<mark>` (always dark text on top) |

  Use the raw `brand-*` colors and `bg-brand-gradient` only for brand moments (logo, icons, the token showcase), never on controls, text or borders.
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

- Releases use [release-please](https://github.com/googleapis/release-please) on conventional commits (`feat:`, `fix:`, `feat!:`), configured in `release-please-config.json` and `.release-please-manifest.json`. In **this template** it manages tags and `CHANGELOG.md`; its workflow only runs on the template repository (see [Make it yours](#3-make-it-yours)).
- `main` is the only long-lived branch and changes only through pull requests from short-lived branches (`feat/…`, `fix/…`, `chore/deps-…`).
- Deployment target: Netlify (`netlify.toml`).

<!-- ci-and-rules:start -->
## CI and repository rules

### Workflows (copied with the template)

| File | Runs on | What it does | Required check |
|---|---|---|---|
| `build-check.yml` | PR into `main`, push to `main` | lint, type check, build; skips drafts, bot PRs and docs-only changes (`**/*.md`, `LICENSE`, `.claude/`, `.sb-context/`, `.impeccable/`) | `build` |
| `commitlint.yml` | PR into `main` (also when the title is edited) | the PR title follows Conventional Commits (it becomes the squash commit read by release-please) | `commitlint` |
| `release-please.yml` | push to `main` | version, changelog, tag, GitHub Release; runs only on `stefanBid/sb-template-vue-vite` (delete it in your copy, or remove the guard if you want releases: see [Make it yours](#3-make-it-yours)) | — |

Change the commands in `build-check.yml` (the `Lint`, `Type check`, `Build` steps; add a `Test` step when the project has tests). The job names are the required checks: renaming one means updating the ruleset too.

### Ruleset `main-protected` on `main` (NOT copied: apply it on the new repo)

| Rule | State | Notes |
|---|---|---|
| Restrict deletions | on | `main` cannot be deleted |
| Block force pushes | on | |
| Require a pull request before merging | on | 0 approvals (solo maintainer), squash only; `require_extra_approval_for_unattributed_changes` on |
| Require status checks to pass | on | `build`, `commitlint` (GitHub Actions); "up to date with main" off (release-please moves `main` at every merge) |
| Require linear history | off | squash merges already keep `main` linear |
| Restrict creations / updates | off | |
| Require signed commits | off | |
| Require deployments to succeed | off | |
| Require code scanning results | off | |
| Bypass list | repository admins, pull requests only | release-please PRs are opened with `GITHUB_TOKEN`, so no workflow reports on them: an admin merges them through the bypass. Direct pushes stay blocked for everyone |

Apply it after the first CI run on `main` (otherwise the required checks never report):

```bash
gh api -X POST repos/{owner}/{repo}/rulesets --input .github/rulesets/main-protected.json
```

Customize: GitHub → Settings → Rules → Rulesets → `main-protected`, or edit the JSON and `gh api -X PUT repos/{owner}/{repo}/rulesets/<id> --input .github/rulesets/main-protected.json`. On a private repo rulesets need a paid plan.

### Merge settings (NOT copied)

| Setting | State |
|---|---|
| Squash merge | on, title = PR title, message = PR body |
| Merge commit / rebase merge | off |
| Delete branch on merge | on |
| Auto-merge | off |

```bash
gh api -X PATCH repos/{owner}/{repo} \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY
```

### Security (NOT copied)

| Feature | State | Why |
|---|---|---|
| Dependabot alerts | on | notifies vulnerable dependencies |
| Dependabot security updates | off | no automatic PRs: updates are done by hand |
| Dependabot version updates (`dependabot.yml`) | absent | it would only open PRs |
| Secret scanning + push protection | on | free on public repos; private ones need GitHub Advanced Security |

```bash
gh api -X PUT repos/{owner}/{repo}/vulnerability-alerts
gh api -X DELETE repos/{owner}/{repo}/automated-security-fixes
```

How often you are emailed about alerts is a personal setting: GitHub → Settings → Notifications → Dependabot alerts.
<!-- ci-and-rules:end -->

## License

See `LICENSE`.

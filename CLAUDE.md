# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`cleom-ui-platform` is the post-login dashboard of the CLEOM platform. Stack: **Next.js 16** (App Router) + **React 19** + **TypeScript strict** + **Tailwind v4** + **Supabase Auth** (`@supabase/ssr`) + **shadcn/ui**/Radix + **next-intl** (es/en/pt) + **Sonner**.

The companion landing site lives in a sibling repo `cleom-ui-landing`; design tokens come from `cleom-docs`; legacy pages being ported into placeholders here come from `cleom-Merge` (see "Porting placeholders" in `README.md`). Integration with `cleom-setup` (Docker, compose, helper scripts) treats this app as the service on port **3002**.

## Scripts

```bash
npm run dev          # next dev -p 3002
npm run build        # next build
npm run start        # next start -p 3002 (prod)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

There are no tests in this repo yet. Node `>=20.18.0` required.

## Auth — non-negotiable rules

These rules are enforced throughout `src/lib/supabase/*`, `proxy.ts`, and `src/app/(app)/layout.tsx`. Do not regress them:

1. **Always use `supabase.auth.getUser()` for authorization** — it verifies the JWT signature against the server. NEVER use `getSession()` for security checks (it only reads the cookie). This applies in `proxy.ts`, server components, route handlers, and the `(app)` layout's defense-in-depth guard.
2. **Cookies API must use `getAll`/`setAll`** — the older `get`/`set` pattern is deprecated and silently fails to refresh cookies in some cases. See `src/lib/supabase/server.ts` and `src/lib/supabase/middleware.ts` for the canonical shape.
3. **`process.env.NEXT_PUBLIC_*` must be accessed as static literals** (not `process.env[name]`). Next's bundler only inlines static accesses into client bundles — dynamic lookups end up `undefined` at runtime. See `src/lib/auth/redirects.ts`.
4. **Email callback flow uses `verifyOtp` (token_hash), not PKCE** — see `src/app/(public)/auth/callback/route.ts`. Supabase email templates must be customized to send `?token_hash=...&type=...&next=...` URLs instead of the default `{{ .ConfirmationURL }}` (which triggers PKCE and breaks if the email is opened in a different browser).

## Supabase Dashboard configuration

The auth flow depends on Dashboard config that lives outside this repo:

- **Authentication → URL Configuration** — Site URL must equal `NEXT_PUBLIC_APP_URL` (`http://localhost:3002` in dev). Redirect URLs must include `/auth/callback` and `/auth/update-password`. Without this, email links fail with `redirect_to is not allowed`.
- **Authentication → Email Templates** — Confirm signup / Reset password / Magic link / Invite / Email change must all be edited to emit `token_hash`-based URLs (see `callback/route.ts` for templates).

## Routing & layout architecture

Next 16 App Router with two route groups:

- `src/app/(public)/auth/...` — login, signup, recovery, update-password, callback (route handler that verifies the OTP and redirects).
- `src/app/(app)/...` — protected. Defense-in-depth: `(app)/layout.tsx` runs `getUser()` server-side and redirects to `/auth/login` if null, **on top of** the redirect already done by `proxy.ts`.

**`proxy.ts` is the Next 16 replacement for `middleware.ts`** — the file was renamed and the exported function is `proxy` (not `middleware`). It calls `updateSession` from `src/lib/supabase/middleware.ts`, which both refreshes the session cookie and enforces:

- no user + non-`/auth/*` route → redirect to `/auth/login`
- user + `/auth/*` route (except `/auth/callback` and `/auth/update-password`) → redirect to `/dashboard`

The shared authenticated UI is `AppShell` (`src/components/layout/AppShell.tsx`), which composes `AppHeader`, `Sidebar` (desktop/tablet collapsed), and `BottomNavBar` (mobile). Navigation is data-driven from `src/components/layout/navigation.config.ts` — `NAV_TABS`, `HIDE_NAV_PATHS`, `HIDE_HEADER_PATHS`, `ROUTE_TITLES`, `BACK_DESTINATIONS`. **Edit page chrome there, not in individual pages.**

## i18n (next-intl, Phase 7 stage 1)

Configured via `next.config.ts` (`createNextIntlPlugin('./src/i18n/request.ts')`) and `src/i18n/routing.ts` — locales `es | en | pt`, default `es`, `localePrefix: "as-needed"`. Today **routes are NOT under `[locale]/`**: the dashboard always serves the default locale; translations come from `useTranslations()` / `getTranslations()` against `messages/{locale}.json`. To upgrade to URL-based locales (`/en/dashboard`), follow the steps documented at the top of `routing.ts`.

## Data & profiles

`public.profiles` is a 1:1 with `auth.users`, populated by the `on_auth_user_created` trigger (`supabase/migrations/0001_init_profiles.sql`). This replaces the Clerk webhook pattern from the legacy `cleom-Merge` repo. Roles: `patient | doctor | admin`. Doctor status: `none | pending | approved | rejected`. RLS: users read their own profile (admins read all), update only their own profile, INSERT is blocked for clients (only the trigger writes).

`useCurrentProfile` (client) reads `profiles` and falls back to `auth.users` metadata if the table is missing — the fallback exists because the migration may not be applied in some envs.

## Phasing (in-flight migration)

Read `README.md` "Fases de migración" before adding pages. Currently:
- Phases 0–3, 7, 8: ✅ done.
- Phase 4 (patient pages, 15 routes): 🟡 placeholders with TODOs; real JSX/hooks pending.
- Phase 5 (Supabase RPCs + Edge Functions): ☐ tied to Phase 4.
- Phase 6 (doctor + admin, 7 routes): 🟡 placeholders; `RoleGuard` / `AdminGuard` not yet implemented.

Hooks and guards listed at the bottom of `README.md` are the canonical "to-do" list — when porting a page from `cleom-Merge`, follow the recipe in that section (RR-DOM → next/navigation, Clerk → Supabase, etc.).

## Conventions

- Path alias: `@/*` → `src/*`.
- Tailwind v4 — design tokens are in `src/app/globals.css` via `@theme inline`. **No `tailwind.config.ts`.** Tokens are kept 1:1 with the landing repo / `cleom-docs/design-system.md`.
- shadcn-style primitives live in `src/components/ui/`. Compose from these instead of installing new UI libs.
- `cn()` helper in `src/lib/utils.ts`.
- Sign out is a POST to `/api/auth/signout` (not a client-side `supabase.auth.signOut()`), so cookies are cleared server-side.
- Comments throughout the codebase are in Spanish — match the existing language when editing.

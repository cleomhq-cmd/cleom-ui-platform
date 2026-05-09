# cleom-ui-platform

Dashboard post-login de la plataforma CLEOM. Next.js 16 + React 19 + Tailwind v4 + Supabase Auth.

## Quick start

```bash
# 1. Variables de entorno
cp .env.example .env.local
# Editar SUPABASE_URL, SUPABASE_KEY, NEXT_PUBLIC_APP_URL

# 2. Instalar
npm install

# 3. Levantar
npm run dev
# → http://localhost:3002
```

## Variables de entorno

Ver [`.env.example`](./.env.example). Mínimas para correr:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. |
| `NEXT_PUBLIC_APP_URL` | Origen del frontend (default `http://localhost:3002`). Debe coincidir con Site URL en Supabase Dashboard. |
| `NEXT_PUBLIC_AUTH_CALLBACK_PATH` | Path del callback (default `/auth/callback`). |
| `NEXT_PUBLIC_AUTH_RECOVERY_REDIRECT_PATH` | Path del flow de reset password (default `/auth/update-password`). |

## Deploy en Vercel

Vercel auto-detecta Next.js. `vercel.json` solo fija `"framework": "nextjs"` para evitar autodetección incorrecta si el repo se importa dentro de un monorepo.

### Primer deploy

1. Sube el repo a GitHub/GitLab/Bitbucket.
2. En Vercel: **New Project → Import** y elige el repo. Root: la carpeta del proyecto (no la del monorepo `cleom-setup`).
3. **Environment Variables** — agregar las 5 vars de la tabla de arriba. Para producción, `NEXT_PUBLIC_APP_URL` debe ser el dominio público (p.ej. `https://app.cleom.com`), no `localhost:3002`.
4. **Deploy**.

### Supabase Dashboard — actualizar URLs antes del primer login en prod

Una vez que tengas el dominio de Vercel (o el custom domain), volvé a **Authentication → URL Configuration** y agregá:

| Campo | Valor (prod) |
|---|---|
| Site URL | `https://app.cleom.com` (o el dominio real) |
| Redirect URLs | `https://app.cleom.com/auth/callback`, `https://app.cleom.com/auth/update-password` |

Sin esto, el callback de OAuth/email rechaza el redirect y el usuario queda atascado tras hacer click en el email.

### Notas

- `npm run start -p 3002` no se usa en Vercel — corre serverless con su propio runtime. El `-p 3002` solo aplica a `npm run dev`/`npm run start` locales.
- Headers de seguridad (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`) están en `next.config.ts`. HSTS lo agrega Vercel.
- `proxy.ts` (Next 16, ex `middleware.ts`) maneja la protección de rutas + refresh de cookies Supabase. Vercel lo ejecuta como Edge Middleware automáticamente.

## Configuración requerida en Supabase Dashboard

Antes de probar el flow de auth completo (signup → email → login), ir al proyecto Supabase → **Authentication → URL Configuration**:

| Campo | Valor (dev) |
|---|---|
| Site URL | `http://localhost:3002` |
| Redirect URLs | `http://localhost:3002/auth/callback`, `http://localhost:3002/auth/update-password` |

Sin esto, los links del email apuntan a un fallback y el callback falla con `redirect_to is not allowed`.

## Stack

- **Next.js 16** con App Router. Nota: `middleware.ts` se renombró a `proxy.ts`.
- **React 19** + TypeScript strict.
- **Tailwind v4** con `@theme inline` en `globals.css` (sin `tailwind.config.ts`).
- **Supabase Auth** vía `@supabase/ssr` (cookies SSR-compatible).
- **shadcn/ui** primitives + Radix.
- **Sonner** para toasts.

## Estructura

```
src/
├── app/
│   ├── globals.css                 # Design tokens (paleta cleom-ui-landing 1:1)
│   ├── layout.tsx                  # Root: fonts + ThemeProvider + Toaster
│   ├── page.tsx                    # Redirect según sesión
│   │
│   ├── (public)/auth/              # Rutas públicas
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── recovery/page.tsx
│   │   ├── update-password/page.tsx
│   │   └── callback/route.ts       # Canjea code → session
│   │
│   ├── (app)/                      # Rutas protegidas
│   │   ├── layout.tsx              # getUser() + redirect si null
│   │   └── dashboard/page.tsx
│   │
│   └── api/auth/signout/route.ts   # POST → signOut + redirect
│
├── components/
│   ├── auth/                       # Forms (login, signup, recovery, update-password)
│   ├── providers/ThemeProvider.tsx
│   ├── shared/Logo.tsx
│   └── ui/                         # button, input, label, card
│
└── lib/
    ├── auth/redirects.ts           # Helpers de URLs construidas con env vars
    ├── supabase/
    │   ├── client.ts               # createBrowserClient
    │   ├── server.ts               # createServerClient (RSC)
    │   └── middleware.ts           # updateSession para proxy.ts
    └── utils.ts                    # cn()

proxy.ts                            # Next 16 (ex middleware.ts) — protege rutas
```

## Reglas de auth (no negociables)

1. **Cookies API**: SIEMPRE `getAll`/`setAll`. El patrón viejo `get`/`set` está deprecado.
2. **Autorización**: SIEMPRE `supabase.auth.getUser()` (verifica firma JWT). NUNCA `getSession()` (lee cookie sin verificar) para checks de seguridad.
3. **Site URL / Redirect URLs**: configurados manualmente en Supabase Dashboard (ver arriba).

## Scripts

```bash
npm run dev          # next dev -p 3002
npm run build        # next build
npm run start        # next start -p 3002 (producción)
npm run typecheck    # tsc --noEmit
npm run lint
```

## Fases de migración

- ✅ **Fase 0** — `cleom-docs` con design tokens (carpeta hermana).
- ✅ **Fase 1** — Scaffold + auth completo (login, signup, recovery, update-password, callback, signout).
- ✅ **Fase 2** — Schema `profiles` + trigger `on_auth_user_created` (`supabase/migrations/0001_init_profiles.sql`).
- ✅ **Fase 3** — AppShell (`AppHeader`, `Sidebar`, `BottomNavBar`, `UserMenu`, `navigation.config.ts`) + hooks `useCurrentProfile`, `useUserRole`, `useNotifications`, `useIsMobile`/`useIsTablet`.
- 🟡 **Fase 4** — Patient pages: rutas + placeholders con TODOs accionables (15 rutas). Falta el JSX real de cada página + sus hooks (HealthDashboardHero, WalletSectionCard, TriageChat, AICopilot, etc.).
- ☐ **Fase 5** — Conexión real a RPCs Supabase + Edge Functions (`rpc_get_health_dashboard_v1`, `triage-baseline`, `ai-health-copilot`, etc.). Tied a Fase 4 por placeholder.
- 🟡 **Fase 6** — Doctor + Admin: rutas + placeholders (7 rutas). Falta migrar `DoctorInboxPage`, `DoctorCasePage`, `AdminDoctorApplicationsPage` + guards (`RoleGuard`, `AdminGuard`).
- ✅ **Fase 7** — i18n con `next-intl` (es / en / pt). Stage 1: locale único por sesión. Stage 2 futuro: mover rutas bajo `[locale]/` para URLs `/en/dashboard`.
- ✅ **Fase 8** — Integración a `cleom-setup`: Dockerfile, bloque `docker-compose.yml` (puerto 3002), override hot-reload, scripts (`cleom.sh`, `logs.sh`, `clone-repos.sh`, `doctor.sh`), `generate-envs.py` con `VAR_MAP` (`NEXT_PUBLIC_SUPABASE_URL` ← `SUPABASE_URL`).

## Cómo portar una página de placeholder a producción

Cada placeholder en `src/app/(app)/` documenta su origen en `cleom-Merge/` y los TODOs.

1. Abrí `cleom-Merge/src/pages/<NombrePage>.tsx`.
2. Imports a adaptar:
   - `react-router-dom` → `next/navigation` (`useNavigate` → `useRouter`, `useLocation` → `usePathname`, `useParams` igual).
   - `<Link to=...>` de RR → `<Link href=...>` de `next/link`.
3. Auth:
   - `useUser()`/`useClerk()` → `useCurrentProfile()` (cliente) o `createClient()` de `@/lib/supabase/server` (RSC).
   - `signOut(...)` → `fetch('/api/auth/signout', { method: 'POST' })`.
4. Data fetching: usar el cliente correcto (server/client) y los RPCs que ya existen en el Supabase compartido con cleom-Merge.
5. Reusá los componentes ya portados (`AppShell`, `UserMenu`, `Logo`, `Card`, `Button`, etc.) y respetá los tokens de `cleom-docs/design-system.md`.

**Hooks pendientes**: `useHealthDashboard`, `useClinicalHistory`, `useClinicalSummaries`, `useTriageSessions`, `useTriageConversations`, `useAIHealthCopilot`, `useDoctorCase`, `useDoctorInbox`, `useBaselineGate`, `useConsent`, `useOnboardingStatus`.

**Guards pendientes**: `RoleGuard`, `AdminGuard`, `ConsentGuard`, `OnboardingGuard` — implementar como server components que llaman `getUser()` + leen profile y redirigen.

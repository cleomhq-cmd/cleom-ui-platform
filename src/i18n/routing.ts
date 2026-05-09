import { defineRouting } from "next-intl/routing";

/**
 * i18n routing — Fase 7 stage 1.
 *
 * Hoy NO se exponen locales en la URL: el dashboard sirve siempre con el
 * `defaultLocale`. Las traducciones funcionan via `useTranslations()` /
 * `getTranslations()` con los messages files en /messages/{locale}.json.
 *
 * Para upgradar a URLs con locale (`/es/dashboard`, `/en/dashboard`):
 * 1. Mover todas las rutas bajo `src/app/[locale]/...`.
 * 2. Crear `src/app/[locale]/layout.tsx` que llame `setRequestLocale(locale)`.
 * 3. Cambiar `localePrefix` a `"always"` o `"as-needed"`.
 * 4. Agregar middleware de next-intl para detectar locale y redirigir.
 */
export const routing = defineRouting({
  locales: ["es", "en", "pt"] as const,
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

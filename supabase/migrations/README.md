# Supabase Migrations

SQL versionado por timestamp. Sin runner automático — se aplican manualmente.

## Convención

`NNNN_<verb>_<entity>.sql` con prefijo numérico secuencial de 4 dígitos.

## Cómo aplicar

### Opción A — `psql` directo

```bash
# Cargá la URL desde tu .env.local (NO commitear)
psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init_profiles.sql
```

> Si el password tiene `$` u otros caracteres especiales, entrecomillá la URL para evitar que la shell expanda variables.

### Opción B — Supabase SQL Editor

1. Dashboard del proyecto → SQL Editor → New query.
2. Pegar el contenido del `.sql`.
3. Run.

## Estado

| Archivo | Aplicada | Notas |
|---|---|---|
| `0001_init_profiles.sql` | _pendiente_ | Crea `profiles` + trigger `on_auth_user_created` (reemplaza el clerk-webhook). Aplicar antes de probar signup. |

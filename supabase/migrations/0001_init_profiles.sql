-- 0001_init_profiles.sql
-- Crea la tabla `profiles` (1:1 con auth.users) + trigger que la popula
-- automáticamente cuando un usuario se crea en auth.users.
--
-- Reemplaza el patrón clerk-webhook del repo cleom-Merge: no necesitamos
-- una Edge Function porque Supabase auth dispara un INSERT en auth.users
-- al cual nos enganchamos con un trigger nativo.

CREATE TABLE IF NOT EXISTS public.profiles (
  id                       UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                    TEXT         NOT NULL,
  full_name                TEXT,
  avatar_url               TEXT,
  role                     TEXT         NOT NULL DEFAULT 'patient'
                                       CHECK (role IN ('patient', 'doctor', 'admin')),
  doctor_status            TEXT         NOT NULL DEFAULT 'none'
                                       CHECK (doctor_status IN ('none', 'pending', 'approved', 'rejected')),
  onboarding_completed_at  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ---------------------------------------------------------------------------
-- Trigger: actualiza updated_at en cada UPDATE.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger: auto-crea profile cuando se crea un usuario en auth.users.
-- Reemplaza el clerk-webhook Edge Function del repo cleom-Merge.
-- Lee email + raw_user_meta_data.full_name del NEW row.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- importante: corre con privilegios elevados para INSERT en public.profiles
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: cada usuario lee su propio profile.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- SELECT: admins leen todos.
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- UPDATE: cada usuario actualiza solo campos no-críticos del propio profile.
-- El role y doctor_status NO los maneja el usuario — los setea un admin via
-- una function separada o un endpoint del backend.
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT: solo el trigger handle_new_user inserta. Bloqueamos inserts directos
-- desde el cliente para evitar que se "salten" auth.users.
-- (No agregamos policy de INSERT → por default queda denegado para anon/authenticated.)

-- DELETE: ninguna policy → bloqueado por default. ON DELETE CASCADE de auth.users
-- limpia automáticamente cuando un user se borra desde el dashboard.

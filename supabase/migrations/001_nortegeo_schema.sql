-- NorteGeo SaaS — schema completo (idempotente)
-- Execute no SQL Editor do Supabase ou via: supabase db push

-- Extensões
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('provider', 'client');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kanban_status AS ENUM (
    'prospeccao','analise','levantamento','execucao','finalizacao','concluido'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE stage_status AS ENUM ('pending','in_progress','completed','blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE expense_category AS ENUM ('campo','deslocamento','terceiros','proposta','imprevisto');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE org_status AS ENUM ('ativa','suspensa','cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Organizations ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  plan          TEXT NOT NULL DEFAULT 'starter',
  user_limit    INT  NOT NULL DEFAULT 5,
  cnpj          TEXT,
  address       TEXT,
  phone         TEXT,
  status        org_status NOT NULL DEFAULT 'ativa',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Profiles (extends auth.users) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role              user_role NOT NULL DEFAULT 'client',
  name              TEXT NOT NULL,
  cpf               TEXT,
  phone             TEXT,
  organization_id   UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Organization members ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role              user_role NOT NULL DEFAULT 'provider',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, profile_id)
);

-- ── Cost parameters ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cost_parameters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  key               TEXT NOT NULL,
  label             TEXT NOT NULL,
  value             NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit              TEXT,
  category          TEXT NOT NULL DEFAULT 'geral',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, key)
);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  client_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_profile_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  service_type        TEXT NOT NULL,
  kanban_status       kanban_status NOT NULL DEFAULT 'prospeccao',
  contract_price      NUMERIC(12,2),
  pricing_params      JSONB,
  field_notes         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Project stages ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_stages (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  weight                INT  NOT NULL DEFAULT 10,
  status                stage_status NOT NULL DEFAULT 'pending',
  typical_duration_days INT,
  estimated_cost        NUMERIC(12,2),
  actual_start_date     DATE,
  actual_end_date       DATE,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Project expenses ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category    expense_category NOT NULL DEFAULT 'campo',
  description TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Project deliverables ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_deliverables (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  file_path   TEXT,
  available   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON public.projects(client_profile_id);
CREATE INDEX IF NOT EXISTS idx_stages_project ON public.project_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON public.project_expenses(project_id);

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = COALESCE(EXCLUDED.role, profiles.role),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated ON public.projects;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deliverables ENABLE ROW LEVEL SECURITY;

-- Helper: is root admin (provider sem org)
CREATE OR REPLACE FUNCTION public.is_root_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'provider' AND organization_id IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.my_org_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Profiles policies
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (
  id = auth.uid() OR public.is_root_admin()
  OR organization_id = public.my_org_id()
);

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (
  id = auth.uid() OR public.is_root_admin()
);

DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (
  id = auth.uid() OR public.is_root_admin()
);

-- Organizations
DROP POLICY IF EXISTS org_all ON public.organizations;
CREATE POLICY org_all ON public.organizations FOR ALL USING (
  public.is_root_admin() OR id = public.my_org_id()
);

-- Cost parameters
DROP POLICY IF EXISTS cost_params_all ON public.cost_parameters;
CREATE POLICY cost_params_all ON public.cost_parameters FOR ALL USING (
  public.is_root_admin()
  OR organization_id IS NULL
  OR organization_id = public.my_org_id()
);

-- Projects
DROP POLICY IF EXISTS projects_all ON public.projects;
CREATE POLICY projects_all ON public.projects FOR ALL USING (
  public.is_root_admin()
  OR organization_id = public.my_org_id()
  OR client_profile_id = auth.uid()
  OR client_id = auth.uid()
);

-- Stages (via project access)
DROP POLICY IF EXISTS stages_all ON public.project_stages;
CREATE POLICY stages_all ON public.project_stages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (
    public.is_root_admin()
    OR p.organization_id = public.my_org_id()
    OR p.client_profile_id = auth.uid()
    OR p.client_id = auth.uid()
  ))
);

-- Expenses
DROP POLICY IF EXISTS expenses_all ON public.project_expenses;
CREATE POLICY expenses_all ON public.project_expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (
    public.is_root_admin()
    OR p.organization_id = public.my_org_id()
  ))
);

-- Deliverables
DROP POLICY IF EXISTS deliverables_all ON public.project_deliverables;
CREATE POLICY deliverables_all ON public.project_deliverables FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (
    public.is_root_admin()
    OR p.organization_id = public.my_org_id()
    OR p.client_profile_id = auth.uid()
    OR p.client_id = auth.uid()
  ))
);

-- Members
DROP POLICY IF EXISTS members_all ON public.organization_members;
CREATE POLICY members_all ON public.organization_members FOR ALL USING (
  public.is_root_admin() OR organization_id = public.my_org_id()
);

-- ── Storage bucket (requer extensão Storage habilitada no projeto) ──
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('project-files', 'project-files', false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    EXECUTE 'DROP POLICY IF EXISTS storage_project_files ON storage.objects';
    EXECUTE $p$
      CREATE POLICY storage_project_files ON storage.objects FOR ALL USING (
        bucket_id = 'project-files' AND (
          public.is_root_admin()
          OR (storage.foldername(name))[1] = auth.uid()::text
          OR auth.role() = 'authenticated'
        )
      )
    $p$;
  END IF;
END $$;

-- ── Seed cost parameters (globais) ───────────────────────────
INSERT INTO public.cost_parameters (organization_id, key, label, value, unit, category) VALUES
  (NULL, 'diaria_tecnico',     'Diária técnico',        450,   'R$/dia',  'campo'),
  (NULL, 'diaria_ajudante',    'Diária ajudante',       180,   'R$/dia',  'campo'),
  (NULL, 'custo_km',           'Custo por km',          2.5,   'R$/km',   'deslocamento'),
  (NULL, 'despesa_extra_dia',  'Despesa extra/dia',     80,    'R$/dia',  'campo'),
  (NULL, 'taxa_imposto',       'Taxa de imposto',       0.08,  '%',       'financeiro'),
  (NULL, 'lucro_alvo',         'Lucro alvo',            0.35,  '%',       'financeiro')
ON CONFLICT (organization_id, key) DO NOTHING;

-- ── Seed org demo ────────────────────────────────────────────
INSERT INTO public.organizations (name, slug, plan, user_limit, status)
VALUES ('NorteGeo Matriz', 'nortegeo-matriz', 'enterprise', 50, 'ativa')
ON CONFLICT (slug) DO NOTHING;

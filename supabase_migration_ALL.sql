-- ============================================================
-- MIGRAÇÃO COMPLETA — rode tudo de uma vez no SQL Editor do Supabase.
-- Idempotente: pode rodar mais de uma vez sem quebrar.
-- ============================================================

-- ---------- 1) tracks: ordenação, favoritos, uploads recentes ----------
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS favorite_order integer;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS show_in_recent boolean NOT NULL DEFAULT true;

-- ---------- 2) genres: ordem das seções ----------
CREATE TABLE IF NOT EXISTS public.genres (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Genres are viewable by everyone." ON public.genres;
CREATE POLICY "Genres are viewable by everyone."
  ON public.genres FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert genres." ON public.genres;
CREATE POLICY "Authenticated users can insert genres."
  ON public.genres FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update genres." ON public.genres;
CREATE POLICY "Authenticated users can update genres."
  ON public.genres FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete genres." ON public.genres;
CREATE POLICY "Authenticated users can delete genres."
  ON public.genres FOR DELETE USING (auth.role() = 'authenticated');

INSERT INTO public.genres (name, sort_order) VALUES
  ('Boombap', 0),
  ('Drum and Bass', 1),
  ('Trap Underground', 2),
  ('Hyper', 3),
  ('Plug', 4),
  ('Rock', 5),
  ('Fora da Caixa', 6)
ON CONFLICT (name) DO NOTHING;

-- ---------- 3) site_settings: layout + faixa em destaque ----------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  hero_title_line1 text NOT NULL DEFAULT 'Beats &',
  hero_title_line2 text NOT NULL DEFAULT 'Updates',
  hero_subtitle    text NOT NULL DEFAULT 'Produção musical e novidades',
  featured_enabled  boolean NOT NULL DEFAULT false,
  featured_track_id text,
  featured_message  text NOT NULL DEFAULT '',
  show_spotify   boolean NOT NULL DEFAULT true,
  show_favorites boolean NOT NULL DEFAULT true,
  show_recent    boolean NOT NULL DEFAULT true,
  favorites_first boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are viewable by everyone." ON public.site_settings;
CREATE POLICY "Site settings are viewable by everyone."
  ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert site settings." ON public.site_settings;
CREATE POLICY "Authenticated users can insert site settings."
  ON public.site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update site settings." ON public.site_settings;
CREATE POLICY "Authenticated users can update site settings."
  ON public.site_settings FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO public.site_settings (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

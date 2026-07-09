-- Migração: configurações de layout do site + faixa em destaque
-- Rode este script no SQL Editor do Supabase (depois de supabase_migration_playlists.sql).

-- Tabela de configurações do site (linha única, id = 'main')
CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY DEFAULT 'main',

  -- Textos do topo (Hero)
  hero_title_line1 text NOT NULL DEFAULT 'Beats &',
  hero_title_line2 text NOT NULL DEFAULT 'Updates',
  hero_subtitle    text NOT NULL DEFAULT 'Produção musical e novidades',

  -- Faixa em destaque no topo do site
  featured_enabled  boolean NOT NULL DEFAULT false,
  featured_track_id text,                 -- id da track em destaque (sem FK para evitar problema de tipo)
  featured_message  text NOT NULL DEFAULT '',

  -- Layout / visibilidade e ordem das seções na página inicial
  show_spotify   boolean NOT NULL DEFAULT true,
  show_favorites boolean NOT NULL DEFAULT true,
  show_recent    boolean NOT NULL DEFAULT true,
  favorites_first boolean NOT NULL DEFAULT true,  -- true: Favoritos antes de Uploads Recentes

  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone."
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert site settings."
  ON public.site_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update site settings."
  ON public.site_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Linha padrão
INSERT INTO public.site_settings (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

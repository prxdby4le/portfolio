-- Migração: ordenação de gêneros/músicas + playlists "Uploads Recentes" e "Favoritos"
-- Rode este script no SQL Editor do Supabase.

-- 1. Novas colunas na tabela tracks
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS favorite_order integer;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS show_in_recent boolean NOT NULL DEFAULT true;

-- sort_order: posição da música dentro do gênero (menor = primeiro)
-- favorite_order: NULL = não é favorita; número = posição na playlist de Favoritos
-- show_in_recent: se false, a música não aparece na playlist de Uploads Recentes

-- 2. Tabela de gêneros (controla a ordem das seções no site)
CREATE TABLE IF NOT EXISTS public.genres (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Genres are viewable by everyone."
  ON public.genres FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert genres."
  ON public.genres FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update genres."
  ON public.genres FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete genres."
  ON public.genres FOR DELETE
  USING (auth.role() = 'authenticated');

-- 3. Seed com a ordem atual dos gêneros
INSERT INTO public.genres (name, sort_order) VALUES
  ('Boombap', 0),
  ('Drum and Bass', 1),
  ('Trap Underground', 2),
  ('Hyper', 3),
  ('Plug', 4),
  ('Rock', 5),
  ('Fora da Caixa', 6)
ON CONFLICT (name) DO NOTHING;

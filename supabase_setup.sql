-- 1. Create Tracks Table
CREATE TABLE public.tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  genre text NOT NULL,
  bpm integer NOT NULL,
  track_key text,
  cover_url text NOT NULL,
  audio_url text NOT NULL,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup Row Level Security (RLS) for Tracks
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public tracks are viewable by everyone."
  ON public.tracks FOR SELECT
  USING (true);

-- Allow authenticated users (you) to insert/update/delete
CREATE POLICY "Authenticated users can insert tracks."
  ON public.tracks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tracks."
  ON public.tracks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tracks."
  ON public.tracks FOR DELETE
  USING (auth.role() = 'authenticated');

-- 3. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- 4. Setup Storage Policies for 'music' bucket
CREATE POLICY "Music is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

CREATE POLICY "Authenticated users can upload music"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update music"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete music"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'music' AND auth.role() = 'authenticated');

-- 5. Setup Storage Policies for 'covers' bucket
CREATE POLICY "Covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

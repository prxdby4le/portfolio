-- 1. Add new columns to tracks table
ALTER TABLE public.tracks 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS timeline_image_url text;

-- 2. Create Storage Bucket for timelines
INSERT INTO storage.buckets (id, name, public) VALUES ('timelines', 'timelines', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Setup Storage Policies for 'timelines' bucket
CREATE POLICY "Timelines are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'timelines');

CREATE POLICY "Authenticated users can upload timelines"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'timelines' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update timelines"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'timelines' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete timelines"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'timelines' AND auth.role() = 'authenticated');

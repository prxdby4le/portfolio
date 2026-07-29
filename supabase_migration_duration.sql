-- Real track lengths.
--
-- Until now the site printed a hardcoded "3:00" under every track, because the
-- duration was never stored anywhere. The admin panel reads the real length off
-- the audio file at upload time and writes it here.
--
-- Safe to run more than once.

alter table public.tracks
  add column if not exists duration_seconds integer;

comment on column public.tracks.duration_seconds is
  'Track length in whole seconds, read from the audio file on upload. Null for rows created before this column existed; the UI omits the duration in that case rather than inventing one.';

-- Existing rows stay null on purpose. The duration reappears for each track the
-- next time its audio is uploaded through the admin panel.

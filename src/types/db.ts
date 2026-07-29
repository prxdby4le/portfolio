/**
 * Shapes of the Supabase rows, as they come back from the client.
 *
 * The project does not use generated database types, so `select("*")` returns
 * `any`. These describe the columns by hand at the boundary where rows are
 * consumed, which is enough to stop `any` from spreading through the admin
 * panel and the hooks.
 *
 * Column names are snake_case here on purpose: this is the database row, not
 * the app's `Track`. `useTracks` maps between the two.
 */
export interface TrackRow {
  id: string;
  title: string;
  genre: string;
  bpm: number | null;
  track_key: string | null;
  cover_url: string;
  audio_url: string;
  tags: string[] | null;
  description: string | null;
  timeline_image_url: string | null;
  created_at: string;
  sort_order: number | null;
  favorite_order: number | null;
  show_in_recent: boolean | null;
  /** Added by supabase_migration_duration.sql; null on older rows. */
  duration_seconds: number | null;
  downloadable: boolean | null;
}

export interface PostRow {
  id: string;
  title: string;
  content: string;
  images: string[] | null;
  created_at: string;
}

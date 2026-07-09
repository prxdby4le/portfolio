export interface Track {
  id: string;
  title: string;
  genre: string;
  src: string;
  cover: string;
  bpm: number;
  key?: string;
  duration: string;
  tags: string[];
  downloadable?: boolean;
  description?: string;
  timeline_image?: string;
  created_at?: string;
  sort_order?: number;
  favorite_order?: number | null;
  show_in_recent?: boolean;
}

export interface Playlist {
  description: string;
  tracks: Track[];
}

export interface Playlists {
  [genre: string]: Playlist;
}

export interface SiteSettings {
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  featured_enabled: boolean;
  featured_track_id: string | null;
  featured_message: string;
  show_spotify: boolean;
  show_favorites: boolean;
  show_recent: boolean;
  favorites_first: boolean;
}

export interface Post {
  id: string;
  title: string;
  created_at: string;
  content: string; // Markdown text
  images?: string[]; // Array of image URLs
}
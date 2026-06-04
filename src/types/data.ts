export interface Track {
  id: string;
  title: string;
  src: string;
  cover: string;
  bpm: number;
  key?: string;
  duration: string;
  tags: string[];
  downloadable?: boolean;
  description?: string;
  timeline_image?: string;
}

export interface Playlist {
  description: string;
  tracks: Track[];
}

export interface Playlists {
  [genre: string]: Playlist;
}

export interface Post {
  id: string;
  title: string;
  created_at: string;
  content: string; // Markdown text
  images?: string[]; // Array of image URLs
}
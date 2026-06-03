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

export interface Visualizer {
  id: string;
  title: string;
  thumbnail: string;
  src: string;
  duration: string;
  category: string;
}

export interface VisualizersData {
  videos: Visualizer[];
}
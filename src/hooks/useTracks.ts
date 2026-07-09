import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Track, Playlists } from "@/types/data";

export interface TracksData {
  playlists: Playlists;
  allTracks: Track[];
}

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: async (): Promise<TracksData> => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const allTracks: Track[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        genre: row.genre,
        bpm: row.bpm,
        key: row.track_key || undefined,
        cover: row.cover_url,
        src: row.audio_url,
        tags: row.tags || [],
        duration: "3:00", // Would be calculated with an audio context if needed
        description: row.description || undefined,
        timeline_image: row.timeline_image_url || undefined,
        created_at: row.created_at,
        sort_order: row.sort_order ?? 0,
        favorite_order: row.favorite_order ?? null,
        show_in_recent: row.show_in_recent ?? true,
      }));

      // Group tracks into Playlists format, ordered by sort_order (created_at desc as tiebreak)
      const playlists: Playlists = {};

      [...allTracks]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .forEach((track) => {
          const genre = track.genre;
          if (!playlists[genre]) {
            playlists[genre] = {
              description: `Explore as melhores batidas de ${genre}.`,
              tracks: []
            };
          }
          playlists[genre].tracks.push(track);
        });

      return { playlists, allTracks };
    },
  });
}

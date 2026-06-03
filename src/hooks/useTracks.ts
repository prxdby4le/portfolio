import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Track, Playlists } from "@/types/data";

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Group tracks into Playlists format
      const playlists: Playlists = {};

      data.forEach((row: any) => {
        const genre = row.genre;
        if (!playlists[genre]) {
          playlists[genre] = {
            description: `Explore as melhores batidas de ${genre}.`, // We could make description dynamic later
            tracks: []
          };
        }

        const track: Track = {
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
        };

        playlists[genre].tracks.push(track);
      });

      return playlists;
    },
  });
}

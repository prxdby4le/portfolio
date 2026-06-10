import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Track, Playlists } from "@/types/data";
import GenreSection from "./GenreSection";
import SpotifyPlaylistSection from "./SpotifyPlaylistSection";
import { useTracks } from "@/hooks/useTracks";

interface BeatsGridProps {
  onPlayTrack: (track: Track) => void;
  onPlayAllGenre: (tracks: Track[]) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const GENRE_ORDER = [
  "Boombap",
  "Drum and Bass",
  "Trap Underground",
  "Hyper",
  "Plug",
  "Rock",
  "Fora da Caixa"
];

const tagColors = ['#FF0066', '#CC0052', '#FF3385', '#990040', '#E6005C', '#FF1A75', '#FF4D94', '#B30047'];

export default function BeatsGrid({ onPlayTrack, onPlayAllGenre, currentTrack, isPlaying }: BeatsGridProps) {
  const { data: playlistsData, isLoading, error } = useTracks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlists>({});

  useEffect(() => {
    // Start with all genres from GENRE_ORDER
    const basePlaylists: Playlists = {};
    GENRE_ORDER.forEach(genre => {
      basePlaylists[genre] = playlistsData?.[genre] || {
        description: `Explore as melhores batidas de ${genre}.`,
        tracks: []
      };
    });

    let filtered = { ...basePlaylists };
    
    if (searchQuery) {
      filtered = Object.entries(filtered).reduce((acc, [genre, playlist]) => {
        const filteredTracks = playlist.tracks.filter(track =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        // Show genre if it matches the search term, OR if it has matching tracks
        if (filteredTracks.length > 0 || genre.toLowerCase().includes(searchQuery.toLowerCase())) {
          acc[genre] = {
            ...playlist,
            tracks: filteredTracks
          };
        }
        
        return acc;
      }, {} as Playlists);
    }
    
    setFilteredPlaylists(filtered);
  }, [searchQuery, playlistsData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-aero-sky animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-12 text-center text-destructive">
        <p>Erro ao carregar as músicas. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Search and Filters */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-aero-sky" />
          <Input
            type="text"
            placeholder="Buscar beats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 text-sm sm:text-base glass h-9 sm:h-10 border border-aero-sky/20 focus:border-aero-sky placeholder:text-muted-foreground/50 font-medium"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 sm:space-y-12">
        <SpotifyPlaylistSection />
        
        {GENRE_ORDER.map(genre => {
          const playlist = filteredPlaylists[genre];
          if (!playlist) return null;
          
          return (
            <GenreSection
              key={genre}
              genre={genre}
              description={playlist.description}
              tracks={playlist.tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={onPlayTrack}
              onPlayAll={() => onPlayAllGenre(playlist.tracks)}
            />
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Track, Playlists } from "@/types/data";
import GenreSection from "./GenreSection";
import playlistsData from "@/data/playlists.json";

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

const ALL_TAGS = [
  "boom-bap", "sample", "energetic", "nostalgic", "experimental", "romantic", "dark", "piano", "chill", "psicodelic", "sad", "dnb", "drumbreak", "fast", "hopeful", "anxious", "chill", "vocals", "trap", "melodic", "emotional", "aggressive", "piano", "hyper", "synth", "4/4", "plug", "pluggnb", "slow", "funknb", "ritmadinha", "rock", "emotional", "indie", "emo", "jerk", "hoodtrap", "misterious", "beat switch", "Synthwave", "dance", "jersey", "winter"
];

export default function BeatsGrid({ onPlayTrack, onPlayAllGenre, currentTrack, isPlaying }: BeatsGridProps) {
  const [playlists] = useState<Playlists>(playlistsData as Playlists);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlists>(playlists);

  useEffect(() => {
    let filtered = { ...playlists };
    
    // Filter by search query
    if (searchQuery) {
      filtered = Object.entries(filtered).reduce((acc, [genre, playlist]) => {
        const filteredTracks = playlist.tracks.filter(track =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        if (filteredTracks.length > 0 || genre.toLowerCase().includes(searchQuery.toLowerCase())) {
          acc[genre] = {
            ...playlist,
            tracks: filteredTracks
          };
        }
        
        return acc;
      }, {} as Playlists);
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = Object.entries(filtered).reduce((acc, [genre, playlist]) => {
        const filteredTracks = playlist.tracks.filter(track =>
          selectedTags.some(tag => track.tags.includes(tag))
        );
        
        if (filteredTracks.length > 0) {
          acc[genre] = {
            ...playlist,
            tracks: filteredTracks
          };
        }
        
        return acc;
      }, {} as Playlists);
    }
    
    setFilteredPlaylists(filtered);
  }, [searchQuery, selectedTags, playlists]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar beats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-glass-border/20"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {ALL_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedTags.includes(tag) 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                  : "hover:bg-muted"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Genre Sections */}
      <div className="space-y-12">
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
import { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Track, Playlists } from "@/types/data";
import GenreSection from "./GenreSection";
import SpotifyPlaylistSection from "./SpotifyPlaylistSection";
import FeaturedTrack from "./FeaturedTrack";
import { useTracks } from "@/hooks/useTracks";
import { useGenres } from "@/hooks/useGenres";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { DEFAULT_GENRES } from "@/lib/genres";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

interface BeatsGridProps {
  onPlayTrack: (track: Track) => void;
  onPlayAllGenre: (tracks: Track[]) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const RECENT_UPLOADS_LIMIT = 10;

export default function BeatsGrid({ onPlayTrack, onPlayAllGenre, currentTrack, isPlaying }: BeatsGridProps) {
  const { data, isLoading, error } = useTracks();
  const { data: genreOrder } = useGenres();
  const { data: settingsData } = useSiteSettings();
  const settings = settingsData ?? DEFAULT_SITE_SETTINGS;
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();

  const matchesSearch = (track: Track) =>
    !query ||
    track.title.toLowerCase().includes(query) ||
    track.tags.some(tag => tag.toLowerCase().includes(query));

  const allTracks = data?.allTracks ?? [];

  // Uploads Recentes: últimas músicas enviadas (admin pode ocultar via show_in_recent)
  const recentTracks = useMemo(() => {
    return [...allTracks]
      .filter(t => t.show_in_recent !== false)
      .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
      .slice(0, RECENT_UPLOADS_LIMIT);
  }, [allTracks]);

  // Favoritos: seleção manual do admin, na ordem definida por favorite_order
  const favoriteTracks = useMemo(() => {
    return allTracks
      .filter(t => t.favorite_order !== null && t.favorite_order !== undefined)
      .sort((a, b) => (a.favorite_order ?? 0) - (b.favorite_order ?? 0));
  }, [allTracks]);

  // Faixa em destaque definida no admin (aba Layout)
  const featuredTrack = useMemo(() => {
    if (!settings.featured_enabled || !settings.featured_track_id) return null;
    return allTracks.find(t => t.id === settings.featured_track_id) ?? null;
  }, [allTracks, settings.featured_enabled, settings.featured_track_id]);

  // Ordem dos gêneros vinda do banco, com gêneros extras (fora da tabela) no final
  const orderedGenres = useMemo(() => {
    const base = genreOrder ?? DEFAULT_GENRES;
    const extras = Object.keys(data?.playlists ?? {}).filter(g => !base.includes(g));
    return [...base, ...extras];
  }, [genreOrder, data]);

  const filteredPlaylists = useMemo(() => {
    const basePlaylists: Playlists = {};
    orderedGenres.forEach(genre => {
      basePlaylists[genre] = data?.playlists?.[genre] || {
        description: `Explore as melhores batidas de ${genre}.`,
        tracks: []
      };
    });

    if (!query) return basePlaylists;

    return Object.entries(basePlaylists).reduce((acc, [genre, playlist]) => {
      const filteredTracks = playlist.tracks.filter(matchesSearch);

      // Show genre if it matches the search term, OR if it has matching tracks
      if (filteredTracks.length > 0 || genre.toLowerCase().includes(query)) {
        acc[genre] = {
          ...playlist,
          tracks: filteredTracks
        };
      }

      return acc;
    }, {} as Playlists);
  }, [orderedGenres, data, query]);

  const filteredRecent = recentTracks.filter(matchesSearch);
  const filteredFavorites = favoriteTracks.filter(matchesSearch);

  const favoritesSection = settings.show_favorites && filteredFavorites.length > 0 && (
    <GenreSection
      key="favoritos"
      genre="Favoritos"
      description="Seleção especial dos meus beats favoritos."
      tracks={filteredFavorites}
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      onPlayTrack={onPlayTrack}
      onPlayAll={() => onPlayAllGenre(filteredFavorites)}
    />
  );

  const recentSection = settings.show_recent && filteredRecent.length > 0 && (
    <GenreSection
      key="recentes"
      genre="Uploads Recentes"
      description="As últimas batidas que chegaram no estúdio."
      tracks={filteredRecent}
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      onPlayTrack={onPlayTrack}
      onPlayAll={() => onPlayAllGenre(filteredRecent)}
    />
  );

  const orderedSpecialSections = settings.favorites_first
    ? [favoritesSection, recentSection]
    : [recentSection, favoritesSection];

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
        {featuredTrack && !query && (
          <FeaturedTrack
            track={featuredTrack}
            message={settings.featured_message}
            isPlaying={isPlaying}
            isActive={currentTrack?.id === featuredTrack.id}
            onPlay={() => onPlayTrack(featuredTrack)}
          />
        )}

        {settings.show_spotify && <SpotifyPlaylistSection />}

        {orderedSpecialSections}

        {Object.keys(filteredPlaylists).map(genre => {
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

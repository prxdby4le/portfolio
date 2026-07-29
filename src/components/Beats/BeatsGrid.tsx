import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
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

/** Matches the shape of a TrackCard so the layout does not jump when data lands. */
function PlateSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-square animate-soft-pulse border border-border bg-paper-raised" />
      <div className="mt-2.5 border-t border-border pt-2.5">
        <div className="h-3.5 w-3/4 animate-soft-pulse bg-paper-raised" />
        <div className="mt-2 h-2.5 w-1/2 animate-soft-pulse bg-paper-raised" />
      </div>
    </div>
  );
}

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

  // The first special section opens out into a full plate wall; everything
  // after it stays a rail. One deliberate rhythm break, not eight identical rows.
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
      layout={settings.favorites_first ? 'grid' : 'rail'}
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
      layout={settings.favorites_first ? 'rail' : 'grid'}
    />
  );

  const orderedSpecialSections = settings.favorites_first
    ? [favoritesSection, recentSection]
    : [recentSection, favoritesSection];

  const hasAnyResult =
    filteredFavorites.length > 0 ||
    filteredRecent.length > 0 ||
    Object.values(filteredPlaylists).some(p => p.tracks.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
      {/* ------------------------------------------------------------ search */}
      <div className="mb-12 max-w-md">
        <label htmlFor="busca-beats" className="sr-only">
          Buscar beats por título ou tag
        </label>
        <div className="flex items-center gap-3 border-b border-border py-2.5 transition-colors focus-within:border-ink">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            id="busca-beats"
            type="search"
            placeholder="Buscar por título ou tag"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Limpar busca"
              className="shrink-0 text-muted-foreground transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <PlateSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="border border-destructive/40 bg-paper-raised px-6 py-10">
          <p className="text-sm font-medium text-foreground">
            Não foi possível carregar as faixas.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Verifique a conexão e recarregue a página.
          </p>
        </div>
      ) : query && !hasAnyResult ? (
        <div className="border border-dashed border-border bg-paper-sunk px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Nenhuma faixa para "{searchQuery.trim()}".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="ink-ghost mt-5 inline-flex h-9 items-center px-4 text-xs font-medium"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

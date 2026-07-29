import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/errors";
import type { TrackRow } from "@/types/db";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, EyeOff, ListMusic, Loader2, Music, Star } from "lucide-react";
import { DEFAULT_GENRES } from "@/lib/genres";

function moveItem<T>(list: T[], index: number, direction: "up" | "down"): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function PlaylistsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState<string | null>(null);

  const { data: genresData, isLoading: loadingGenres, refetch: refetchGenres } = useQuery({
    queryKey: ["admin-genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("name, sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: tracksData, isLoading: loadingTracks, refetch: refetchTracks } = useQuery({
    queryKey: ["admin-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tracks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // ----- Ordem dos gêneros (estado local + salvar) -----
  const [genreList, setGenreList] = useState<string[]>([]);
  const [genresDirty, setGenresDirty] = useState(false);

  useEffect(() => {
    if (genresData) {
      setGenreList(genresData.map(g => g.name));
      setGenresDirty(false);
    }
  }, [genresData]);

  // ----- Ordem das músicas por gênero (estado local + salvar) -----
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreTracks, setGenreTracks] = useState<TrackRow[]>([]);
  const [tracksDirty, setTracksDirty] = useState(false);

  useEffect(() => {
    if (tracksData && selectedGenre) {
      const list = tracksData
        .filter(t => t.genre === selectedGenre)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      setGenreTracks(list);
      setTracksDirty(false);
    }
  }, [tracksData, selectedGenre]);

  // ----- Favoritos (estado local + salvar ordem; toggle salva na hora) -----
  const favorites = useMemo(() => {
    return (tracksData ?? [])
      .filter(t => t.favorite_order !== null && t.favorite_order !== undefined)
      .sort((a, b) => a.favorite_order - b.favorite_order);
  }, [tracksData]);

  const [favoriteList, setFavoriteList] = useState<TrackRow[]>([]);
  const [favoritesDirty, setFavoritesDirty] = useState(false);

  useEffect(() => {
    setFavoriteList(favorites);
    setFavoritesDirty(false);
  }, [favorites]);

  const invalidatePublic = () => {
    queryClient.invalidateQueries({ queryKey: ["tracks"] });
    queryClient.invalidateQueries({ queryKey: ["genres"] });
  };

  const saveGenreOrder = async () => {
    setSaving("genres");
    try {
      const updates = genreList.map((name, index) =>
        supabase.from("genres").update({ sort_order: index }).eq("name", name)
      );
      const results = await Promise.all(updates);
      const failed = results.find(r => r.error);
      if (failed?.error) throw failed.error;

      toast({ title: "Ordem dos gêneros salva!" });
      refetchGenres();
      invalidatePublic();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar ordem dos gêneros",
        description: getErrorMessage(error, "Rode a migração supabase_migration_playlists.sql no Supabase."),
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const saveTrackOrder = async () => {
    setSaving("tracks");
    try {
      const updates = genreTracks.map((track, index) =>
        supabase.from("tracks").update({ sort_order: index }).eq("id", track.id)
      );
      const results = await Promise.all(updates);
      const failed = results.find(r => r.error);
      if (failed?.error) throw failed.error;

      toast({ title: `Ordem de "${selectedGenre}" salva!` });
      refetchTracks();
      invalidatePublic();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar ordem das músicas",
        description: getErrorMessage(error, "Rode a migração supabase_migration_playlists.sql no Supabase."),
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const saveFavoriteOrder = async () => {
    setSaving("favorites");
    try {
      const updates = favoriteList.map((track, index) =>
        supabase.from("tracks").update({ favorite_order: index }).eq("id", track.id)
      );
      const results = await Promise.all(updates);
      const failed = results.find(r => r.error);
      if (failed?.error) throw failed.error;

      toast({ title: "Ordem dos favoritos salva!" });
      refetchTracks();
      invalidatePublic();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar ordem dos favoritos",
        description: getErrorMessage(error, "Ocorreu um erro."),
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleFavorite = async (track: TrackRow) => {
    const isFavorite = track.favorite_order !== null && track.favorite_order !== undefined;
    try {
      const { error } = await supabase
        .from("tracks")
        .update({ favorite_order: isFavorite ? null : favorites.length })
        .eq("id", track.id);
      if (error) throw error;

      toast({ title: isFavorite ? "Removida dos favoritos" : "Adicionada aos favoritos" });
      refetchTracks();
      invalidatePublic();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar favorito",
        description: getErrorMessage(error, "Rode a migração supabase_migration_playlists.sql no Supabase."),
        variant: "destructive",
      });
    }
  };

  const toggleRecent = async (track: TrackRow) => {
    const currentlyVisible = track.show_in_recent !== false;
    try {
      const { error } = await supabase
        .from("tracks")
        .update({ show_in_recent: !currentlyVisible })
        .eq("id", track.id);
      if (error) throw error;

      toast({ title: currentlyVisible ? "Oculta dos Uploads Recentes" : "Visível nos Uploads Recentes" });
      refetchTracks();
      invalidatePublic();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar Uploads Recentes",
        description: getErrorMessage(error, "Rode a migração supabase_migration_playlists.sql no Supabase."),
        variant: "destructive",
      });
    }
  };

  const genreOptions = genresData?.map(g => g.name) ?? DEFAULT_GENRES;

  if (loadingGenres || loadingTracks) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-aero-sky" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ordem dos gêneros */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <ListMusic className="text-aero-sky w-5 h-5" />
            Ordem dos Gêneros
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Define a ordem das seções na página inicial.
          </p>

          {genreList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 font-medium">
              Nenhum gênero encontrado. Rode a migração <code>supabase_migration_playlists.sql</code> no Supabase.
            </p>
          ) : (
            <div className="space-y-2">
              {genreList.map((genre, index) => (
                <div key={genre} className="flex items-center gap-3 p-2 glass rounded-xl border border-primary/10">
                  <span className="text-xs text-muted-foreground w-5 text-center font-bold">{index + 1}</span>
                  <p className="flex-1 font-bold text-sm truncate">{genre}</p>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => { setGenreList(moveItem(genreList, index, "up")); setGenresDirty(true); }}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8"
                    disabled={index === genreList.length - 1}
                    onClick={() => { setGenreList(moveItem(genreList, index, "down")); setGenresDirty(true); }}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {genresDirty && (
            <Button variant="aero" className="w-full mt-4" onClick={saveGenreOrder} disabled={saving === "genres"}>
              {saving === "genres" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Salvar Ordem dos Gêneros"}
            </Button>
          )}
        </div>

        {/* Ordem das músicas dentro de um gênero */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <Music className="text-aero-sky w-5 h-5" />
            Ordem das Músicas
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Define a ordem das músicas dentro de cada gênero.
          </p>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="glass mb-4">
              <SelectValue placeholder="Selecione um gênero..." />
            </SelectTrigger>
            <SelectContent>
              {genreOptions.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedGenre && (
            genreTracks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center font-medium">Nenhuma música neste gênero.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {genreTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center gap-3 p-2 glass rounded-xl border border-primary/10">
                    <span className="text-xs text-muted-foreground w-5 text-center font-bold">{index + 1}</span>
                    <img src={track.cover_url} alt={track.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <p className="flex-1 font-bold text-sm truncate">{track.title}</p>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      disabled={index === 0}
                      onClick={() => { setGenreTracks(moveItem(genreTracks, index, "up")); setTracksDirty(true); }}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      disabled={index === genreTracks.length - 1}
                      onClick={() => { setGenreTracks(moveItem(genreTracks, index, "down")); setTracksDirty(true); }}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )
          )}

          {tracksDirty && (
            <Button variant="aero" className="w-full mt-4" onClick={saveTrackOrder} disabled={saving === "tracks"}>
              {saving === "tracks" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Salvar Ordem das Músicas"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Playlist de Favoritos */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <Star className="text-aero-sky w-5 h-5" />
            Playlist: Favoritos
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Ordem da playlist de Favoritos exibida no site. Use a estrela na lista ao lado para adicionar/remover.
          </p>

          {favoriteList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center font-medium">
              Nenhum favorito ainda. Marque músicas com a estrela na lista ao lado.
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {favoriteList.map((track, index) => (
                <div key={track.id} className="flex items-center gap-3 p-2 glass rounded-xl border border-primary/10">
                  <span className="text-xs text-muted-foreground w-5 text-center font-bold">{index + 1}</span>
                  <img src={track.cover_url} alt={track.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.genre}</p>
                  </div>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => { setFavoriteList(moveItem(favoriteList, index, "up")); setFavoritesDirty(true); }}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8"
                    disabled={index === favoriteList.length - 1}
                    onClick={() => { setFavoriteList(moveItem(favoriteList, index, "down")); setFavoritesDirty(true); }}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {favoritesDirty && (
            <Button variant="aero" className="w-full mt-4" onClick={saveFavoriteOrder} disabled={saving === "favorites"}>
              {saving === "favorites" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Salvar Ordem dos Favoritos"}
            </Button>
          )}
        </div>

        {/* Todas as músicas: favoritar + visibilidade em Uploads Recentes */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <Music className="text-aero-sky w-5 h-5" />
            Todas as Músicas
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            ⭐ adiciona/remove dos Favoritos • 👁 mostra/oculta nos Uploads Recentes.
          </p>

          {(tracksData?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center font-medium">Nenhuma música cadastrada.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {tracksData!.map((track) => {
                const isFavorite = track.favorite_order !== null && track.favorite_order !== undefined;
                const inRecent = track.show_in_recent !== false;
                return (
                  <div key={track.id} className="flex items-center gap-3 p-2 glass rounded-xl border border-primary/10">
                    <img src={track.cover_url} alt={track.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.genre}</p>
                    </div>
                    <Button
                      variant="ghost" size="icon"
                      className={`h-8 w-8 ${isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-yellow-400"}`}
                      title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                      onClick={() => toggleFavorite(track)}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className={`h-8 w-8 ${inRecent ? "text-aero-sky hover:text-aero-sky/80" : "text-muted-foreground hover:text-aero-sky"}`}
                      title={inRecent ? "Ocultar dos Uploads Recentes" : "Mostrar nos Uploads Recentes"}
                      onClick={() => toggleRecent(track)}
                    >
                      {inRecent ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

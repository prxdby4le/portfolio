import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Upload, Music, Image as ImageIcon, Loader2, Trash2, Pencil, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const GENRES = [
  "Boombap",
  "Drum and Bass",
  "Trap Underground",
  "Hyper",
  "Plug",
  "Rock",
  "Fora da Caixa",
];

const COMMON_TAGS = ["Banger", "Chill", "Dark", "Aggressive", "Melancholic", "Upbeat", "Sampled"];

export default function TracksManager() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [trackKey, setTrackKey] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [description, setDescription] = useState("");
  const [timelineFile, setTimelineFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allTracks, refetch: refetchTracks, isLoading: loadingTracks } = useQuery({
    queryKey: ["admin-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tracks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string, audioUrl: string, coverUrl: string, timelineUrl: string | null) => {
    if (!window.confirm("Tem certeza que deseja excluir esta track permanentemente?")) return;

    try {
      const getFileName = (url: string) => url.split('/').pop();

      const { error: dbError } = await supabase.from("tracks").delete().eq("id", id);
      if (dbError) throw dbError;

      // Delete from storage
      if (audioUrl) {
        const audioName = getFileName(audioUrl);
        if (audioName) await supabase.storage.from("music").remove([audioName]);
      }
      if (coverUrl) {
        const coverName = getFileName(coverUrl);
        if (coverName) await supabase.storage.from("covers").remove([coverName]);
      }
      if (timelineUrl) {
        const timelineName = getFileName(timelineUrl);
        if (timelineName) await supabase.storage.from("timelines").remove([timelineName]);
      }

      toast({ title: "Track excluída com sucesso!" });
      refetchTracks();
      // Invalidate the public tracks query to update the main page
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao excluir track",
        description: error.message || "Ocorreu um erro.",
        variant: "destructive",
      });
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags(prev => [...prev, customTag]);
      setCustomTag("");
    }
  };

  const handleEdit = (track: any) => {
    setEditingId(track.id);
    setTitle(track.title);
    setGenre(track.genre);
    setBpm(track.bpm?.toString() || "");
    setTrackKey(track.track_key || "");
    setDescription(track.description || "");
    setSelectedTags(track.tags || []);
    setAudioFile(null);
    setCoverFile(null);
    setTimelineFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setGenre("");
    setBpm("");
    setTrackKey("");
    setAudioFile(null);
    setCoverFile(null);
    setTimelineFile(null);
    setSelectedTags([]);
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !genre || !bpm) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!editingId && (!audioFile || !coverFile)) {
      toast({
        title: "Arquivos ausentes",
        description: "Por favor, envie a música e a capa.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let audioUrl = editingId ? allTracks?.find(t => t.id === editingId)?.audio_url : null;
      let coverUrl = editingId ? allTracks?.find(t => t.id === editingId)?.cover_url : null;
      let timelineUrl = editingId ? allTracks?.find(t => t.id === editingId)?.timeline_image_url : null;

      const getFileName = (url: string) => url.split('/').pop();

      // 1. Upload Audio
      if (audioFile) {
        const audioExt = audioFile.name.split('.').pop();
        const audioFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${audioExt}`;
        const { error: audioError } = await supabase.storage
          .from("music")
          .upload(audioFileName, audioFile);

        if (audioError) throw audioError;
        
        if (editingId && audioUrl) {
          const oldName = getFileName(audioUrl);
          if (oldName) await supabase.storage.from("music").remove([oldName]);
        }
        audioUrl = supabase.storage.from("music").getPublicUrl(audioFileName).data.publicUrl;
      }

      // 2. Upload Cover
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from("covers")
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        if (editingId && coverUrl) {
          const oldName = getFileName(coverUrl);
          if (oldName) await supabase.storage.from("covers").remove([oldName]);
        }
        coverUrl = supabase.storage.from("covers").getPublicUrl(coverFileName).data.publicUrl;
      }

      // 3. Upload Timeline
      if (timelineFile) {
        const timelineExt = timelineFile.name.split('.').pop();
        const timelineFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${timelineExt}`;
        const { error: timelineError } = await supabase.storage
          .from("timelines")
          .upload(timelineFileName, timelineFile);

        if (timelineError) throw timelineError;

        if (editingId && timelineUrl) {
          const oldName = getFileName(timelineUrl);
          if (oldName) await supabase.storage.from("timelines").remove([oldName]);
        }
        timelineUrl = supabase.storage.from("timelines").getPublicUrl(timelineFileName).data.publicUrl;
      }

      const trackData = {
        title,
        genre,
        bpm: parseInt(bpm, 10),
        track_key: trackKey || null,
        cover_url: coverUrl,
        audio_url: audioUrl,
        tags: selectedTags,
        description: description || null,
        timeline_image_url: timelineUrl,
      };

      if (editingId) {
        const { error: dbError } = await supabase.from("tracks").update(trackData).eq("id", editingId);
        if (dbError) throw dbError;
        toast({
          title: "Sucesso!",
          description: "Música atualizada com sucesso.",
        });
      } else {
        const { error: dbError } = await supabase.from("tracks").insert([trackData]);
        if (dbError) throw dbError;
        toast({
          title: "Sucesso!",
          description: "Música adicionada com sucesso ao portfólio.",
        });
      }

      // Reset form
      cancelEdit();

      refetchTracks();
      queryClient.invalidateQueries({ queryKey: ["tracks"] });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="aero-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
              {editingId ? (
                <>
                  <Pencil className="text-aero-sky w-5 h-5" />
                  Editar Música
                </>
              ) : (
                <>
                  <Upload className="text-aero-sky w-5 h-5" />
                  Nova Música
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Astral Trap" className="glass" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Gênero</label>
                  <Select value={genre} onValueChange={setGenre} required>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">BPM</label>
                  <Input type="number" value={bpm} onChange={e => setBpm(e.target.value)} required placeholder="140" className="glass" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Tom (Key) - Opcional</label>
                <Input value={trackKey} onChange={e => setTrackKey(e.target.value)} placeholder="Ex: C# minor" className="glass" />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-semibold">Arquivos</label>

                <div className="relative">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={e => setAudioFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required={!editingId}
                  />
                  <div className="flex items-center gap-3 p-3 glass border-dashed rounded-lg">
                    <Music className="text-aero-sky" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {audioFile ? audioFile.name : (editingId ? "Manter áudio atual ou selecionar novo" : "Selecionar arquivo de áudio (.mp3, .wav)")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => setCoverFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required={!editingId}
                  />
                  <div className="flex items-center gap-3 p-3 glass border-dashed rounded-lg">
                    <ImageIcon className="text-aero-green" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {coverFile ? coverFile.name : (editingId ? "Manter capa atual ou selecionar nova" : "Selecionar capa da música (.jpg, .png)")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => setTimelineFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3 p-3 glass border-dashed rounded-lg">
                    <ImageIcon className="text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-muted-foreground">
                        {timelineFile ? timelineFile.name : (editingId ? "Manter imagem atual ou selecionar nova" : "Imagem da Timeline (Opcional)")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Descrição (Markdown suportado)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full min-h-[120px] p-3 rounded-md glass border-primary/15 focus:border-primary text-sm placeholder:text-muted-foreground/60 resize-y"
                  placeholder="Conte a história do beat...&#10;&#10;# Equipamentos&#10;- FL Studio&#10;- Serum"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_TAGS.map(tag => (
                    <span
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer font-medium border transition-colors ${selectedTags.includes(tag)
                          ? 'bg-aero-sky text-white border-aero-sky'
                          : 'glass hover:bg-primary/10'
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {selectedTags.filter(t => !COMMON_TAGS.includes(t)).map(tag => (
                    <span
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="text-xs px-2 py-1 rounded-full cursor-pointer font-medium border bg-aero-violet text-white border-aero-violet transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                    placeholder="Nova tag..."
                    className="glass h-8 text-sm"
                  />
                  <Button type="button" onClick={handleAddCustomTag} size="sm" variant="glass" className="h-8">Adicionar</Button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="submit" variant="aero" className="flex-1" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingId ? "Salvar Alterações" : "Fazer Upload")}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" className="flex-1 bg-black border-primary/15 hover:bg-primary/10 text-white" onClick={cancelEdit} disabled={loading}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Tracks List */}
          <div className="space-y-6">
            <div className="aero-card p-6 h-full max-h-[800px] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                <Music className="text-aero-sky w-5 h-5" />
                Tracks Cadastradas
              </h2>

              {loadingTracks ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-aero-sky" />
                </div>
              ) : allTracks?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 font-medium">Nenhuma track encontrada.</p>
              ) : (
                <div className="space-y-4">
                  {allTracks?.map((track) => (
                    <div key={track.id} className="flex items-center gap-4 p-3 glass rounded-xl border border-primary/10">
                      <img src={track.cover_url} alt={track.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.genre} • {track.bpm} BPM</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-aero-sky hover:bg-aero-sky/10"
                          onClick={() => handleEdit(track)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(track.id, track.audio_url, track.cover_url, track.timeline_image_url)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
    </div>
  );
}

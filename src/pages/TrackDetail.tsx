import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Track } from "@/types/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePlayer } from "@/contexts/PlayerContext";
import AeroBubbles, { INDEX_BUBBLES } from "@/components/Aero/AeroBubbles";
import Navbar from "@/components/Layout/Navbar";

export default function TrackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, handlePlayTrack } = usePlayer();

  const { data: track, isLoading, error } = useQuery({
    queryKey: ["track", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");

      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const mappedTrack: Track = {
        id: data.id,
        title: data.title,
        genre: data.genre,
        bpm: data.bpm,
        key: data.track_key || undefined,
        cover: data.cover_url,
        src: data.audio_url,
        tags: data.tags || [],
        duration: "3:00",
        description: data.description || undefined,
        timeline_image: data.timeline_image_url || undefined,
      };

      return mappedTrack;
    },
    enabled: !!id,
  });

  const isThisPlaying = currentTrack?.id === track?.id && isPlaying;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center pt-20">
        <Navbar />
        <Loader2 className="w-12 h-12 text-aero-sky animate-spin" />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-4 pt-20">
        <Navbar />
        <h2 className="text-2xl font-bold mb-4 text-gradient-sky">Beat não encontrado</h2>
        <Button onClick={() => navigate(-1)} variant="aero">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-32 pt-20">
      <Navbar />
      
      {/* Frutiger Aero Background */}
      <div className="fixed inset-0 bg-gradient-cloud pointer-events-none" />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-aero-sky/10 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-aero-green/10 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <AeroBubbles bubbles={INDEX_BUBBLES} />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-white/20 glass"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Capa e Info Principal */}
          <div className="md:col-span-1 space-y-6">
            <div className="aero-card p-4 glass-heavy">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
                <img 
                  src={track.cover} 
                  alt={track.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="glass"
                    size="icon"
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-xl"
                    onClick={() => handlePlayTrack(track)}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 ml-1 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">{track.title}</h1>
                <p className="text-lg font-semibold text-aero-sky mb-4">{track.genre}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {track.tags.map(tag => (
                    <Badge key={tag} className="bg-aero-sky text-white border-none shadow-sm">{tag}</Badge>
                  ))}
                </div>

                <div className="flex justify-center gap-6 text-sm font-medium text-muted-foreground bg-white/40 p-3 rounded-lg border border-white/50">
                  <div className="text-center">
                    <span className="block text-xs uppercase opacity-70">BPM</span>
                    <span className="text-foreground text-base">{track.bpm}</span>
                  </div>
                  {track.key && (
                    <div className="text-center">
                      <span className="block text-xs uppercase opacity-70">Key</span>
                      <span className="text-foreground text-base">{track.key}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Descrição e Timeline */}
          <div className="md:col-span-2 space-y-8">
            {track.timeline_image && (
              <div className="aero-card p-6 glass-heavy">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aero-green"></span>
                  Timeline do Projeto
                </h2>
                <div className="rounded-xl overflow-hidden border border-white/50 shadow-md">
                  <img 
                    src={track.timeline_image} 
                    alt={`Timeline do beat ${track.title}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}

            {track.description && (
              <div className="aero-card p-6 md:p-8 glass-heavy">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aero-sky"></span>
                  Sobre o Beat
                </h2>
                <div className="prose prose-sm md:prose-base prose-slate max-w-none 
                              prose-headings:text-aero-sky prose-headings:font-display prose-headings:font-bold
                              prose-a:text-aero-sky hover:prose-a:text-aero-sky/80
                              prose-strong:text-foreground
                              prose-p:text-muted-foreground
                              prose-li:text-muted-foreground">
                  <ReactMarkdown>{track.description}</ReactMarkdown>
                </div>
              </div>
            )}

            {!track.description && !track.timeline_image && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>O produtor ainda não adicionou detalhes para esta faixa.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

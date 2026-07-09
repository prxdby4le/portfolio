import { useNavigate } from "react-router-dom";
import { Play, Pause, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/data";
import { cn } from "@/lib/utils";

interface FeaturedTrackProps {
  track: Track;
  message: string;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
}

export default function FeaturedTrack({ track, message, isPlaying, isActive, onPlay }: FeaturedTrackProps) {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 sm:mb-12"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Sparkles className="w-5 h-5 text-aero-sky" />
        <h2 className="text-xl sm:text-2xl font-display font-bold">
          <span className="text-gradient-sky">Em Destaque</span>
        </h2>
      </div>

      <div className="aero-card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 overflow-hidden">
        {/* Capa + play */}
        <div
          className="relative group flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border border-white/30 cursor-pointer"
          onClick={() => navigate(`/track/${track.id}`)}
        >
          {track.cover && (
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center transition-opacity duration-300",
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <Button
              variant="glass"
              size="icon"
              className={cn(
                "rounded-full w-14 h-14 border border-primary/30 shadow-lg bg-black text-white",
                isActive && isPlaying && "bg-primary/20 animate-soft-pulse"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              {isActive && isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 ml-1 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mensagem ao lado */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3
            className="text-2xl sm:text-3xl font-display font-bold mb-1 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate(`/track/${track.id}`)}
          >
            {track.title}
          </h3>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium mb-3">
            <span>{track.genre}</span>
            <span className="text-aero-sky">·</span>
            <span>{track.bpm} BPM</span>
            {track.key && (
              <>
                <span className="text-aero-sky">·</span>
                <span>{track.key}</span>
              </>
            )}
          </div>

          {message && (
            <p className="text-sm sm:text-base text-foreground/90 font-medium whitespace-pre-line max-w-xl">
              {message}
            </p>
          )}

          <Button
            variant="aero"
            size="sm"
            className="mt-4 inline-flex items-center gap-2"
            onClick={onPlay}
          >
            {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive && isPlaying ? "Pausar" : "Ouvir agora"}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

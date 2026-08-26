import { useNavigate } from "react-router-dom";
import { Play, Pause, Download, Share2, Link2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/format";
import TrackPlate from "@/components/Player/TrackPlate";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
  index: number;
}

const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * No card container. The cover plate is the object, the caption sits under it
 * the way a contact sheet is captioned.
 *
 * State language of the whole catalogue: a cover is printed in two inks until
 * it is the one you are playing or pointing at, then the colour sweeps back in.
 */
export default function TrackCard({ track, isPlaying, isActive, onPlay, index }: TrackCardProps) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const live = isActive && isPlaying;
  const duration = formatDuration(track.duration_seconds);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/track/${track.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado",
        description: "O link da faixa está na área de transferência.",
      });
    } else {
      toast({
        title: "Não foi possível copiar",
        description: "O navegador bloqueou o acesso à área de transferência.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Confira: ${track.title}`,
          url: `${window.location.origin}/track/${track.id}`,
        });
      } catch {
        /* user dismissed the sheet */
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: Math.min(index, 7) * 0.06, ease: SOFT }}
      className="group"
    >
      <div
        className={cn(
          "relative cursor-pointer rounded-lg",
          isActive && "ring-1 ring-ink ring-offset-4 ring-offset-background"
        )}
        onClick={() => navigate(`/track/${track.id}`)}
      >
        {track.cover && (
          <TrackPlate
            track={track}
            className="aspect-square shadow-[var(--shadow-soft)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-lift),var(--shadow-ink)]"
          >
            <button
              type="button"
              data-live={isActive ? "true" : "false"}
              aria-label={live ? `Pausar ${track.title}` : `Tocar ${track.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="play-dot absolute bottom-3.5 right-3.5 grid h-11 w-11 place-items-center"
            >
              {live ? (
                <Pause className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
              )}
            </button>

            {/* Playhead. Only while audio is actually running, so the motion
                means something. */}
            {live && (
              <div className="absolute inset-x-3 bottom-3 h-[3px] overflow-hidden rounded-full bg-paper/70">
                <div className="h-full w-1/3 animate-rule-scan rounded-full bg-ink" />
              </div>
            )}
          </TrackPlate>
        )}
      </div>

      {/* ---------------------------------------------------------- caption */}
      <div className="mt-4 px-0.5">
        <h3
          className={cn(
            "cursor-pointer truncate text-sm font-medium tracking-tight transition-colors duration-300",
            isActive ? "text-ink" : "text-foreground group-hover:text-ink"
          )}
          onClick={() => navigate(`/track/${track.id}`)}
        >
          {track.title}
        </h3>

        {/* Duration only shows when the real one was stored. Older rows have
            no `duration_seconds` and simply omit it, which is better than the
            invented "3:00" this used to print on every single track. */}
        <div className="font-mono-data mt-1.5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{track.bpm} bpm</span>
          {track.key && <span>{track.key}</span>}
          {duration && <span>{duration}</span>}
        </div>

        {track.tags.length > 0 && (
          <p className="mt-1.5 truncate text-[11px] lowercase text-muted-foreground">
            {track.tags.slice(0, 3).join("  ")}
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Compartilhar faixa"
            onClick={handleShare}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-ink/10 hover:text-ink"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Copiar link da faixa"
            onClick={handleCopyLink}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-ink/10 hover:text-ink"
          >
            <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          {track.downloadable && (
            <a
              href={track.src}
              download
              aria-label={`Baixar ${track.title}`}
              onClick={(e) => e.stopPropagation()}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-ink/10 hover:text-ink"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

import { useNavigate } from "react-router-dom";
import { Play, Pause, Download, Share2, Link2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
  index: number;
}

/**
 * No card container. The cover plate is the object, the metadata sits under it
 * on a hairline, the way a contact sheet is captioned.
 *
 * State language of the whole catalogue: a cover is printed in two inks until
 * it is the one you are playing or pointing at, then it comes back to colour.
 */
export default function TrackCard({ track, isPlaying, isActive, onPlay, index }: TrackCardProps) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const live = isActive && isPlaying;

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
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      {/* ------------------------------------------------------------- plate */}
      <div
        className={cn(
          "relative aspect-square cursor-pointer overflow-hidden border bg-paper-sunk transition-colors",
          isActive ? "border-ink" : "border-border group-hover:border-ink/50"
        )}
        onClick={() => navigate(`/track/${track.id}`)}
      >
        {track.cover && (
          <img
            src={track.cover}
            alt={`Capa de ${track.title}`}
            loading="lazy"
            data-live={isActive ? "true" : "false"}
            className="dither dither-release h-full w-full object-cover"
          />
        )}

        <button
          type="button"
          aria-label={live ? `Pausar ${track.title}` : `Tocar ${track.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className={cn(
            "play-dot absolute bottom-3 right-3 grid h-11 w-11 place-items-center transition-opacity",
            // Always reachable on touch; fades in on pointer devices.
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-[1024px]:opacity-100"
          )}
        >
          {live ? (
            <Pause className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
          )}
        </button>

        {/* Playhead. Only rendered while audio is actually running, so the
            motion means something. */}
        {live && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-ink-deep">
            <div className="h-full w-1/3 animate-rule-scan bg-ink" />
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------- caption */}
      <div className="mt-2.5 border-t border-border pt-2.5">
        <h3
          className={cn(
            "cursor-pointer truncate text-sm font-medium tracking-tight transition-colors",
            isActive ? "text-ink" : "text-foreground group-hover:text-ink"
          )}
          onClick={() => navigate(`/track/${track.id}`)}
        >
          {track.title}
        </h3>

        {/* No duration here: useTracks hardcodes "3:00" for every row, so
            printing it would put the same fake number on every plate. It comes
            back when the real length is read off the audio. */}
        <div className="font-mono-data mt-1.5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{track.bpm} bpm</span>
          {track.key && <span>{track.key}</span>}
        </div>

        {track.tags.length > 0 && (
          <p className="mt-1.5 truncate text-[11px] lowercase text-muted-foreground">
            {track.tags.slice(0, 3).join("  ")}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            aria-label="Compartilhar faixa"
            onClick={handleShare}
            className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-ink"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Copiar link da faixa"
            onClick={handleCopyLink}
            className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-ink"
          >
            <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          {track.downloadable && (
            <a
              href={track.src}
              download
              aria-label={`Baixar ${track.title}`}
              onClick={(e) => e.stopPropagation()}
              className="grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-ink"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import { cn } from "@/lib/utils";

interface FeaturedTrackProps {
  track: Track;
  message: string;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
}

/**
 * The one editorial block on the page. Deliberately not shaped like a genre
 * row: bigger plate, prose beside it, ink field behind. It only appears when
 * the admin turns it on, so it stays a real feature and not furniture.
 */
export default function FeaturedTrack({
  track,
  message,
  isPlaying,
  isActive,
  onPlay,
}: FeaturedTrackProps) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const live = isActive && isPlaying;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative mb-14 border border-border bg-paper-raised"
    >
      <div className="halftone halftone-fade pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10 lg:p-10">
        <div
          className="relative aspect-square cursor-pointer overflow-hidden border border-border bg-paper-sunk"
          onClick={() => navigate(`/track/${track.id}`)}
        >
          {track.cover && (
            <img
              src={track.cover}
              alt={`Capa de ${track.title}`}
              loading="lazy"
              data-live={isActive ? "true" : "false"}
              className="dither-soft dither-release h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <h2 className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-ink">
            Em destaque
          </h2>

          <h3
            className="mt-3 cursor-pointer font-display text-3xl font-bold leading-[1.05] tracking-tight text-foreground transition-colors hover:text-ink sm:text-4xl lg:text-5xl"
            onClick={() => navigate(`/track/${track.id}`)}
          >
            {track.title}
          </h3>

          <div className="font-mono-data mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs uppercase tracking-wider text-muted-foreground">
            <span>{track.genre}</span>
            <span>{track.bpm} bpm</span>
            {track.key && <span>{track.key}</span>}
          </div>

          {message && (
            <p className="mt-5 max-w-[58ch] whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
              {message}
            </p>
          )}

          <div className="mt-7">
            <button
              type="button"
              onClick={onPlay}
              className={cn("ink-btn inline-flex h-11 items-center gap-2.5 px-5 text-sm")}
            >
              {live ? (
                <Pause className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Play className="h-4 w-4" strokeWidth={1.75} />
              )}
              {live ? "Pausar" : "Ouvir agora"}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

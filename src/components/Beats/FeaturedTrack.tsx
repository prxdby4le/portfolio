import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import DuotonePlate from "@/components/Duotone/DuotonePlate";
import Tilt3D from "@/components/Duotone/Tilt3D";

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
      className="group plate relative mb-20 overflow-hidden"
    >
      <div className="relative grid gap-10 p-7 sm:p-9 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-12 lg:p-12">
        <div className="cursor-pointer" onClick={() => navigate(`/track/${track.id}`)}>
          {track.cover && (
            <Tilt3D max={8} lift={48}>
              <DuotonePlate
                src={track.cover}
                alt={`Capa de ${track.title}`}
                live={isActive}
                className="aspect-square shadow-[var(--shadow-lift)]"
              />
            </Tilt3D>
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

          <div className="mt-8">
            <motion.button
              type="button"
              onClick={onPlay}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { y: 0, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="ink-btn inline-flex h-12 items-center gap-2.5 px-6 text-sm"
            >
              {live ? (
                <Pause className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Play className="h-4 w-4" strokeWidth={1.75} />
              )}
              {live ? "Pausar" : "Ouvir agora"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

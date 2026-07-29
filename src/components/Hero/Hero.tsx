import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, ArrowDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTracks } from "@/hooks/useTracks";
import { usePlayer } from "@/hooks/usePlayer";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import DuotonePlate from "@/components/Duotone/DuotonePlate";
import Tilt3D from "@/components/Duotone/Tilt3D";

const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Masthead. Asymmetric split: type on the left, the newest cover printed as a
 * duotone plate on the right. The plate is the hero's real visual, and it is
 * live data rather than decoration: it is the record you would hear if you
 * pressed the primary button.
 */
export default function Hero() {
  const { data: settings } = useSiteSettings();
  const { data: tracksData } = useTracks();
  const { currentTrack, isPlaying, handlePlayTrack } = usePlayer();
  const reduce = useReducedMotion();

  const s = settings ?? DEFAULT_SITE_SETTINGS;
  const latest = tracksData?.allTracks?.[0] ?? null;

  const isLatestLive = !!latest && currentTrack?.id === latest.id && isPlaying;

  const enter = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: SOFT },
        };

  const press = reduce
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { y: 0, scale: 0.985 },
        transition: { type: "spring" as const, stiffness: 320, damping: 24 },
      };

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 pt-24 sm:pb-28 lg:pb-32">
        <div className="grid items-end gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---------------------------------------------------------- type */}
          <div>
            <motion.h2
              {...enter(0.05)}
              className="masthead font-display text-[clamp(3rem,10.5vw,7rem)] font-bold"
            >
              <span className="block text-foreground">{s.hero_title_line1}</span>
              <span className="block text-ink">{s.hero_title_line2}</span>
            </motion.h2>

            <motion.p
              {...enter(0.18)}
              className="mt-8 max-w-[38ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {s.hero_subtitle}
            </motion.p>

            <motion.div {...enter(0.3)} className="mt-10 flex flex-wrap items-center gap-3">
              {latest && (
                <motion.button
                  type="button"
                  onClick={() => handlePlayTrack(latest)}
                  className="ink-btn inline-flex h-12 items-center gap-2.5 px-6 text-sm"
                  {...press}
                >
                  {isLatestLive ? (
                    <Pause className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Play className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {isLatestLive ? "Pausar" : "Tocar o mais recente"}
                </motion.button>
              )}

              <motion.a
                href="#catalogo"
                className="ink-ghost inline-flex h-12 items-center gap-2.5 px-6 text-sm font-medium"
                {...press}
              >
                Ver o catálogo
                <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
              </motion.a>
            </motion.div>
          </div>

          {/* --------------------------------------------------------- plate */}
          {latest?.cover ? (
            <motion.figure
              {...enter(0.16)}
              className="group relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none"
            >
              <Tilt3D max={7} lift={56}>
                <DuotonePlate
                  src={latest.cover}
                  alt={`Capa de ${latest.title}`}
                  live={isLatestLive}
                  priority
                  className="aspect-square shadow-[var(--shadow-lift)]"
                />
              </Tilt3D>

              <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-1">
                <span className="truncate text-sm font-medium text-foreground">
                  {latest.title}
                </span>
                <span className="font-mono-data shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                  {latest.bpm} bpm
                </span>
              </figcaption>
            </motion.figure>
          ) : (
            /* Empty state: no catalogue yet. Composed, not a blank column. */
            <motion.div
              {...enter(0.16)}
              className="plate-flush mx-auto flex w-full max-w-[26rem] items-center justify-center border-dashed p-12 lg:mx-0 lg:max-w-none"
            >
              <p className="max-w-[28ch] text-center text-sm text-muted-foreground">
                Nenhuma faixa publicada ainda. A capa da última batida enviada aparece
                aqui.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

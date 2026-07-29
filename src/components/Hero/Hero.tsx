import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, ArrowDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTracks } from "@/hooks/useTracks";
import { usePlayer } from "@/contexts/PlayerContext";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import { cn } from "@/lib/utils";

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
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative border-b border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 pb-14 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ---------------------------------------------------------- type */}
          <div>
            <motion.h2
              {...enter(0.05)}
              className="masthead font-display text-[clamp(3.25rem,12vw,8rem)] font-bold"
            >
              <span className="block text-foreground">{s.hero_title_line1}</span>
              <span className="block text-ink">{s.hero_title_line2}</span>
            </motion.h2>

            <motion.p
              {...enter(0.16)}
              className="mt-6 max-w-[38ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {s.hero_subtitle}
            </motion.p>

            <motion.div {...enter(0.26)} className="mt-8 flex flex-wrap items-center gap-3">
              {latest && (
                <button
                  type="button"
                  onClick={() => handlePlayTrack(latest)}
                  className="ink-btn inline-flex h-11 items-center gap-2.5 px-5 text-sm"
                >
                  {isLatestLive ? (
                    <Pause className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Play className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {isLatestLive ? "Pausar" : "Tocar o mais recente"}
                </button>
              )}

              <a
                href="#catalogo"
                className="ink-ghost inline-flex h-11 items-center gap-2.5 px-5 text-sm font-medium"
              >
                Ver o catálogo
                <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </motion.div>
          </div>

          {/* --------------------------------------------------------- plate */}
          {latest?.cover ? (
            <motion.figure
              {...enter(0.14)}
              className="group relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none"
            >
              <div className="relative aspect-square overflow-hidden border border-border bg-paper-sunk">
                <img
                  src={latest.cover}
                  alt={`Capa de ${latest.title}`}
                  width={720}
                  height={720}
                  loading="eager"
                  // @ts-expect-error fetchPriority lands in React 19 typings
                  fetchpriority="high"
                  data-live={isLatestLive ? "true" : "false"}
                  className={cn(
                    "dither-soft dither-release h-full w-full object-cover"
                  )}
                />
                <div className="halftone halftone-fade pointer-events-none absolute inset-0 opacity-40 mix-blend-screen" />
              </div>

              <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-border pt-3">
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
              {...enter(0.14)}
              className="mx-auto flex w-full max-w-[26rem] items-center justify-center border border-dashed border-border bg-paper-sunk p-10 lg:mx-0 lg:max-w-none"
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

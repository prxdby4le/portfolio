import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, Pause, ArrowDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTracks } from "@/hooks/useTracks";
import { usePlayer } from "@/hooks/usePlayer";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import TrackPlate from "@/components/Player/TrackPlate";

const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Masthead. Asymmetric split: type on the left, a cover printed as a duotone
 * plate on the right. The plate is the hero's real visual, and it is live data
 * rather than decoration.
 *
 * Which cover it is, is the point. At rest it is the newest release — the
 * record you would hear if you pressed the primary button. The moment anything
 * plays it becomes that record instead, halo and all, so the masthead can
 * never sit there announcing one track while a different one is in your ears.
 * Empty the queue and it falls back to the newest again.
 */
export default function Hero() {
  const { data: settings } = useSiteSettings();
  const { data: tracksData } = useTracks();
  const { currentTrack, isPlaying, handlePlayTrack } = usePlayer();
  const reduce = useReducedMotion();

  const s = settings ?? DEFAULT_SITE_SETTINGS;
  const latest = tracksData?.allTracks?.[0] ?? null;

  // A track with no cover would blank the masthead, so it does not get to
  // claim the plate.
  const heroTrack = (currentTrack?.cover ? currentTrack : null) ?? latest;
  const isHeroLive = !!heroTrack && currentTrack?.id === heroTrack.id && isPlaying;
  const isHeroLatest = !!heroTrack && heroTrack.id === latest?.id;

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
              {heroTrack && (
                <motion.button
                  type="button"
                  onClick={() => handlePlayTrack(heroTrack)}
                  className="ink-btn inline-flex h-12 items-center gap-2.5 px-6 text-sm"
                  {...press}
                >
                  {isHeroLive ? (
                    <Pause className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Play className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {isHeroLive
                    ? "Pausar"
                    : isHeroLatest
                      ? "Tocar o mais recente"
                      : "Tocar"}
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
          {heroTrack?.cover ? (
            <motion.figure
              {...enter(0.16)}
              className="group relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-none"
            >
              {/*
                The square holds its own height so the swap cannot shift the
                page: the outgoing plate is lifted out of flow and both layers
                cross over in place. `mode="popLayout"` is deliberately not
                used — it would collapse the box for a frame.
              */}
              <div className="relative aspect-square">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={heroTrack.id}
                    initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                    transition={{ duration: reduce ? 0 : 0.6, ease: SOFT }}
                    className="absolute inset-0"
                  >
                    <TrackPlate
                      track={heroTrack}
                      tiltMax={7}
                      tiltLift={56}
                      priority
                      className="aspect-square shadow-[var(--shadow-lift)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Outside the crossfade: the caption is one line either way, and
                  animating its box would be the one thing that made the swap
                  move the page. */}
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-1">
                <span className="truncate text-sm font-medium text-foreground">
                  {heroTrack.title}
                </span>
                <span className="font-mono-data shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                  {heroTrack.bpm} bpm
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

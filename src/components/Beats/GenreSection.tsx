import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import TrackCard from "./TrackCard";
import { cn } from "@/lib/utils";

interface GenreSectionProps {
  genre: string;
  description: string;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onPlayAll: () => void;
  /**
   * `grid` opens the section out into a full plate wall, `rail` keeps it as a
   * scrollable row. Alternating the two is what stops eight genre sections
   * from reading as eight copies of the same carousel.
   */
  layout?: 'grid' | 'rail';
}

export default function GenreSection({
  genre,
  description,
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayAll,
  layout = 'rail',
}: GenreSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const reduce = useReducedMotion();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const header = (
    <div className="mb-6 flex items-end justify-between gap-6 border-t border-ink/30 pt-4">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {genre}
        </h2>
        <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">{description}</p>
      </div>

      {tracks.length > 0 && (
        <div className="flex shrink-0 items-center gap-2">
          {layout === 'rail' && (
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label={`Rolar ${genre} para a esquerda`}
                className="grid h-9 w-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label={`Rolar ${genre} para a direita`}
                className="grid h-9 w-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onPlayAll}
            className="ink-ghost inline-flex h-9 items-center gap-2 px-3 text-xs font-medium"
          >
            <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
            Tocar tudo
          </button>
        </div>
      )}
    </div>
  );

  if (tracks.length === 0) {
    return (
      <section className="mb-14">
        {header}
        <div className="border border-dashed border-border bg-paper-sunk px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Nada publicado em {genre} ainda.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14"
    >
      {header}

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={isPlaying}
              isActive={currentTrack?.id === track.id}
              onPlay={() => onPlayTrack(track)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4",
            "sm:mx-0 sm:px-0"
          )}
        >
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="w-[44vw] max-w-[15rem] flex-none snap-start sm:w-52 lg:w-56"
            >
              <TrackCard
                track={track}
                isPlaying={isPlaying}
                isActive={currentTrack?.id === track.id}
                onPlay={() => onPlayTrack(track)}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

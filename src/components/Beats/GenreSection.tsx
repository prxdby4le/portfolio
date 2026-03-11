import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/data";
import TrackCard from "./TrackCard";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GenreSectionProps {
  genre: string;
  description: string;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onPlayAll: () => void;
}

const genreEmojis: Record<string, string> = {
  "Boombap": "💥",
  "Drum and Bass": "🥁",
  "Trap Underground": "🔥",
  "Hyper": "⚡",
  "Plug": "🔌",
  "Rock": "🎸",
  "Fora da Caixa": "🌀",
};

const genreColors: Record<string, string> = {
  "Boombap": "#FF00FF",
  "Drum and Bass": "#00FFFF",
  "Trap Underground": "#FF0033",
  "Hyper": "#FFFF00",
  "Plug": "#00FF00",
  "Rock": "#FF6600",
  "Fora da Caixa": "#9933FF",
};

export default function GenreSection({
  genre,
  description,
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayAll,
}: GenreSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const color = genreColors[genre] || "#FF00FF";
  const emoji = genreEmojis[genre] || "✧";

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 240 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (tracks.length === 0) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-display font-bold mb-1 sm:mb-2" style={{ color }}>
              {emoji} {genre}
            </h2>
            <p className="text-xs sm:text-sm text-y2k-cyan/60 pr-2 font-bold">{description}</p>
          </div>
        </div>
        <div className="y2k-card p-12 text-center">
          <p className="text-y2k-pink font-bold animate-blink">Em breve... ★</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 
            className="text-xl sm:text-2xl font-display font-bold mb-1 sm:mb-2"
            style={{ color, textShadow: `0 0 15px ${color}80` }}
          >
            {emoji} {genre}
          </h2>
          <p className="text-xs sm:text-sm text-y2k-cyan/60 pr-2 font-bold">{description}</p>
        </div>
        
        <Button
          variant="glass"
          size="sm"
          onClick={onPlayAll}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0 y2k-btn rounded-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}80)`, borderColor: color }}
        >
          <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Play All</span>
        </Button>
      </div>

      <div className="relative group">
        {canScrollLeft && (
          <Button
            variant="glass"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-y2k-pink bg-black/50"
            style={{ boxShadow: `0 0 15px ${color}` }}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5 text-y2k-pink" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="glass"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-y2k-cyan bg-black/50"
            style={{ boxShadow: `0 0 15px ${color}` }}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5 text-y2k-cyan" />
          </Button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {tracks.map((track, index) => (
            <div key={track.id} className="flex-none w-56 sm:w-64 md:w-72 snap-start">
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
      </div>
    </motion.section>
  );
}

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
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
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              {genre}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Em breve...</p>
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
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            {genre}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <Button
          variant="glass"
          size="sm"
          onClick={onPlayAll}
          className="flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          Play All
        </Button>
      </div>

      <div className="relative group">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <Button
            variant="glass"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="glass"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Tracks carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {tracks.map((track, index) => (
            <div key={track.id} className="flex-none w-72 snap-start">
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
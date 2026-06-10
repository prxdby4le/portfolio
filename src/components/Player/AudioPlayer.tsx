import { useEffect, useRef, useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat,
  Shuffle,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Track } from "@/types/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { usePlayer } from "@/contexts/PlayerContext";

export default function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    queue, 
    handlePlayPause, 
    handleNext, 
    handlePrevious, 
    handleTrackEnd,
    isRepeat,
    isShuffle,
    toggleRepeat,
    toggleShuffle
  } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [handleTrackEnd]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Playback interrupted:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Playback interrupted:", e));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key.toLowerCase() === "a") {
        handlePrevious();
      } else if (e.key.toLowerCase() === "d") {
        handleNext();
      } else if (e.key.toLowerCase() === "l") {
        toggleRepeat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, handlePrevious, handleNext, toggleRepeat]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 glass-heavy border-t border-white/30",
          isExpanded ? "h-32 sm:h-40" : "h-16 sm:h-20"
        )}
      >
        <audio ref={audioRef} />
        
        {/* Progress bar at top */}
        <div className="absolute -top-2 left-0 right-0 h-4 group z-50 flex items-center">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className={cn(
              "cursor-pointer w-full",
              "[&>:first-child]:h-1 [&>:first-child]:rounded-none [&>:first-child]:bg-muted/30",
              "[&>:first-child>span]:bg-gradient-to-r [&>:first-child>span]:from-primary [&>:first-child>span]:to-primary",
              "[&_[role=slider]]:opacity-0 group-hover:[&_[role=slider]]:opacity-100 [&_[role=slider]]:transition-opacity",
              "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-aero-sky [&_[role=slider]]:focus-visible:ring-0"
            )}
          />
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 h-full">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {currentTrack.cover && (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0 border border-white/30 shadow-md",
                    isPlaying && "animate-spin-slow"
                  )}
                  style={{ 
                    boxShadow: '0 4px 12px rgba(255,0,102,0.15)',
                    borderRadius: isPlaying ? '50%' : '0.5rem',
                    transition: 'border-radius 0.5s ease',
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-xs sm:text-sm truncate text-foreground">
                  {currentTrack.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate font-medium">
                  {currentTrack.bpm} BPM {currentTrack.key && `· ${currentTrack.key}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10",
                  isShuffle ? "text-aero-amber" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevious}
                className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button
                variant="glass"
                size="icon"
                onClick={handlePlayPause}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary/30 bg-black hover:bg-primary/20 text-white"
                style={{ boxShadow: '0 2px 12px rgba(255,0,102,0.2)' }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 text-primary" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10",
                  isRepeat ? "text-aero-amber" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {/* Volume & Time - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div className="w-20">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => setVolume(value[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 text-muted-foreground"
              >
                <ChevronUp className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </div>
          </div>

          {/* Mobile expanded */}
          {isExpanded && (
            <div className="md:hidden mt-2 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-muted-foreground" />
                <div className="flex-1">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => setVolume(value[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Expanded Queue */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:flex gap-2 overflow-x-auto pb-4 custom-scrollbar"
            >
              {queue.slice(0, 10).map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "flex-none px-3 py-1 rounded-full glass text-xs font-medium border",
                    track.id === currentTrack.id 
                      ? "border-primary text-primary" 
                      : "border-white/20 text-muted-foreground"
                  )}
                >
                  {track.title}
                </div>
              ))}
              {queue.length > 10 && (
                <div className="flex-none px-3 py-1 text-xs text-muted-foreground font-medium">
                  +{queue.length - 10} mais
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

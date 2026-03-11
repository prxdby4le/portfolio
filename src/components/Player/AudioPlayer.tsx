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

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTrackEnd: () => void;
}

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  queue,
  onPlayPause,
  onNext,
  onPrevious,
  onTrackEnd,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onTrackEnd);
    };
  }, [onTrackEnd]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
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
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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
          "fixed bottom-0 left-0 right-0 z-40 glass-heavy border-t-2 border-y2k-pink/50",
          isExpanded ? "h-32 sm:h-40" : "h-16 sm:h-20"
        )}
        style={{ 
          background: 'linear-gradient(90deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
          backgroundSize: '200% 100%',
        }}
      >
        <audio ref={audioRef} />
        
        {/* Rainbow progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
          <div 
            className="h-full bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-yellow transition-all duration-300"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
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
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0 border-2 border-y2k-pink/50",
                    isPlaying && "animate-spin-slow"
                  )}
                  style={{ 
                    boxShadow: '0 0 15px #FF00FF60',
                    borderRadius: isPlaying ? '50%' : '0.5rem',
                    transition: 'border-radius 0.5s ease',
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm truncate text-y2k-pink">
                  ♫ {currentTrack.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-y2k-cyan/70 truncate font-bold">
                  {currentTrack.bpm} BPM {currentTrack.key && `✦ ${currentTrack.key}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10",
                  isShuffle ? "text-y2k-yellow" : "text-y2k-cyan/50 hover:text-y2k-cyan"
                )}
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onPrevious}
                className="h-8 w-8 sm:h-10 sm:w-10 text-y2k-cyan hover:text-y2k-pink"
              >
                <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button
                variant="glass"
                size="icon"
                onClick={onPlayPause}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-y2k-pink"
                style={{ boxShadow: '0 0 20px #FF00FF60, 0 0 40px #00FFFF30' }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-y2k-pink" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 text-y2k-cyan" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onNext}
                className="h-8 w-8 sm:h-10 sm:w-10 text-y2k-cyan hover:text-y2k-pink"
              >
                <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10",
                  isRepeat ? "text-y2k-yellow" : "text-y2k-cyan/50 hover:text-y2k-cyan"
                )}
              >
                <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {/* Volume & Time - Desktop */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-2 text-xs text-y2k-cyan font-bold">
                <span>{formatTime(currentTime)}</span>
                <div className="w-32">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-y2k-pink" />
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
                className="text-y2k-cyan hover:text-y2k-pink"
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
                className="h-8 w-8 text-y2k-cyan"
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
              <div className="flex items-center gap-2 text-[10px] text-y2k-cyan font-bold">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-y2k-pink" />
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
                    "flex-none px-3 py-1 rounded-full glass text-xs font-bold border",
                    track.id === currentTrack.id 
                      ? "border-y2k-pink text-y2k-pink" 
                      : "border-y2k-cyan/30 text-y2k-cyan/70"
                  )}
                >
                  {track.title}
                </div>
              ))}
              {queue.length > 10 && (
                <div className="flex-none px-3 py-1 text-xs text-y2k-yellow font-bold">
                  +{queue.length - 10} mais ★
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

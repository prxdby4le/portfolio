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
          "fixed bottom-0 left-0 right-0 z-40 glass border-t border-glass-border/20",
          isExpanded ? "h-32" : "h-20"
        )}
      >
        <audio ref={audioRef} />
        
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-20">
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {currentTrack.cover && (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {currentTrack.bpm} BPM {currentTrack.key && `• ${currentTrack.key}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
                className={cn(isShuffle && "text-primary")}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onPrevious}>
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="glass"
                size="icon"
                onClick={onPlayPause}
                className="w-10 h-10 rounded-full shadow-lg shadow-primary/30"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onNext}>
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn(isRepeat && "text-primary")}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume & Time */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
              >
                <ChevronUp className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </div>
          </div>

          {/* Expanded Queue View */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar"
            >
              {queue.slice(0, 10).map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    "flex-none px-3 py-1 rounded-full glass text-xs",
                    track.id === currentTrack.id && "ring-1 ring-primary text-primary"
                  )}
                >
                  {track.title}
                </div>
              ))}
              {queue.length > 10 && (
                <div className="flex-none px-3 py-1 text-xs text-muted-foreground">
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
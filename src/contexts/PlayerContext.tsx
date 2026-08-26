import { useRef, useState, ReactNode } from "react";
import { Track } from "@/types/data";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { PlayerContext } from "./player-context";

/**
 * This file exports the provider and nothing else, so React Fast Refresh can
 * hot-swap it without tearing down playback. The context object lives in
 * `player-context.ts` and the consumer hook in `hooks/usePlayer.ts`.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Tapped here rather than inside AudioPlayer because the element can only be
  // routed once, and several views draw the same signal. The <audio> itself is
  // rendered by AudioPlayer, a descendant, which has mounted by the time this
  // hook's effect runs.
  const analyser = useAudioAnalyser(audioRef, isPlaying);

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(seconds)) return;
    const limit = Number.isFinite(audio.duration) ? audio.duration : seconds;
    audio.currentTime = Math.max(0, Math.min(seconds, limit));
  };

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      const newQueue = [track];
      setQueue(newQueue);
      setCurrentIndex(0);
    }
  };

  const handlePlayAllGenre = (tracks: Track[]) => {
    if (tracks.length > 0) {
      setQueue(tracks);
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      if (isShuffle) {
        let nextIndex = Math.floor(Math.random() * queue.length);
        if (nextIndex === currentIndex && queue.length > 1) {
          nextIndex = (nextIndex + 1) % queue.length;
        }
        setCurrentTrack(queue[nextIndex]);
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
      } else {
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentTrack(queue[nextIndex]);
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
      }
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0) {
      if (isShuffle) {
        let prevIndex = Math.floor(Math.random() * queue.length);
        if (prevIndex === currentIndex && queue.length > 1) {
          prevIndex = (prevIndex + 1) % queue.length;
        }
        setCurrentTrack(queue[prevIndex]);
        setCurrentIndex(prevIndex);
        setIsPlaying(true);
      } else {
        const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        setCurrentTrack(queue[prevIndex]);
        setCurrentIndex(prevIndex);
        setIsPlaying(true);
      }
    }
  };

  const handleTrackEnd = () => {
    if (isRepeat) {
      // If repeating, we just seek to 0 and play again. 
      // This is handled in AudioPlayer via the audio.loop property, but just in case we need context to know,
      // it won't actually fire onTrackEnd if loop is true in the audio element.
      // However, if we do it here instead of audio.loop, we can do this:
      if (currentTrack) {
        // To force re-render/replay, we can rely on audio.play() in AudioPlayer if we keep it the same track.
        // But setting the same track won't trigger the useEffect [currentTrack] load() because the reference is the same.
        // So the best way to handle "Repeat One" is really `audio.loop = true` in AudioPlayer.
      }
    } else {
      handleNext();
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        analyser,
        seek,
        currentTrack,
        isPlaying,
        queue,
        currentIndex,
        handlePlayTrack,
        handlePlayAllGenre,
        handlePlayPause,
        handleNext,
        handlePrevious,
        isRepeat,
        isShuffle,
        toggleRepeat,
        toggleShuffle,
        handleTrackEnd,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

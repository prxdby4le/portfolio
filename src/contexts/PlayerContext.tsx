import { createContext, useContext, useState, ReactNode } from "react";
import { Track } from "@/types/data";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentIndex: number;
  handlePlayTrack: (track: Track) => void;
  handlePlayAllGenre: (tracks: Track[]) => void;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isRepeat: boolean;
  isShuffle: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  handleTrackEnd: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

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

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

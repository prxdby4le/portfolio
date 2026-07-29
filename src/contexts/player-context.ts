import { createContext } from "react";
import { Track } from "@/types/data";

/**
 * The context object and its type live in their own module so that
 * PlayerContext.tsx can export nothing but the provider component.
 *
 * A file that exports both a component and other values breaks React Fast
 * Refresh: the bundler cannot tell whether a change should re-render the tree
 * or reload the module, so it reloads, and every edit during development drops
 * the playback state. Splitting is the fix, not a lint workaround.
 */
export interface PlayerContextType {
  /**
   * The single <audio> element, owned by the provider rather than by
   * AudioPlayer so that other views can read and seek it.
   *
   * Deliberately a ref and not `currentTime` state: `timeupdate` fires several
   * times a second, and putting it in context would re-render every consumer
   * on every tick. Components that need the playhead subscribe to the element
   * directly and draw to a canvas instead.
   */
  audioRef: React.RefObject<HTMLAudioElement>;
  seek: (seconds: number) => void;
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

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

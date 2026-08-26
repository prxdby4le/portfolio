import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { usePlayer } from "@/hooks/usePlayer";
import Waveform from "./Waveform";
import CDDisc from "./CDDisc";

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
    toggleShuffle,
    audioRef,
    analyser,
  } = usePlayer();

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
    // audioRef now comes from PlayerContext rather than a local useRef, so the
    // lint rule can no longer tell it is stable. It is: the provider holds one
    // ref for the life of the app, and listing it never retriggers anything.
  }, [handleTrackEnd, audioRef]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = isRepeat;
  }, [isRepeat, audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log("Playback interrupted:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

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
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, audioRef]);

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
    if (!Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const iconBtn =
    "grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-ink/10 hover:text-ink";

  return (
    <>
      {/*
        This element lives outside AnimatePresence on purpose. Web Audio can
        only tap an element once, so if it unmounted when the queue emptied,
        the next track would arrive on a fresh element the analyser is not
        wired to and the audio would go silent.
        `crossOrigin` must be set before `src`, hence the attribute rather than
        an assignment in an effect.
      */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      <AnimatePresence>
        {currentTrack && (
          <motion.div
            key="player"
            initial={{ y: 96 }}
            animate={{ y: 0 }}
            exit={{ y: 96 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper-raised shadow-[0_-14px_40px_hsl(340_45%_2%_/_0.5)]",
              isExpanded ? "h-36 sm:h-44" : "h-20"
            )}
          >
            {/* The track drawing itself, behind everything. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <Waveform analyser={analyser} active={isPlaying} />
            </div>

            {/* Seek bar, sitting on the top edge. */}
            <div className="group absolute -top-1.5 left-0 right-0 z-50 flex h-3 items-center">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                aria-label="Posição na faixa"
                className={cn(
                  "w-full cursor-pointer",
                  "[&>:first-child]:h-[3px] [&>:first-child]:rounded-full [&>:first-child]:bg-ink-deep",
                  "[&>:first-child>span]:bg-ink",
                  "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-ink",
                  "[&_[role=slider]]:opacity-0 group-hover:[&_[role=slider]]:opacity-100 [&_[role=slider]]:transition-opacity"
                )}
              />
            </div>

            <div className="relative mx-auto h-full w-full max-w-[1400px] px-4 sm:px-6">
              <div className="flex h-20 items-center justify-between gap-3 sm:gap-6">
                {/* ------------------------------------------------ track */}
                {/* The disc and the title are one link to the track's page.
                    The transport controls sit outside it, so pressing play
                    never navigates by accident. */}
                <Link
                  to={`/track/${currentTrack.id}`}
                  aria-label={`Abrir a página de ${currentTrack.title}`}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-md sm:gap-4"
                >
                  {currentTrack.cover && (
                    <CDDisc
                      cover={currentTrack.cover}
                      spinning={isPlaying}
                      className="h-12 w-12 sm:h-14 sm:w-14"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-ink">
                      {currentTrack.title}
                    </h4>
                    <p className="font-mono-data mt-0.5 truncate text-[11px] uppercase tracking-wider text-muted-foreground">
                      {currentTrack.bpm} bpm
                      {currentTrack.key && `   ${currentTrack.key}`}
                    </p>
                  </div>
                </Link>

                {/* --------------------------------------------- controls */}
                <div className="flex flex-shrink-0 items-center gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={toggleShuffle}
                    aria-pressed={isShuffle}
                    aria-label="Ordem aleatória"
                    className={cn(iconBtn, "hidden sm:grid", isShuffle && "text-ink")}
                  >
                    <Shuffle className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Faixa anterior"
                    className={iconBtn}
                  >
                    <SkipBack className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? "Pausar" : "Tocar"}
                    data-live="true"
                    className="play-dot grid h-11 w-11 place-items-center"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4" strokeWidth={2} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Próxima faixa"
                    className={iconBtn}
                  >
                    <SkipForward className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={toggleRepeat}
                    aria-pressed={isRepeat}
                    aria-label="Repetir faixa"
                    className={cn(iconBtn, "hidden sm:grid", isRepeat && "text-ink")}
                  >
                    <Repeat className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                {/* ------------------------------------- time, volume, more */}
                <div className="hidden flex-1 items-center justify-end gap-5 md:flex">
                  <span className="font-mono-data text-xs text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                    <div className="w-20">
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => setVolume(value[0])}
                        aria-label="Volume"
                        className="cursor-pointer [&>:first-child>span]:bg-ink [&_[role=slider]]:border-0 [&_[role=slider]]:bg-ink"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Recolher player" : "Expandir player"}
                    className={iconBtn}
                  >
                    <ChevronUp
                      className={cn(
                        "h-4 w-4 transition-transform duration-500",
                        isExpanded && "rotate-180"
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Recolher player" : "Expandir player"}
                  className={cn(iconBtn, "md:hidden")}
                >
                  <ChevronUp
                    className={cn(
                      "h-4 w-4 transition-transform duration-500",
                      isExpanded && "rotate-180"
                    )}
                    strokeWidth={1.75}
                  />
                </button>
              </div>

              {/* -------------------------------------- expanded, mobile */}
              {isExpanded && (
                <div className="space-y-2 pt-1 md:hidden">
                  <div className="font-mono-data flex items-center justify-between px-0.5 text-[10px] text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
                    <div className="flex-1">
                      <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={(value) => setVolume(value[0])}
                        aria-label="Volume"
                        className="cursor-pointer [&>:first-child>span]:bg-ink [&_[role=slider]]:border-0 [&_[role=slider]]:bg-ink"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------- expanded, queue */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="no-scrollbar hidden gap-2 overflow-x-auto pt-1 md:flex"
                >
                  {queue.slice(0, 10).map((track) => (
                    <span
                      key={track.id}
                      className={cn(
                        "flex-none rounded-md border px-3 py-1 text-xs",
                        track.id === currentTrack.id
                          ? "border-ink/50 bg-ink/10 text-ink"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {track.title}
                    </span>
                  ))}
                  {queue.length > 10 && (
                    <span className="flex-none px-2 py-1 text-xs text-muted-foreground">
                      +{queue.length - 10} mais
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

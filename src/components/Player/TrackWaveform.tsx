import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";

interface TrackWaveformProps {
  peaks: Float32Array | null;
  duration: number;
  /** True when this is the track the player currently holds. */
  isCurrent: boolean;
  loading?: boolean;
  onSeekRatio: (ratio: number) => void;
  className?: string;
}

const BAR = 3;
const GAP = 2;

function readInk() {
  const styles = getComputedStyle(document.documentElement);
  const get = (name: string) => styles.getPropertyValue(name).trim();
  return {
    played: `hsl(${get("--ink")})`,
    ahead: `hsl(${get("--ink-deep")})`,
    hover: `hsl(${get("--ink-dim")})`,
  };
}

/**
 * The whole track, drawn as a peak envelope you can click into.
 *
 * The playhead is read straight off the audio element and painted to canvas.
 * Nothing here goes through React state per frame: `timeupdate` fires several
 * times a second and a scrub drags continuously, and re-rendering on either
 * would make the bar stutter.
 */
export default function TrackWaveform({
  peaks,
  duration,
  isCurrent,
  loading = false,
  onSeekRatio,
  className,
}: TrackWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioRef, isPlaying } = usePlayer();
  const progress = useRef(0);
  const hoverRatio = useRef<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ink = readInk();
    ctx.clearRect(0, 0, w, h);

    const barW = BAR * dpr;
    const step = (BAR + GAP) * dpr;
    const count = Math.max(1, Math.floor(w / step));
    const mid = h / 2;
    const playedTo = progress.current * w;
    const hoverTo = hoverRatio.current === null ? null : hoverRatio.current * w;

    for (let i = 0; i < count; i++) {
      const x = i * step;
      // Map canvas columns onto the envelope, whatever the bucket count.
      const peak = peaks[Math.floor((i / count) * peaks.length)] ?? 0;
      const barH = Math.max(barW, peak * h * 0.92);

      if (x < playedTo) ctx.fillStyle = ink.played;
      else if (hoverTo !== null && x < hoverTo) ctx.fillStyle = ink.hover;
      else ctx.fillStyle = ink.ahead;

      const radius = barW / 2;
      ctx.beginPath();
      ctx.roundRect(x, mid - barH / 2, barW, barH, radius);
      ctx.fill();
    }
  }, [peaks]);

  // Follow the playhead. rAF only while audio is actually running; otherwise
  // a single repaint on timeupdate is enough.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !peaks) return;

    let raf = 0;

    const sync = () => {
      const total = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : duration;
      progress.current = isCurrent && total > 0 ? audio.currentTime / total : 0;
      paint();
    };

    const loop = () => {
      sync();
      raf = requestAnimationFrame(loop);
    };

    sync();

    if (isCurrent && isPlaying) {
      raf = requestAnimationFrame(loop);
    } else {
      audio.addEventListener("timeupdate", sync);
    }

    const onResize = () => paint();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      audio.removeEventListener("timeupdate", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [audioRef, peaks, isCurrent, isPlaying, duration, paint]);

  const ratioFrom = (clientX: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  if (loading) {
    return (
      <div
        className={cn("flex items-center gap-[2px] overflow-hidden", className)}
        aria-hidden="true"
      >
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="animate-soft-pulse w-[3px] shrink-0 rounded-full bg-ink-deep"
            style={{
              // A still, plausible envelope while the real one decodes.
              height: `${18 + Math.abs(Math.sin(i * 0.7)) * 52}%`,
              animationDelay: `${(i % 12) * 60}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (!peaks) return null;

  return (
    <canvas
      ref={canvasRef}
      role="slider"
      tabIndex={0}
      aria-label="Posição na faixa"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(progress.current * duration)}
      className={cn("w-full cursor-pointer touch-none select-none", className)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setScrubbing(true);
        onSeekRatio(ratioFrom(e.clientX));
      }}
      onPointerMove={(e) => {
        hoverRatio.current = ratioFrom(e.clientX);
        if (scrubbing) onSeekRatio(hoverRatio.current);
        paint();
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setScrubbing(false);
      }}
      onPointerLeave={() => {
        hoverRatio.current = null;
        setScrubbing(false);
        paint();
      }}
      onKeyDown={(e) => {
        if (duration <= 0) return;
        const stepSeconds = e.shiftKey ? 10 : 5;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onSeekRatio(Math.min(1, progress.current + stepSeconds / duration));
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onSeekRatio(Math.max(0, progress.current - stepSeconds / duration));
        }
      }}
    />
  );
}

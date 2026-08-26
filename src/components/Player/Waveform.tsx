import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { subscribeSpectrum, bandAt } from "@/lib/spectrum";
import { readInk, alpha, type InkScale } from "@/lib/ink";

interface WaveformProps {
  analyser: AnalyserNode | null;
  active: boolean;
  className?: string;
}

const BANDS = 56;

/**
 * The playing track, drawing itself.
 *
 * A mirrored spectrum envelope rather than bars: the smooth curve suits the
 * rest of the page better, and it reads as one shape moving instead of fifty
 * things flickering.
 *
 * The band data comes from the shared ticker in `lib/spectrum`, which reads
 * the analyser once a frame for every visualiser on screen — including the
 * halos behind the covers — so this and they can never drift apart. The
 * log-ish sampling curve and the silence rule live there too.
 *
 * If the analyser only ever reports silence, the component hides itself. A
 * waveform that is not reading the audio is decoration pretending to be data.
 */
export default function Waveform({ analyser, active, className }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [silent, setSilent] = useState(false);

  useEffect(() => {
    if (!analyser || !active || reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Layout reads, so they happen on resize and not inside the paint.
    let ink: InkScale = readInk();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ink = readInk();
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const xs: number[] = new Array(BANDS);
    const ys: number[] = new Array(BANDS);

    const draw = ({ bands, silent: quiet }: { bands: Float32Array; silent: boolean }) => {
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;
      ctx.clearRect(0, 0, w, h);

      // The graph is not carrying audio. Stop drawing and let the component
      // unmount itself.
      if (quiet) {
        setSilent(true);
        return;
      }

      for (let i = 0; i < BANDS; i++) {
        const value = bandAt(bands, i / BANDS);
        xs[i] = (i / (BANDS - 1)) * w;
        ys[i] = mid - value * mid * 0.9;
      }

      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0]);
      for (let i = 0; i < xs.length - 1; i++) {
        ctx.quadraticCurveTo(
          xs[i],
          ys[i],
          (xs[i] + xs[i + 1]) / 2,
          (ys[i] + ys[i + 1]) / 2
        );
      }
      ctx.lineTo(xs[xs.length - 1], ys[ys.length - 1]);

      // Mirror the same curve back along the bottom half.
      for (let i = xs.length - 1; i > 0; i--) {
        const here = mid + (mid - ys[i]);
        const prev = mid + (mid - ys[i - 1]);
        ctx.quadraticCurveTo(xs[i], here, (xs[i] + xs[i - 1]) / 2, (here + prev) / 2);
      }
      ctx.closePath();

      // Kept deliberately faint. The player's title, time and controls sit on
      // top of this, and they have to stay legible while it moves.
      const fill = ctx.createLinearGradient(0, 0, w, 0);
      fill.addColorStop(0, alpha(ink.raw.ink, 0.08));
      fill.addColorStop(0.5, alpha(ink.raw.ink, 0.22));
      fill.addColorStop(1, alpha(ink.raw.ink, 0.08));
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const unsubscribe = subscribeSpectrum(analyser, draw);

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [analyser, active, reduce]);

  if (!analyser || silent || reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

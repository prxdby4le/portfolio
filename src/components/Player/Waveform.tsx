import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

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
 * Bands are sampled on a curve (t^1.7) rather than linearly, because a linear
 * slice of an FFT gives four fifths of the width to frequencies nobody can
 * hear in a beat. This way the low end gets the room it deserves.
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

    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    let quietFrames = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);

      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;
      ctx.clearRect(0, 0, w, h);

      let peak = 0;
      const xs: number[] = [];
      const ys: number[] = [];

      for (let i = 0; i < BANDS; i++) {
        const from = Math.floor(Math.pow(i / BANDS, 1.7) * data.length);
        const to = Math.max(from + 1, Math.floor(Math.pow((i + 1) / BANDS, 1.7) * data.length));

        let sum = 0;
        for (let j = from; j < to; j++) sum += data[j];
        const value = sum / (to - from) / 255;

        if (value > peak) peak = value;
        xs.push((i / (BANDS - 1)) * w);
        ys.push(mid - value * mid * 0.9);
      }

      // Roughly three seconds of pure silence means the graph is not carrying
      // audio. Stop drawing and let the component unmount itself.
      if (peak < 0.01) {
        if (++quietFrames > 180) {
          setSilent(true);
          return;
        }
      } else {
        quietFrames = 0;
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
      fill.addColorStop(0, "rgba(255, 0, 102, 0.08)");
      fill.addColorStop(0.5, "rgba(255, 0, 102, 0.22)");
      fill.addColorStop(1, "rgba(255, 0, 102, 0.08)");
      ctx.fillStyle = fill;
      ctx.fill();
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
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

import { useEffect, useRef } from "react";
import { subscribeSpectrum, bandAt } from "@/lib/spectrum";
import { readInk, alpha, type InkScale } from "@/lib/ink";
import { cn } from "@/lib/utils";

interface CoverSpectrumProps {
  analyser: AnalyserNode;
  className?: string;
}

/** Overhang as a fraction of the plate's side, and the ceiling in CSS px. */
const OVERHANG_RATIO = 0.075;
const OVERHANG_MAX = 22;

/** One bar per this many CSS px of perimeter, within these bounds. */
const BAR_PITCH = 7;
const BARS_MIN = 40;
const BARS_MAX = 120;

/** Fraction of each edge left empty at both ends, so corners do not pile up. */
const CORNER_GAP = 0.06;

/**
 * The playing cover, wearing its own audio.
 *
 * Bars stand on the four edges of the plate and grow outward, so the record
 * appears to be radiating. Only the tips clear the plate: the canvas sits
 * behind the art, and everything inside the square is hidden by it.
 *
 * Two details do most of the work. The band each bar reads is a triangle wave
 * around the perimeter rather than a straight sweep, which makes the halo
 * symmetric about both axes instead of looking like something rotating. And
 * every bar fades to nothing at its tip, so a bar reads as light bleeding out
 * of the plate rather than as a spike colliding with the caption that sits a
 * few pixels below it in the grid.
 *
 * Deliberately faint, on the same discipline as the player's waveform: the
 * cover is the subject, this is weather around it.
 *
 * Must be rendered as a direct child of the plate box, which it measures.
 */
export default function CoverSpectrum({ analyser, className }: CoverSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const plate = canvas?.parentElement;
    if (!canvas || !plate) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resolved on mount and on resize, never per frame: each of these is a
    // layout read or a style write, and neither belongs in a paint loop.
    let ink: InkScale = readInk();
    let dpr = 1;
    let pad = 0;
    let bars = BARS_MIN;

    // The plate is measured, not the canvas. The canvas hangs outside the
    // plate by `overhang` on every side, so observing it while writing its own
    // inset here would feed back into this handler forever.
    const resize = () => {
      const rect = plate.getBoundingClientRect();
      const side = Math.max(1, Math.min(rect.width, rect.height));
      const overhang = Math.min(OVERHANG_RATIO * side, OVERHANG_MAX);

      canvas.style.inset = `${-overhang}px`;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      pad = overhang * dpr;
      canvas.width = Math.max(1, Math.round((rect.width + overhang * 2) * dpr));
      canvas.height = Math.max(1, Math.round((rect.height + overhang * 2) * dpr));

      bars = Math.round(
        Math.max(BARS_MIN, Math.min(BARS_MAX, (side * 4) / BAR_PITCH))
      );
      bars -= bars % 4; // Four identical edges.

      ink = readInk();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(plate);

    const draw = ({ bands, silent }: { bands: Float32Array; silent: boolean }) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (silent || pad <= 0) return;

      const left = pad;
      const top = pad;
      const right = w - pad;
      const bottom = h - pad;
      const width = right - left;
      const height = bottom - top;

      const perEdge = bars / 4;
      const barW = Math.max(1.5 * dpr, (width / perEdge) * 0.42);
      const radius = barW / 2;

      // Additive, so overlapping glow reads as light rather than as a stack of
      // flat swatches.
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < bars; i++) {
        const u = i / bars;

        // Triangle wave: the frequency ramps up and back down twice around the
        // square, which mirrors the halo across both axes.
        const t = Math.abs(((u * 4) % 2) - 1);
        const level = bandAt(bands, t);
        if (level < 0.015) continue;

        const length = level * pad * 1.35;
        if (length < 0.5) continue;

        // Position along this bar's own edge, inset from both corners.
        const edge = Math.floor(u * 4);
        const along = perEdge > 1 ? (i % perEdge) / (perEdge - 1) : 0.5;
        const eased = CORNER_GAP + along * (1 - CORNER_GAP * 2);

        let x = 0;
        let y = 0;
        let dx = 0;
        let dy = 0;

        if (edge === 0) {
          x = left + eased * width; // top, growing up
          y = top;
          dy = -1;
        } else if (edge === 1) {
          x = right; // right, growing right
          y = top + eased * height;
          dx = 1;
        } else if (edge === 2) {
          x = right - eased * width; // bottom, growing down
          y = bottom;
          dy = 1;
        } else {
          x = left; // left, growing left
          y = bottom - eased * height;
          dx = -1;
        }

        // Fade along the bar so the tip reaches zero.
        const grad = ctx.createLinearGradient(x, y, x + dx * length, y + dy * length);
        grad.addColorStop(0, alpha(ink.raw.ink, 0.5));
        grad.addColorStop(0.55, alpha(ink.raw.ink, 0.22));
        grad.addColorStop(1, alpha(ink.raw.lift, 0));
        ctx.fillStyle = grad;

        ctx.beginPath();
        if (dx === 0) {
          ctx.roundRect(x - barW / 2, dy < 0 ? y - length : y, barW, length, radius);
        } else {
          ctx.roundRect(dx < 0 ? x - length : x, y - barW / 2, length, barW, radius);
        }
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const unsubscribe = subscribeSpectrum(analyser, draw);

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Behind the art by DOM order alone: both this and `.duo-plate` are
      // positioned with `z-index: auto`, so they paint in the order they are
      // written and the opaque plate covers everything inside the square. No
      // z-index anywhere in this stack — adding one would only invite the next
      // person to add a bigger one.
      // The inset is written by the effect above, which is why it is not a
      // negative Tailwind inset here.
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}

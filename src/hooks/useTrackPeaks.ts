import { useEffect, useState } from "react";

export interface TrackPeaks {
  peaks: Float32Array | null;
  duration: number;
  status: "idle" | "loading" | "ready" | "error";
}

const IDLE: TrackPeaks = { peaks: null, duration: 0, status: "idle" };

/**
 * Downloads a track once, decodes it, and reduces it to a peak envelope so the
 * whole song can be drawn as a static waveform.
 *
 * This is a different job from the analyser in useAudioAnalyser: that one reads
 * the instant that is playing right now, this one reads the entire file up
 * front so you can see the shape of the track and click into it.
 *
 * Two things worth knowing:
 *
 * - A decoded AudioBuffer is large. Three minutes of 44.1k stereo is roughly
 *   60 MB of float32. The context is closed as soon as the envelope is
 *   extracted so the buffer can be collected, and only the few hundred floats
 *   of the envelope are kept.
 * - The reduction pass is synchronous and touches every sample, which costs a
 *   few tens of milliseconds. It runs once per track page, off the render path.
 *
 * Only call this where a single track is on screen. Running it across a grid
 * would download and decode the entire catalogue.
 */
export function useTrackPeaks(src: string | undefined, buckets = 480): TrackPeaks {
  const [state, setState] = useState<TrackPeaks>(IDLE);

  useEffect(() => {
    if (!src) {
      setState(IDLE);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setState({ peaks: null, duration: 0, status: "loading" });

    (async () => {
      let ctx: AudioContext | null = null;
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = await response.arrayBuffer();

        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) throw new Error("Web Audio unavailable");

        ctx = new Ctor();
        const buffer = await ctx.decodeAudioData(bytes);

        const channel = buffer.getChannelData(0);
        const block = Math.max(1, Math.floor(channel.length / buckets));
        const peaks = new Float32Array(buckets);

        let loudest = 0;
        for (let i = 0; i < buckets; i++) {
          const start = i * block;
          const end = Math.min(start + block, channel.length);
          let peak = 0;
          for (let j = start; j < end; j++) {
            const value = channel[j] < 0 ? -channel[j] : channel[j];
            if (value > peak) peak = value;
          }
          peaks[i] = peak;
          if (peak > loudest) loudest = peak;
        }

        // Normalise, so a quietly mastered beat still fills the frame.
        if (loudest > 0) {
          for (let i = 0; i < buckets; i++) peaks[i] /= loudest;
        }

        const duration = buffer.duration;
        await ctx.close();
        ctx = null;

        if (!cancelled) setState({ peaks, duration, status: "ready" });
      } catch (error) {
        if (ctx) {
          try {
            await ctx.close();
          } catch {
            /* already closed */
          }
        }
        if (cancelled) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ peaks: null, duration: 0, status: "error" });
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [src, buckets]);

  return state;
}

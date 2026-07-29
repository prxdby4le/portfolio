import { useEffect, useRef, useState } from "react";

/**
 * Routes the player's <audio> element through a Web Audio AnalyserNode so the
 * waveform can draw the track that is actually playing.
 *
 * Three constraints shape this:
 *
 * 1. `createMediaElementSource` may be called ONCE per element, ever. Call it
 *    twice and the second call throws and the audio goes silent. Hence the
 *    module-level guard in `graph`, which is never rebuilt.
 * 2. Once routed, the element's output only reaches the speakers through the
 *    graph, so the analyser must always stay connected to `destination`.
 * 3. An AudioContext created before a user gesture starts suspended. This runs
 *    on the first play, which is a gesture, and resumes defensively after.
 *
 * The <audio> element must carry `crossOrigin="anonymous"` before its `src` is
 * set, otherwise the media is opaque to Web Audio and the analyser reads
 * silence. Supabase storage sends the needed headers.
 *
 * Returns null when Web Audio is unavailable. Callers render nothing in that
 * case rather than faking a waveform.
 */
export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement>,
  enabled: boolean
) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const graph = useRef<{
    ctx: AudioContext;
    source: MediaElementAudioSourceNode;
    node: AnalyserNode;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Already wired: just make sure the context is awake.
    if (graph.current) {
      if (graph.current.ctx.state === "suspended") void graph.current.ctx.resume();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    try {
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(audio);
      const node = ctx.createAnalyser();
      node.fftSize = 1024;
      node.smoothingTimeConstant = 0.82;

      source.connect(node);
      node.connect(ctx.destination);

      graph.current = { ctx, source, node };
      setAnalyser(node);
      void ctx.resume();
    } catch {
      // Web Audio blocked, or the element was already routed by something
      // else. No waveform, and crucially, audio playback is untouched.
      setAnalyser(null);
    }
  }, [enabled, audioRef]);

  useEffect(() => {
    return () => {
      const g = graph.current;
      if (!g) return;
      try {
        g.source.disconnect();
        g.node.disconnect();
        void g.ctx.close();
      } catch {
        /* context already torn down */
      }
      graph.current = null;
    };
  }, []);

  return analyser;
}

/**
 * One spectrum reading per frame, shared by every visualiser on screen.
 *
 * At any moment the page can be drawing the same audio in several places: the
 * halo behind the playing cover in the grid, the halo behind the hero plate,
 * and the envelope behind the player bar. Each of those pulling its own
 * `requestAnimationFrame` and its own `getByteFrequencyData` would triple the
 * work and let the three drift a frame apart from each other.
 *
 * So the loop lives here, refcounted: it starts with the first subscriber and
 * stops with the last. Subscribers get the same frame object every tick and
 * resample it to however many bars they draw.
 */

/**
 * Band count is deliberately generous. Consumers draw fewer bars than this and
 * downsample; going the other way would be inventing resolution.
 */
export const SPECTRUM_BANDS = 64;

export interface SpectrumFrame {
  /** Per-band level, 0..1, low frequencies first. Reused across frames. */
  bands: Float32Array;
  /** Loudest band this frame, before smoothing. */
  peak: number;
  /**
   * True once the graph has carried roughly three seconds of pure silence,
   * which means it is not actually reading the audio. Consumers hide
   * themselves: a visualiser that is not reading the signal is decoration
   * pretending to be data.
   */
  silent: boolean;
}

type Subscriber = (frame: SpectrumFrame) => void;

/**
 * A linear slice of an FFT gives four fifths of the width to frequencies
 * nobody can hear in a beat. Sampling on a curve gives the low end the room it
 * deserves. Same exponent the player's waveform has always used.
 */
const CURVE = 1.7;

/** Rise fast, fall with weight. Bars that decay as fast as they attack judder. */
const ATTACK = 0.5;
const DECAY = 0.12;

const SILENCE_THRESHOLD = 0.01;
const SILENT_FRAMES = 180;

const subscribers = new Set<Subscriber>();

let raf = 0;
let bound: AnalyserNode | null = null;
let bins: Uint8Array | null = null;
let quietFrames = 0;

const frame: SpectrumFrame = {
  bands: new Float32Array(SPECTRUM_BANDS),
  peak: 0,
  silent: false,
};

function tick() {
  raf = requestAnimationFrame(tick);

  const analyser = bound;
  if (!analyser || !bins) return;

  analyser.getByteFrequencyData(bins);

  let peak = 0;

  for (let i = 0; i < SPECTRUM_BANDS; i++) {
    const from = Math.floor(Math.pow(i / SPECTRUM_BANDS, CURVE) * bins.length);
    const to = Math.max(
      from + 1,
      Math.floor(Math.pow((i + 1) / SPECTRUM_BANDS, CURVE) * bins.length)
    );

    let sum = 0;
    for (let j = from; j < to; j++) sum += bins[j];
    const value = sum / (to - from) / 255;

    if (value > peak) peak = value;

    const previous = frame.bands[i];
    const rate = value > previous ? ATTACK : DECAY;
    frame.bands[i] = previous + (value - previous) * rate;
  }

  if (peak < SILENCE_THRESHOLD) {
    if (quietFrames < SILENT_FRAMES) quietFrames++;
  } else {
    quietFrames = 0;
  }

  frame.peak = peak;
  frame.silent = quietFrames >= SILENT_FRAMES;

  for (const notify of subscribers) notify(frame);
}

/**
 * Start receiving frames. Returns the unsubscribe.
 *
 * Passing a different analyser than the one already bound rebinds the loop;
 * in practice there is only ever one, held by PlayerProvider.
 */
export function subscribeSpectrum(
  analyser: AnalyserNode,
  onFrame: Subscriber
): () => void {
  if (bound !== analyser) {
    bound = analyser;
    bins = new Uint8Array(analyser.frequencyBinCount);
  }

  // Coming back from nobody watching — a pause, a navigation. The levels and
  // the quiet-frame count are from before the gap, and a gap is not evidence
  // of silence, so neither carries over. Otherwise a long pause could leave
  // the counter one frame short of the silence threshold and hide the next
  // visualiser before it drew anything.
  if (subscribers.size === 0) {
    frame.bands.fill(0);
    frame.peak = 0;
    frame.silent = false;
    quietFrames = 0;
  }

  subscribers.add(onFrame);
  if (!raf) raf = requestAnimationFrame(tick);

  return () => {
    subscribers.delete(onFrame);
    if (subscribers.size === 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/**
 * Read a band at an arbitrary position along the spectrum, 0..1.
 *
 * The idiom the track waveform already uses for its peak envelope: map your
 * own column count onto the buffer, whatever its length.
 */
export function bandAt(bands: Float32Array, t: number): number {
  const i = Math.min(bands.length - 1, Math.max(0, Math.floor(t * bands.length)));
  return bands[i] ?? 0;
}

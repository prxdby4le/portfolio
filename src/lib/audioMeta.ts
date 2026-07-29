/**
 * Reads how long an audio file is, locally, before it is uploaded.
 *
 * Cheap compared to the alternatives: no decode, no server round trip, the
 * browser just parses the header. Resolves to null if the file cannot be read,
 * because a missing duration is fine and a wrong one is not.
 */
export function readAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();

    const done = (value: number | null) => {
      URL.revokeObjectURL(url);
      audio.removeAttribute("src");
      resolve(value);
    };

    const timeout = window.setTimeout(() => done(null), 15000);

    audio.addEventListener(
      "loadedmetadata",
      () => {
        window.clearTimeout(timeout);
        const seconds = audio.duration;
        done(Number.isFinite(seconds) && seconds > 0 ? seconds : null);
      },
      { once: true }
    );

    audio.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        done(null);
      },
      { once: true }
    );

    audio.preload = "metadata";
    audio.src = url;
  });
}

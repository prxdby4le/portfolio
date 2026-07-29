/**
 * Seconds to `m:ss`.
 *
 * Returns null rather than a placeholder when the length is unknown: the whole
 * point of storing real durations was to stop printing the same invented
 * "3:00" under every track.
 */
export function formatDuration(seconds: number | undefined | null): string | null {
  if (seconds === undefined || seconds === null) return null;
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

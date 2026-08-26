/**
 * The ink scale, resolved to real colours.
 *
 * Canvas cannot read CSS custom properties, so anything painted to a bitmap
 * has to resolve the tokens itself. Doing it here keeps `#FF0066` from being
 * typed into a drawing routine and quietly drifting away from `--ink`.
 *
 * `getComputedStyle` is a layout read, so call `readInk` on mount and on
 * resize — never inside a per-frame paint. It hands back the raw HSL triples
 * alongside the finished colours so a paint loop can build translucent
 * variants with `alpha()` without touching the DOM again.
 */
export interface InkScale {
  ink: string;
  lift: string;
  dim: string;
  deep: string;
  /** Raw `H S% L%` triples, for `alpha()`. */
  raw: { ink: string; lift: string; dim: string; deep: string };
}

export function readInk(): InkScale {
  const styles = getComputedStyle(document.documentElement);
  const get = (name: string) => styles.getPropertyValue(name).trim();

  const raw = {
    ink: get("--ink"),
    lift: get("--ink-lift"),
    dim: get("--ink-dim"),
    deep: get("--ink-deep"),
  };

  return {
    ink: `hsl(${raw.ink})`,
    lift: `hsl(${raw.lift})`,
    dim: `hsl(${raw.dim})`,
    deep: `hsl(${raw.deep})`,
    raw,
  };
}

/** A raw triple from `InkScale.raw`, at the given opacity. Allocation-cheap. */
export function alpha(rawTriple: string, a: number): string {
  return `hsl(${rawTriple} / ${a})`;
}

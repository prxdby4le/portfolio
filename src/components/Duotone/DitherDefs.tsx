/**
 * DUOTONE PRESS - filter definitions
 *
 * Mounted once at the app root. Everything that references `url(#duotone-*)`
 * in CSS depends on this being in the document.
 *
 * The site prints in two inks:
 *   paper = hsl(340 14% 5%)  -> rgb(0.057, 0.043, 0.048)
 *   ink   = #FF0066          -> rgb(1, 0, 0.4)
 * Those two triplets are the tableValues below. If the tokens in index.css
 * change, these change with them.
 *
 * #duotone-dither  hard two-tone with a noise threshold. Real dithering:
 *                  every pixel resolves to exactly one of the two inks, and
 *                  the illusion of midtone comes from the grain pattern.
 *                  This is the default state of every cover in the catalogue.
 *
 * #duotone-soft    posterised duotone, five steps, no threshold. Keeps more
 *                  of the photograph. Used on the single large hero plate,
 *                  where a full hard dither would be too coarse to read.
 */
export default function DitherDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter
          id="duotone-dither"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Luminance. Rec. 601 weights, so skin and sky separate properly. */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
            result="gray"
          />

          {/* 2. Lift the shadows with a gamma curve, not a linear ramp.
                 Most of these covers are dark artwork: under a linear curve
                 they fall below the threshold in step 5 and print as an almost
                 empty plate. Exponent 0.55 brings a 0.15 shadow up to ~0.35,
                 so it still dithers to a readable ~35% ink coverage, while a
                 0.8 highlight only moves to ~0.88 and does not blow out. */}
          <feComponentTransfer in="gray" result="lifted">
            <feFuncR type="gamma" amplitude="1" exponent="0.55" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.55" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.55" offset="0" />
          </feComponentTransfer>

          {/* 3. The threshold map. feTurbulence rather than a Bayer matrix:
                 an feImage-based ordered matrix needs a data URI that Firefox
                 and Safari handle inconsistently inside filters, and the
                 organic grain reads closer to a photocopy anyway. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="1"
            seed="11"
            result="noiseRaw"
          />
          <feColorMatrix
            in="noiseRaw"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
            result="noise"
          />

          {/* 4. luminance - noise + 0.5 */}
          <feComposite
            in="lifted"
            in2="noise"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="-1"
            k4="0.5"
            result="mixed"
          />

          {/* 5. Hard threshold. Two values in, two values out. */}
          <feComponentTransfer in="mixed" result="bw">
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
          </feComponentTransfer>

          {/* 6. Map 0 -> paper, 1 -> ink. */}
          <feComponentTransfer in="bw" result="duo">
            <feFuncR type="table" tableValues="0.057 1" />
            <feFuncG type="table" tableValues="0.043 0" />
            <feFuncB type="table" tableValues="0.048 0.4" />
          </feComponentTransfer>

          {/* 7. Restore the source alpha, otherwise step 4 leaks outside the
                 image box on non-rectangular sources. */}
          <feComposite in="duo" in2="SourceGraphic" operator="in" />
        </filter>

        <filter
          id="duotone-soft"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
            result="gray"
          />

          <feComponentTransfer in="gray" result="lifted">
            <feFuncR type="gamma" amplitude="1" exponent="0.75" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.75" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.75" offset="0" />
          </feComponentTransfer>

          {/* Five ink steps. Enough to hold a face, few enough to read as print. */}
          <feComponentTransfer in="lifted" result="stepped">
            <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
          </feComponentTransfer>

          <feComponentTransfer in="stepped" result="duo">
            <feFuncR type="table" tableValues="0.057 1" />
            <feFuncG type="table" tableValues="0.043 0" />
            <feFuncB type="table" tableValues="0.048 0.4" />
          </feComponentTransfer>

          <feComposite in="duo" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

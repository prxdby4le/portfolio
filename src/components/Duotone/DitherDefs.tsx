/**
 * DUOTONE PRESS - filter definitions
 *
 * Mounted once at the app root. Anything referencing `url(#duotone)` depends
 * on this being in the document.
 *
 * The site prints in two inks, and this filter maps a photograph onto the ramp
 * between them:
 *
 *   0.00  paper      hsl(340 14% 5%)   rgb(0.057, 0.043, 0.048)
 *   0.25  ink-deep   hsl(340 58% 16%)  rgb(0.253, 0.067, 0.129)
 *   0.50  ink-dim    hsl(340 70% 36%)  rgb(0.612, 0.108, 0.276)
 *   0.75  (blend)                      rgb(0.830, 0.050, 0.340)
 *   1.00  ink        #FF0066           rgb(1.000, 0.000, 0.400)
 *
 * feComponentTransfer `type="table"` interpolates linearly between the stops,
 * so the result is a continuous duotone gradient rather than the hard
 * two-value threshold this used to be. Same two inks, no speckle.
 *
 * A trace of turbulence still runs through it. Not enough to read as noise,
 * just enough to keep large smooth areas from banding and to hold on to the
 * printed feel.
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
          id="duotone"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Luminance, Rec. 601 weights. */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
            result="gray"
          />

          {/* 2. Gentle shadow lift. Most of this artwork is dark; without it
                 the low end of the ramp collapses into flat paper. Softer than
                 the 0.55 the hard-threshold version needed. */}
          <feComponentTransfer in="gray" result="lifted">
            <feFuncR type="gamma" amplitude="1" exponent="0.82" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.82" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.82" offset="0" />
          </feComponentTransfer>

          {/* 3. Fine tooth. +/- 0.035, well under the eye's threshold for
                 grain but enough to break banding on gradients. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
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
          <feComposite
            in="lifted"
            in2="noise"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="-0.07"
            k4="0.035"
            result="toothed"
          />

          {/* 4. The ink ramp. */}
          <feComponentTransfer in="toothed" result="duo">
            <feFuncR type="table" tableValues="0.057 0.253 0.612 0.830 1" />
            <feFuncG type="table" tableValues="0.043 0.067 0.108 0.050 0" />
            <feFuncB type="table" tableValues="0.048 0.129 0.276 0.340 0.4" />
          </feComponentTransfer>

          {/* 5. Clip back to the source alpha. */}
          <feComposite in="duo" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

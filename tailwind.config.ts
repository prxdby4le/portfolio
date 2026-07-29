import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Outfit Variable'", "'Segoe UI'", "system-ui", "sans-serif"],
        display: ["'Outfit Variable'", "'Segoe UI'", "system-ui", "sans-serif"],
        mono: ["'Geist Mono Variable'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        /* ---------------------------------------------------------------
           The duotone. Two inks, one hue (340). See src/index.css.
           --------------------------------------------------------------- */
        paper: {
          DEFAULT: "hsl(var(--paper))",
          raised: "hsl(var(--paper-raised))",
          sunk: "hsl(var(--paper-sunk))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          lift: "hsl(var(--ink-lift))",
          dim: "hsl(var(--ink-dim))",
          deep: "hsl(var(--ink-deep))",
        },
        rule: "hsl(var(--rule))",

        /* --- shadcn/radix semantic tokens --- */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        glass: "hsl(var(--glass))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* ---------------------------------------------------------------
           DEPRECATED. Leftovers from the Frutiger Aero theme this project
           was find-replaced out of. Eleven names, nine of which were the
           same magenta, which is exactly why the old design had no
           hierarchy.

           They all point at the ink scale now so untouched pages (admin,
           About, TrackDetail, PostDetail) keep their accent. Delete each
           name as its last consumer is rewritten. Do not add new usages:
           reach for `ink` / `paper` above.
           --------------------------------------------------------------- */
        aero: {
          sky: "hsl(var(--ink))",
          green: "hsl(var(--ink))",
          aqua: "hsl(var(--ink-lift))",
          white: "hsl(var(--foreground))",
          cloud: "hsl(var(--paper-raised))",
          deep: "hsl(var(--ink-deep))",
          amber: "hsl(var(--ink-lift))",
          violet: "hsl(var(--ink-dim))",
          rose: "hsl(var(--ink))",
          orange: "hsl(var(--ink))",
          teal: "hsl(var(--ink-dim))",
        },
      },
      /* One documented shape rule for the whole site:
         lg = surfaces and plates, md = controls and inputs, sm = small chips.
         The play affordance is the only `rounded-full` on the page. */
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius-control)",
        sm: "0.375rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.97)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        /* Playhead ticks across the ink rule under a playing track. */
        "rule-scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "soft-pulse": "soft-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "spin-slow": "spin-slow 12s linear infinite",
        "rule-scan": "rule-scan 1.8s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;

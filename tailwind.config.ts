import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Comic Sans MS'", "'Comic Neue'", "cursive"],
        display: ["'Comic Sans MS'", "'Comic Neue'", "cursive"],
        comic: ["'Comic Sans MS'", "'Comic Neue'", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        glass: "hsl(var(--glass))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
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
        y2k: {
          pink: "#FF00FF",
          cyan: "#00FFFF",
          lime: "#00FF00",
          yellow: "#FFFF00",
          orange: "#FF6600",
          red: "#FF0033",
          blue: "#3366FF",
          purple: "#9933FF",
        },
      },
      backgroundImage: {
        'gradient-fruity': 'var(--gradient-fruity)',
        'gradient-lime': 'var(--gradient-lime)',
        'gradient-orange': 'var(--gradient-orange)',
        'gradient-purple': 'var(--gradient-purple)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-rainbow': 'linear-gradient(90deg, #FF0000, #FF7700, #FFFF00, #00FF00, #0000FF, #8B00FF, #FF0000)',
        'gradient-y2k': 'linear-gradient(135deg, #FF00FF, #00FFFF, #FF00FF, #FFFF00)',
        'gradient-psychedelic': 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff, #ffff00, #ff00ff)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "rainbow-shift": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "rainbow-bg": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-crazy": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-15px) rotate(5deg)" },
          "50%": { transform: "translateY(0) rotate(0deg)" },
          "75%": { transform: "translateY(-8px) rotate(-5deg)" },
        },
        "wobble": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(-3deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "color-cycle": {
          "0%": { color: "#FF00FF" },
          "16%": { color: "#FF0000" },
          "33%": { color: "#FFFF00" },
          "50%": { color: "#00FF00" },
          "66%": { color: "#00FFFF" },
          "83%": { color: "#9933FF" },
          "100%": { color: "#FF00FF" },
        },
        "border-dance": {
          "0%": { borderColor: "#FF00FF" },
          "25%": { borderColor: "#00FFFF" },
          "50%": { borderColor: "#FFFF00" },
          "75%": { borderColor: "#FF6600" },
          "100%": { borderColor: "#FF00FF" },
        },
        "marquee": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "skew-shake": {
          "0%, 100%": { transform: "skewX(0deg)" },
          "25%": { transform: "skewX(2deg)" },
          "75%": { transform: "skewX(-2deg)" },
        },
        "psychedelic-bg": {
          "0%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        "text-shadow-pop": {
          "0%, 100%": { textShadow: "2px 2px 0px #FF00FF, -2px -2px 0px #00FFFF" },
          "50%": { textShadow: "-2px 2px 0px #FFFF00, 2px -2px 0px #FF6600" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "rainbow-shift": "rainbow-shift 3s linear infinite",
        "rainbow-bg": "rainbow-bg 4s ease infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-crazy": "bounce-crazy 2s ease-in-out infinite",
        "wobble": "wobble 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "color-cycle": "color-cycle 4s linear infinite",
        "border-dance": "border-dance 2s linear infinite",
        "marquee": "marquee 12s linear infinite",
        "blink": "blink 1s step-end infinite",
        "skew-shake": "skew-shake 0.5s ease-in-out infinite",
        "psychedelic-bg": "psychedelic-bg 10s ease infinite",
        "star-twinkle": "star-twinkle 1.5s ease-in-out infinite",
        "text-shadow-pop": "text-shadow-pop 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

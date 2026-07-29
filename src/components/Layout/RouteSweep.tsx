import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A printing pass between routes.
 *
 * Reuses the language of the covers: a sheet of paper carrying ink dots travels
 * across the viewport, and the new page is underneath when it clears.
 *
 * It also fixes a real bug rather than only decorating. React Router keeps the
 * scroll position across navigations, so opening a track from halfway down the
 * catalogue used to drop you halfway down the track page. The reset happens at
 * the midpoint of the sweep, while the viewport is covered, so the jump is
 * never visible.
 */
export default function RouteSweep() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const isFirstRender = useRef(true);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (reduce) {
      window.scrollTo(0, 0);
      return;
    }

    setPass((n) => n + 1);
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 340);
    return () => window.clearTimeout(timer);
  }, [pathname, reduce]);

  if (reduce || pass === 0) return null;

  return (
    <motion.div
      key={pass}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[65]"
      initial={{ x: "-105%" }}
      animate={{ x: "105%" }}
      transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
      style={{
        background: "hsl(var(--paper))",
        backgroundImage:
          "radial-gradient(hsl(var(--ink) / 0.5) 0.7px, transparent 0.8px), radial-gradient(hsl(var(--ink) / 0.5) 0.7px, transparent 0.8px)",
        backgroundSize: "5px 5px, 5px 5px",
        backgroundPosition: "0 0, 2.5px 2.5px",
      }}
    />
  );
}

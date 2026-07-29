import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: React.ReactNode;
  /** Maximum rotation in degrees at the corners. */
  max?: number;
  /** How far the card comes off the page on hover, in px of Z translation. */
  lift?: number;
  className?: string;
}

/**
 * Parallax tilt. The card leans away from the cursor and lifts off the page,
 * with a highlight tracking the pointer so the surface reads as physical.
 *
 * Pointer position is a continuous value, so it lives in motion values and
 * never in React state: `useState` here would re-render the whole subtree on
 * every mouse move and fall apart on a long grid of covers.
 *
 * Touch pointers and reduced-motion users get the children untouched. There is
 * no hover on a phone, and a tilt that fires on tap is just a glitch.
 */
export default function Tilt3D({
  children,
  max = 9,
  lift = 40,
  className,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Normalised pointer position inside the element, 0..1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 24, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), rgba(255,255,255,0) 58%)`;

  if (reduce) return <div className={className}>{children}</div>;

  const recentre = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={recentre}
      onPointerCancel={recentre}
      className={className}
      style={{ perspective: 900 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ z: lift }}
        transition={spring}
        className={cn("relative w-full")}
      >
        {children}

        {/* Specular highlight. Sits above the art, below nothing else, and
            never eats pointer events. */}
        <motion.div
          aria-hidden="true"
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}

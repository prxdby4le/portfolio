import { motion } from "framer-motion";

export interface BubbleItem {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  delay?: number;
  color?: string;
  opacity?: number;
}

interface AeroBubblesProps {
  bubbles: BubbleItem[];
}

export default function AeroBubbles({ bubbles }: AeroBubblesProps) {
  return (
    <>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: b.opacity ?? 0.4, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: (b.delay ?? 0) + i * 0.12,
          }}
          className="absolute pointer-events-none select-none z-10"
          style={{
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
          }}
        >
          <div
            className="w-full h-full rounded-full animate-bubble-float"
            style={{
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), ${b.color ?? 'rgba(14,165,233,0.12)'}, transparent)`,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: 'inset 0 -4px 12px rgba(14,165,233,0.06)',
              animationDelay: `${(b.delay ?? 0) + i * 0.5}s`,
              animationDuration: `${5 + i * 0.8}s`,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

export const HERO_BUBBLES: BubbleItem[] = [
  { top: '10%',  left: '5%',   size: '80px',  delay: 0.2, color: 'rgba(14,165,233,0.1)',  opacity: 0.5 },
  { top: '15%',  right: '8%',  size: '60px',  delay: 0.4, color: 'rgba(34,197,94,0.08)',   opacity: 0.4 },
  { bottom: '20%', left: '12%', size: '50px', delay: 0.6, color: 'rgba(14,165,233,0.08)', opacity: 0.35 },
  { top: '30%',  right: '15%', size: '40px',  delay: 0.3, color: 'rgba(139,92,246,0.08)', opacity: 0.3 },
  { bottom: '15%', right: '6%', size: '70px', delay: 0.5, color: 'rgba(34,197,94,0.1)',   opacity: 0.4 },
];

export const INDEX_BUBBLES: BubbleItem[] = [
  { top: '8%',   left: '3%',    size: '100px', delay: 0.3, color: 'rgba(14,165,233,0.08)',  opacity: 0.4 },
  { top: '15%',  right: '5%',   size: '70px',  delay: 0.5, color: 'rgba(34,197,94,0.06)',   opacity: 0.35 },
  { top: '35%',  left: '2%',    size: '55px',  delay: 0.7, color: 'rgba(139,92,246,0.06)',  opacity: 0.3 },
  { top: '50%',  right: '4%',   size: '85px',  delay: 0.4, color: 'rgba(14,165,233,0.07)',  opacity: 0.35 },
  { top: '65%',  left: '5%',    size: '45px',  delay: 0.8, color: 'rgba(34,197,94,0.08)',   opacity: 0.3 },
  { top: '80%',  right: '6%',   size: '65px',  delay: 0.6, color: 'rgba(14,165,233,0.06)',  opacity: 0.3 },
];

export const ABOUT_BUBBLES: BubbleItem[] = [
  { top: '10%',  left: '4%',   size: '90px',  delay: 0.2, color: 'rgba(14,165,233,0.08)',  opacity: 0.4 },
  { top: '12%',  right: '5%',  size: '60px',  delay: 0.4, color: 'rgba(34,197,94,0.06)',   opacity: 0.35 },
  { top: '40%',  left: '3%',   size: '50px',  delay: 0.6, color: 'rgba(139,92,246,0.06)',  opacity: 0.3 },
  { top: '55%',  right: '4%',  size: '75px',  delay: 0.5, color: 'rgba(14,165,233,0.07)',  opacity: 0.35 },
  { top: '75%',  left: '6%',   size: '55px',  delay: 0.7, color: 'rgba(34,197,94,0.08)',   opacity: 0.3 },
];

export const NOTFOUND_BUBBLES: BubbleItem[] = [
  { top: '15%',  left: '8%',   size: '80px',  delay: 0.2, color: 'rgba(14,165,233,0.1)',  opacity: 0.4 },
  { top: '20%',  right: '10%', size: '60px',  delay: 0.4, color: 'rgba(139,92,246,0.08)', opacity: 0.35 },
  { top: '60%',  left: '12%',  size: '50px',  delay: 0.6, color: 'rgba(14,165,233,0.08)', opacity: 0.3 },
  { bottom: '20%', right: '8%', size: '70px', delay: 0.5, color: 'rgba(34,197,94,0.06)',  opacity: 0.3 },
];

import { motion } from "framer-motion";

export interface StickerItem {
  emoji: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  size: string;
  delay?: number;
  color?: string;
  glow?: string;
}

interface StickersProps {
  stickers: StickerItem[];
}

export default function Stickers({ stickers }: StickersProps) {
  return (
    <>
      {stickers.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: s.rotate - 20 }}
          animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: (s.delay ?? 0) + i * 0.08,
          }}
          whileHover={{
            scale: 1.3,
            rotate: s.rotate + (i % 2 === 0 ? 15 : -15),
            transition: { type: "spring", stiffness: 400 },
          }}
          className="absolute pointer-events-auto select-none z-20"
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            filter: s.glow ? `drop-shadow(0 0 8px ${s.glow})` : 'drop-shadow(2px 3px 2px rgba(0,0,0,0.5))',
            cursor: 'grab',
          }}
          title={s.emoji}
        >
          <span
            className="inline-block"
            style={{ color: s.color }}
          >
            {s.emoji}
          </span>
        </motion.div>
      ))}
    </>
  );
}

export const HERO_STICKERS: StickerItem[] = [
  { emoji: '🎵', top: '15%',  left: '3%',   rotate: -15, size: '2rem',   glow: '#FF00FF' },
  { emoji: '⚡', top: '20%',  right: '5%',  rotate: 12,  size: '2.2rem', glow: '#FFFF00' },
  { emoji: '🔥', bottom: '20%', left: '8%',  rotate: -8,  size: '1.8rem', glow: '#FF6600' },
  { emoji: '💎', top: '35%',  right: '8%',  rotate: 20,  size: '1.6rem', glow: '#00FFFF' },
  { emoji: '🎮', bottom: '15%', right: '4%', rotate: -12, size: '2rem',   glow: '#00FF00' },
  { emoji: '💜', top: '10%',  left: '20%',  rotate: 22,  size: '1.4rem', glow: '#9933FF' },
  { emoji: '🌟', bottom: '25%', right: '18%', rotate: -5, size: '1.5rem', glow: '#FFD700' },
];

export const INDEX_STICKERS: StickerItem[] = [
  { emoji: '🎧', top: '12%',  left: '1%',   rotate: -20, size: '2.5rem', glow: '#FF00FF', delay: 0.5 },
  { emoji: '✨', top: '8%',   right: '2%',  rotate: 15,  size: '2rem',   glow: '#FFFF00', delay: 0.3 },
  { emoji: '💿', top: '25%',  right: '1%',  rotate: -10, size: '2.2rem', glow: '#00FFFF', delay: 0.7 },
  { emoji: '🎤', top: '40%',  left: '0.5%', rotate: 18,  size: '1.8rem', glow: '#FF6600', delay: 0.4 },
  { emoji: '🦋', top: '55%',  right: '1.5%',rotate: -25, size: '2rem',   glow: '#9933FF', delay: 0.6 },
  { emoji: '💫', top: '65%',  left: '2%',   rotate: 10,  size: '1.6rem', glow: '#00FF00', delay: 0.8 },
  { emoji: '🌈', top: '35%',  left: '1.5%', rotate: -8,  size: '2rem',   glow: '#FF0033', delay: 0.9 },
  { emoji: '👾', top: '80%',  right: '2%',  rotate: 12,  size: '2.2rem', glow: '#3366FF', delay: 1.0 },
  { emoji: '🎹', top: '50%',  right: '0.5%',rotate: -15, size: '1.8rem', glow: '#FFD700', delay: 0.5 },
  { emoji: '⭐', top: '75%',  left: '1%',   rotate: 25,  size: '1.5rem', glow: '#FF00FF', delay: 1.1 },
  { emoji: '🍄', top: '90%',  right: '3%',  rotate: -18, size: '2rem',   glow: '#FF0033', delay: 0.7 },
  { emoji: '🎸', top: '18%',  left: '92%',  rotate: 30,  size: '1.7rem', glow: '#FF6600', delay: 0.2 },
];

export const ABOUT_STICKERS: StickerItem[] = [
  { emoji: '🏆', top: '12%',  left: '2%',   rotate: -12, size: '2.2rem', glow: '#FFD700', delay: 0.3 },
  { emoji: '💎', top: '10%',  right: '3%',  rotate: 18,  size: '2rem',   glow: '#00FFFF', delay: 0.4 },
  { emoji: '🎵', top: '30%',  left: '1%',   rotate: -22, size: '1.8rem', glow: '#FF00FF', delay: 0.5 },
  { emoji: '🌟', top: '35%',  right: '1.5%',rotate: 10,  size: '2rem',   glow: '#FFFF00', delay: 0.6 },
  { emoji: '🔥', top: '55%',  left: '2%',   rotate: 15,  size: '2rem',   glow: '#FF6600', delay: 0.7 },
  { emoji: '✨', top: '50%',  right: '2%',  rotate: -8,  size: '1.6rem', glow: '#9933FF', delay: 0.8 },
  { emoji: '🎮', top: '70%',  left: '1%',   rotate: -20, size: '2.2rem', glow: '#00FF00', delay: 0.9 },
  { emoji: '💜', top: '72%',  right: '3%',  rotate: 25,  size: '1.5rem', glow: '#9933FF', delay: 1.0 },
  { emoji: '⚡', top: '85%',  left: '3%',   rotate: 12,  size: '1.8rem', glow: '#FFFF00', delay: 0.4 },
  { emoji: '🎤', top: '88%',  right: '2%',  rotate: -15, size: '2rem',   glow: '#00FFFF', delay: 1.1 },
];

export const NOTFOUND_STICKERS: StickerItem[] = [
  { emoji: '💀', top: '10%',  left: '5%',   rotate: -20, size: '2.5rem', glow: '#FF0033', delay: 0.2 },
  { emoji: '👻', top: '15%',  right: '6%',  rotate: 15,  size: '2.2rem', glow: '#9933FF', delay: 0.3 },
  { emoji: '😵', top: '60%',  left: '8%',   rotate: 25,  size: '2rem',   glow: '#FF00FF', delay: 0.5 },
  { emoji: '🕹️', top: '65%',  right: '7%',  rotate: -12, size: '2.2rem', glow: '#00FFFF', delay: 0.6 },
  { emoji: '❌', bottom: '20%', left: '10%', rotate: -30, size: '1.8rem', glow: '#FF0033', delay: 0.4 },
  { emoji: '⚠️', bottom: '25%', right: '8%', rotate: 10,  size: '2rem',   glow: '#FFFF00', delay: 0.7 },
];

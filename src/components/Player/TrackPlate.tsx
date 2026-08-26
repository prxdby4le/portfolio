import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Track } from "@/types/data";
import { usePlayer } from "@/hooks/usePlayer";
import DuotonePlate from "@/components/Duotone/DuotonePlate";
import Tilt3D from "@/components/Duotone/Tilt3D";
import CoverSpectrum from "./CoverSpectrum";

interface TrackPlateProps {
  track: Track;
  /** Passed through to the tilt. Bigger plates lean further. */
  tiltMax?: number;
  tiltLift?: number;
  priority?: boolean;
  sizes?: string;
  /** Lands on the plate itself: aspect ratio, shadow, hover shadow. */
  className?: string;
  /**
   * Overlay printed on the plate — a play button, a playhead. Positioned
   * against the plate box and tilted with it, above the art and above the
   * halo.
   */
  children?: React.ReactNode;
}

/**
 * A track's cover, which grows a halo when that track is the one playing.
 *
 * Every place a cover appears used to repeat the same Tilt3D-wrapping-a-plate
 * pair; this is that pair plus the one rule the halo needs, in one place, so
 * a new cover site cannot forget it.
 *
 * The rule: the halo belongs to the audio, not to the picture. It appears only
 * where the cover on screen is the cover of the track currently coming out of
 * the speakers, which is why the check is on `currentTrack.id` and not on the
 * image. Covers that merely look similar, or the same track shown on another
 * page while something else plays, stay still.
 *
 * Pausing fades it out rather than cutting it: movement on this site means
 * audio is moving, so when the audio stops the movement has to leave, but a
 * hard cut would read as a glitch.
 *
 * `live` on the plate underneath is a different question — it asks whether
 * this is the loaded track, playing or not — and keeps its existing behaviour.
 */
export default function TrackPlate({
  track,
  tiltMax,
  tiltLift,
  priority = false,
  sizes,
  className,
  children,
}: TrackPlateProps) {
  const { currentTrack, isPlaying, analyser } = usePlayer();
  const reduce = useReducedMotion();

  const isCurrent = currentTrack?.id === track.id;
  const live = isCurrent && isPlaying;

  return (
    <Tilt3D max={tiltMax} lift={tiltLift}>
      <div className="relative">
        <AnimatePresence>
          {live && analyser && !reduce && (
            <motion.div
              key="halo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0"
            >
              <CoverSpectrum analyser={analyser} />
            </motion.div>
          )}
        </AnimatePresence>

        <DuotonePlate
          src={track.cover}
          alt={`Capa de ${track.title}`}
          live={isCurrent}
          priority={priority}
          sizes={sizes}
          // `.duo-plate` is already positioned, so DOM order alone stacks
          // these: halo, then art, then overlay. No z-index needed and none
          // wanted.
          className={className}
        />

        {children}
      </div>
    </Tilt3D>
  );
}

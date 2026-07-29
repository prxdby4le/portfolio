import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DuotonePlateProps {
  src: string;
  alt: string;
  /** Playing tracks stay in full colour without needing a pointer. */
  live?: boolean;
  /** `eager` + high priority for the hero plate, lazy for everything else. */
  priority?: boolean;
  className?: string;
  sizes?: string;
  /**
   * Covers get cropped to fill their square. A DAW session screenshot has to
   * be shown whole, so it gets `contain`.
   */
  fit?: "cover" | "contain";
}

/**
 * A cover printed in two inks, with the colour original underneath.
 *
 * Both layers are the same image. The top one carries the duotone filter and a
 * wide soft-edged mask; the mask slides off on hover, focus, or while the track
 * is playing, so the colour sweeps in rather than snapping.
 *
 * The plate develops as it arrives: it holds an empty paper frame, then settles
 * in once the bitmap is decoded, instead of popping into place at whatever
 * moment the network happens to deliver it.
 *
 * The parent needs `group` for the hover and focus cases to reach this.
 */
export default function DuotonePlate({
  src,
  alt,
  live = false,
  priority = false,
  className,
  sizes,
  fit = "cover",
}: DuotonePlateProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  // A cached image can finish loading before React attaches onLoad, which
  // would leave the plate stuck in its empty state forever.
  useEffect(() => {
    setLoaded(false);
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={cn("duo-plate", className)}
      data-live={live ? "true" : "false"}
      data-loaded={loaded ? "true" : "false"}
    >
      {/* Colour original. Alt text rides on this one: it is the real picture,
          and the ink layer above is a presentational duplicate. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        className={cn("duo-plate-img", fitClass)}
      />

      <img
        src={src}
        alt=""
        aria-hidden="true"
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cn("duo-plate-ink duo-plate-img", fitClass)}
      />
    </div>
  );
}

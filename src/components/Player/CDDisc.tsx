import { cn } from "@/lib/utils";

interface CDDiscProps {
  cover: string;
  spinning: boolean;
  className?: string;
}

/**
 * The player's cover art, which becomes a compact disc while the track plays.
 *
 * Layer order matters and is not arbitrary (see the `.cd` block in index.css):
 * art and grooves rotate together because they are the disc, while the sheen
 * and the spindle hub stay fixed because they are, respectively, a reflection
 * and the hole the player grips.
 */
export default function CDDisc({ cover, spinning, className }: CDDiscProps) {
  return (
    <div
      className={cn("cd flex-shrink-0", className)}
      data-spinning={spinning ? "true" : "false"}
    >
      <div className="cd-spin">
        <img src={cover} alt="" aria-hidden="true" className="cd-art" />
        <div className="cd-grooves" />
      </div>

      <div className="cd-sheen" />
      <div className="cd-hub" />
    </div>
  );
}

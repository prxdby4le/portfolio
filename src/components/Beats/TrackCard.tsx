import { Play, Pause, Download, Share2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Track } from "@/types/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
  index: number;
}

export default function TrackCard({ track, isPlaying, isActive, onPlay, index }: TrackCardProps) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/?track=${track.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link da faixa foi copiado para a área de transferência.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Confira: ${track.title}`,
          url: `${window.location.origin}/?track=${track.id}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative glass rounded-xl p-4 transition-all duration-300 cursor-pointer",
        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/30"
      )}
      onClick={onPlay}
    >
      {/* Cover Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-dark">
        {track.cover && (
          <img 
            src={track.cover} 
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center",
          isActive && "opacity-100"
        )}>
          <Button
            variant="glass"
            size="icon"
            className={cn(
              "rounded-full w-14 h-14 shadow-lg",
              isActive && isPlaying && "bg-primary/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            {isActive && isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Track Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {track.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{track.bpm} BPM</span>
          {track.key && (
            <>
              <span>•</span>
              <span>{track.key}</span>
            </>
          )}
          <span>•</span>
          <span>{track.duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {track.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="text-xs px-2 py-0 h-5 bg-muted/50 hover:bg-muted"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Link2 className="w-4 h-4" />
          </Button>
          {track.downloadable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                // Download logic
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
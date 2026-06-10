import { useNavigate } from "react-router-dom";
import { Play, Pause, Download, Share2, Link2, Info } from "lucide-react";
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
  const navigate = useNavigate();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/track/${track.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link da faixa foi copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Link não copiado",
        description: "Ação bloqueada pelo navegador (área de transferência indisponível).",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Confira: ${track.title}`,
          url: `${window.location.origin}/track/${track.id}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const aeroColors = ['#FF0066', '#CC0052', '#FF3385', '#990040', '#E6005C', '#FF1A75'];
  const cardColor = aeroColors[index % aeroColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative aero-card p-3 sm:p-4 cursor-pointer",
        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      style={{
        borderColor: isActive ? cardColor : undefined,
        boxShadow: isActive ? `0 8px 32px ${cardColor}20` : undefined,
      }}
      onClick={() => navigate(`/track/${track.id}`)}
    >
      {/* Cover Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 sm:mb-4 border border-white/30 group-hover:border-primary/30 transition-colors">
        {track.cover && (
          <img 
            src={track.cover} 
            alt={track.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center",
          isActive && "opacity-100"
        )}>
          <Button
            variant="glass"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 sm:w-14 sm:h-14 border border-primary/30 shadow-lg bg-black text-white",
              isActive && isPlaying && "bg-primary/20 animate-soft-pulse"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            {isActive && isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Track Info */}
      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="font-semibold text-xs sm:text-sm truncate group-hover:text-primary transition-colors">
          {track.title}
        </h3>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground font-medium">
          <span>{track.bpm} BPM</span>
          {track.key && (
            <>
              <span className="text-aero-sky">·</span>
              <span>{track.key}</span>
            </>
          )}
          <span className="text-aero-sky">·</span>
          <span>{track.duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {track.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 h-4 sm:h-5 font-medium bg-black border-primary/20 text-white"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1.5 sm:pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          {track.downloadable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

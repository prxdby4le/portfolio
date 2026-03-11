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

  const neonColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF6600', '#9933FF'];
  const cardColor = neonColors[index % neonColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -6, rotate: Math.random() > 0.5 ? 1 : -1 }}
      className={cn(
        "group relative y2k-card p-3 sm:p-4 cursor-pointer",
        isActive && "ring-2 ring-y2k-pink ring-offset-2 ring-offset-background"
      )}
      style={{
        borderColor: isActive ? '#FF00FF' : `${cardColor}40`,
        boxShadow: isActive ? `0 0 25px ${cardColor}60, 0 0 50px ${cardColor}30` : undefined,
      }}
      onClick={onPlay}
    >
      {/* Cover Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 sm:mb-4 border-2 border-y2k-pink/20 group-hover:border-y2k-cyan/50 transition-colors">
        {track.cover && (
          <img 
            src={track.cover} 
            alt={track.title}
            className="w-full h-full object-cover group-hover:animate-rainbow-shift transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-y2k-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center",
          isActive && "opacity-100"
        )}>
          <Button
            variant="glass"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 sm:w-14 sm:h-14 border-2 border-y2k-pink shadow-lg",
              isActive && isPlaying && "bg-y2k-pink/20 animate-glow-pulse"
            )}
            style={{ boxShadow: '0 0 20px #FF00FF80' }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            {isActive && isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-y2k-pink" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1 text-y2k-cyan" />
            )}
          </Button>
        </div>
      </div>

      {/* Track Info */}
      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="font-bold text-xs sm:text-sm truncate group-hover:text-y2k-pink transition-colors">
          {track.title}
        </h3>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-y2k-cyan/70 font-bold">
          <span>{track.bpm} BPM</span>
          {track.key && (
            <>
              <span className="text-y2k-pink">✦</span>
              <span>{track.key}</span>
            </>
          )}
          <span className="text-y2k-pink">✦</span>
          <span>{track.duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {track.tags.slice(0, 3).map((tag, i) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 h-4 sm:h-5 border font-bold"
              style={{ 
                borderColor: neonColors[(index + i) % neonColors.length] + '60',
                color: neonColors[(index + i) % neonColors.length],
                background: neonColors[(index + i) % neonColors.length] + '10',
              }}
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
            className="h-7 w-7 sm:h-8 sm:w-8 text-y2k-cyan hover:text-y2k-pink hover:bg-y2k-pink/10"
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
            className="h-7 w-7 sm:h-8 sm:w-8 text-y2k-cyan hover:text-y2k-pink hover:bg-y2k-pink/10"
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
              className="h-7 w-7 sm:h-8 sm:w-8 text-y2k-cyan hover:text-y2k-pink hover:bg-y2k-pink/10"
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

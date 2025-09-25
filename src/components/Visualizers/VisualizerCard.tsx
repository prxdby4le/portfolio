import { Play, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visualizer } from "@/types/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VisualizerCardProps {
  visualizer: Visualizer;
  index: number;
  onClick: () => void;
}

export default function VisualizerCard({ visualizer, index, onClick }: VisualizerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden glass">
        {/* Thumbnail */}
        <div className="absolute inset-0 bg-gradient-dark">
          {visualizer.thumbnail && (
            <img
              src={visualizer.thumbnail}
              alt={visualizer.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <Button
              variant="glass"
              size="icon"
              className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Gradient Border Glow */}
        <div className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20",
          "blur-xl"
        )} />
      </div>
      
      {/* Title and Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {visualizer.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{visualizer.duration}</span>
          <span>•</span>
          <span className="capitalize">{visualizer.category}</span>
        </div>
      </div>
    </motion.div>
  );
}
import { Play, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visualizer } from "@/types/data";
import { motion } from "framer-motion";

interface VisualizerCardProps {
  visualizer: Visualizer;
  index: number;
  onClick: () => void;
}

const neonColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF6600', '#9933FF'];

export default function VisualizerCard({ visualizer, index, onClick }: VisualizerCardProps) {
  const color = neonColors[index % neonColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="relative aspect-video rounded-xl overflow-hidden y2k-card p-0"
        style={{ borderColor: `${color}40` }}
      >
        <div className="absolute inset-0">
          {visualizer.thumbnail && (
            <img
              src={visualizer.thumbnail}
              alt={visualizer.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-y2k-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="glass"
              size="icon"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-2 border-y2k-pink hover:scale-110 transition-transform"
              style={{ boxShadow: '0 0 20px #FF00FF80' }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1 text-y2k-pink" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-2 border-y2k-cyan hover:scale-110 transition-transform"
              style={{ boxShadow: '0 0 20px #00FFFF80' }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-y2k-cyan" />
            </Button>
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
          style={{ background: `linear-gradient(135deg, ${color}20, transparent, ${color}20)` }}
        />
      </div>
      
      {/* Title and Info */}
      <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1">
        <h3 className="font-bold text-sm sm:text-base group-hover:text-y2k-pink transition-colors truncate">
          {visualizer.title}
        </h3>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold" style={{ color: `${color}90` }}>
          <span>{visualizer.duration}</span>
          <span className="text-y2k-pink">✦</span>
          <span className="capitalize">{visualizer.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

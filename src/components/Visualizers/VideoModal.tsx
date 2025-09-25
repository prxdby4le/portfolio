import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visualizer } from "@/types/data";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  visualizer: Visualizer | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function VideoModal({ 
  visualizer, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen, visualizer]);

  if (!visualizer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-6xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="glass"
              size="icon"
              className="absolute -top-12 right-0 rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Navigation Buttons */}
            {onPrevious && (
              <Button
                variant="glass"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full z-10"
                onClick={onPrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {onNext && (
              <Button
                variant="glass"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full z-10"
                onClick={onNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
            
            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden glass shadow-2xl">
              <video
                ref={videoRef}
                src={visualizer.src}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            
            {/* Video Info */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-display font-bold text-foreground">
                {visualizer.title}
              </h2>
              <p className="text-muted-foreground mt-2">
                {visualizer.duration} • {visualizer.category}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
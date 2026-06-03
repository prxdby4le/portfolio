import { useState } from "react";
import { Visualizer, VisualizersData } from "@/types/data";
import VisualizerCard from "./VisualizerCard";
import VideoModal from "./VideoModal";
import visualizersData from "@/data/visualizers.json";
import { motion } from "framer-motion";

export default function VisualizersGrid() {
  const [visualizers] = useState<VisualizersData>(visualizersData as VisualizersData);
  const [selectedVisualizer, setSelectedVisualizer] = useState<Visualizer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (visualizer: Visualizer) => {
    setSelectedVisualizer(visualizer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVisualizer(null), 300);
  };

  const handleNext = () => {
    if (!selectedVisualizer) return;
    const currentIndex = visualizers.videos.findIndex(v => v.id === selectedVisualizer.id);
    const nextIndex = (currentIndex + 1) % visualizers.videos.length;
    setSelectedVisualizer(visualizers.videos[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedVisualizer) return;
    const currentIndex = visualizers.videos.findIndex(v => v.id === selectedVisualizer.id);
    const prevIndex = currentIndex === 0 ? visualizers.videos.length - 1 : currentIndex - 1;
    setSelectedVisualizer(visualizers.videos[prevIndex]);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8 text-center px-2"
      >
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-1 sm:mb-2 text-aero-green">
          Visualizers
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          Experiências visuais que faço utilizando as capas originais dos projetos.
        </p>
      </motion.div>

      {visualizers.videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="aero-card p-8 sm:p-12 text-center"
        >
          <p className="text-sm sm:text-base text-muted-foreground font-medium">Nenhum visualizer disponível no momento</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visualizers.videos.map((visualizer, index) => (
            <VisualizerCard
              key={visualizer.id}
              visualizer={visualizer}
              index={index}
              onClick={() => openModal(visualizer)}
            />
          ))}
        </div>
      )}

      <VideoModal
        visualizer={selectedVisualizer}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={visualizers.videos.length > 1 ? handleNext : undefined}
        onPrevious={visualizers.videos.length > 1 ? handlePrevious : undefined}
      />
    </div>
  );
}

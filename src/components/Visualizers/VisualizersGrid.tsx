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
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-purple bg-clip-text text-transparent">
          Visualizers
        </h2>
        <p className="text-muted-foreground">
          Experiências visuais hipnotizantes para acompanhar os beats
        </p>
      </motion.div>

      {visualizers.videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-xl p-12 text-center"
        >
          <p className="text-muted-foreground">Nenhum visualizer disponível no momento</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
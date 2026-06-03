import { useState } from "react";
import { Track } from "@/types/data";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero/Hero";
import BeatsGrid from "@/components/Beats/BeatsGrid";
import VisualizersGrid from "@/components/Visualizers/VisualizersGrid";
import AeroBubbles, { INDEX_BUBBLES } from "@/components/Aero/AeroBubbles";
import { motion } from "framer-motion";
import { usePlayer } from "@/contexts/PlayerContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'beats' | 'visualizers'>('beats');
  const { currentTrack, isPlaying, handlePlayTrack, handlePlayAllGenre } = usePlayer();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Frutiger Aero Background */}
      <div className="fixed inset-0 bg-gradient-cloud pointer-events-none -z-10" />
      
      {/* Soft atmospheric orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-aero-sky/5 rounded-full blur-[120px] animate-float pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-aero-green/4 rounded-full blur-[120px] animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-aero-violet/3 rounded-full blur-[100px] animate-soft-pulse pointer-events-none -z-10" />
      
      {/* Decorative bubbles */}
      <AeroBubbles bubbles={INDEX_BUBBLES} />

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Hero />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={currentTrack ? "pb-20 sm:pb-24" : ""}
      >
        {activeTab === 'beats' ? (
          <BeatsGrid
            onPlayTrack={handlePlayTrack}
            onPlayAllGenre={handlePlayAllGenre}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        ) : (
          <VisualizersGrid />
        )}
      </motion.main>
    </div>
  );
};

export default Index;

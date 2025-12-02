import { useState } from "react";
import { Track } from "@/types/data";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero/Hero";
import BeatsGrid from "@/components/Beats/BeatsGrid";
import VisualizersGrid from "@/components/Visualizers/VisualizersGrid";
import AudioPlayer from "@/components/Player/AudioPlayer";
import { motion } from "framer-motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'beats' | 'visualizers'>('beats');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Set queue to all tracks in the same genre
      const newQueue = [track]; // In a real app, get all tracks from the same genre
      setQueue(newQueue);
      setCurrentIndex(0);
    }
  };

  const handlePlayAllGenre = (tracks: Track[]) => {
    if (tracks.length > 0) {
      setQueue(tracks);
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentTrack(queue[nextIndex]);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0) {
      const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
      setCurrentTrack(queue[prevIndex]);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 grain opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
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

      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        queue={queue}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTrackEnd={handleTrackEnd}
      />
    </div>
  );
};

export default Index;
import { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero/Hero";
import BeatsGrid from "@/components/Beats/BeatsGrid";
import PostsList from "@/components/Posts/PostsList";
import { usePlayer } from "@/contexts/PlayerContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'beats' | 'posts'>('beats');
  const { currentTrack, isPlaying, handlePlayTrack, handlePlayAllGenre } = usePlayer();

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <Hero />

      <main id="catalogo" className={currentTrack ? "pb-28" : "pb-16"}>
        {activeTab === 'beats' ? (
          <BeatsGrid
            onPlayTrack={handlePlayTrack}
            onPlayAllGenre={handlePlayAllGenre}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        ) : (
          <PostsList />
        )}
      </main>
    </div>
  );
};

export default Index;

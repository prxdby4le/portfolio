import { useState } from "react";
import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Hero/Hero";
import BeatsGrid from "@/components/Beats/BeatsGrid";
import PostsList from "@/components/Posts/PostsList";
import Footer from "@/components/Layout/Footer";
import { usePlayer } from "@/hooks/usePlayer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'beats' | 'posts'>('beats');
  const { currentTrack, isPlaying, handlePlayTrack, handlePlayAllGenre } = usePlayer();

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <Hero />

      {/* No bottom padding for the player here: the footer owns that clearance. */}
      <main id="catalogo">
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

      <Footer />
    </div>
  );
};

export default Index;

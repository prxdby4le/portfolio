import React, { useState } from 'react';
import NavBar from './NavBar.jsx';
import Hero from './Hero.jsx';
import MusicSection from './MusicSection.jsx';
import PlaylistModal from './PlaylistModal.jsx';
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx';

export function AppLayout(){
  const [section, setSection] = useState('home');
  const { currentPlaylistName, setVolume } = useAudioPlayer();
  return (
    <div style={{fontFamily:'Inter, sans-serif', color:'#eee'}}>
      <NavBar current={section} onNavigate={setSection} />
      {section==='home' && <Hero onEnter={setSection} />}
      {section==='music' && <MusicSection />}
      {/* Visual / About / Contact placeholders */}
      {section==='visual' && <Placeholder title="Visualizers" />}
      {section==='about' && <Placeholder title="Sobre" />}
      {section==='contact' && <Placeholder title="Contato" />}
      <footer style={{textAlign:'center',padding:'2rem 0',opacity:.4,fontSize:'.7rem'}}>© {new Date().getFullYear()} prxdby4le</footer>
      <PlaylistModal onClose={()=>window.dispatchEvent(new CustomEvent('close-playlist-react'))} />
    </div>
  );
}

function Placeholder({ title }){
  return (
    <section style={{padding:'3rem 1.5rem', textAlign:'center'}}>
      <h2 style={{marginBottom:12}}>{title}</h2>
      <p style={{maxWidth:560,margin:'0 auto',opacity:.65,fontSize:'.9rem'}}>Seção ainda não migrada para React.</p>
    </section>
  );
}

export default AppLayout;

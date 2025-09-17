import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx';

export function MusicSection() {
  const { playlists, openPlaylist } = useAudioPlayer();
  const names = Object.keys(playlists);
  return (
    <section style={{padding:'2rem 1rem', maxWidth:1100, margin:'0 auto'}}>
      <h2 style={{margin:'0 0 1.5rem'}}>Produção Musical</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1rem'}}>
        {names.map(name=>{
          const p = playlists[name];
          return (
            <div key={name} style={cardStyle} onClick={()=>openPlaylist(name)}>
              <div style={{height:140, background:'linear-gradient(135deg,#0e1f24,#132d33)',borderRadius:12,marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',color:'#4ecdc4',fontSize:48}}>
                ♫
              </div>
              <strong style={{fontSize:'.95rem'}}>{name}</strong>
              <div style={{fontSize:'.7rem',opacity:.7}}>{p.tracks.length} faixas</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const cardStyle={
  cursor:'pointer',
  background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(255,255,255,0.08)',
  padding:'0.75rem 0.75rem 1rem',
  borderRadius:16,
  transition:'0.25s',
  display:'flex',flexDirection:'column'
};

export default MusicSection;

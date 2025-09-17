import React from 'react';
import { useAudioPlayer } from '../context\AudioPlayerContext.jsx';

export function PlaylistModal({ onClose }) {
  const { currentPlaylistName, playlists, trackIndex, currentTrack, playPause, isPlaying, next, prev, setVolume, volume, setTrackIndex } = useAudioPlayer();
  if(!currentPlaylistName) return null;
  const pl = playlists[currentPlaylistName];
  return (
    <div style={overlay}>
      <div style={modal}>
        <header style={header}>
          <h3 style={{margin:0}}>{pl.genre || currentPlaylistName}</h3>
          <button onClick={onClose} style={closeBtn}>×</button>
        </header>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div style={nowPlaying}>
            <div>
              <div style={{fontSize:'.75rem',opacity:.65}}>Tocando agora</div>
              <strong>{currentTrack?.name}</strong>
              <div style={{fontSize:'.7rem',opacity:.6}}>{currentTrack?.artist}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button onClick={prev} style={ctrl}>⏮</button>
              <button onClick={playPause} style={ctrl}>{isPlaying? '⏸':'▶'}</button>
              <button onClick={next} style={ctrl}>⏭</button>
              <input type="range" min={0} max={100} value={Math.round(volume*100)} onChange={e=>setVolume(e.target.value/100)} />
            </div>
          </div>
          <div style={{maxHeight:300,overflowY:'auto',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:6}}>
            {pl.tracks.map((t,i)=> {
              const active = i === trackIndex;
              return (
                <li
                  key={i}
                  onClick={()=> setTrackIndex(i)}
                  style={{
                    padding:'4px 0',
                    borderBottom:'1px solid #233',
                    cursor:'pointer',
                    color: active ? '#4ecdc4' : '#eee',
                    fontWeight: active ? 600 : 400
                  }}
                  title={t.file}
                >
                  {t.display}{t.duration ? ` — ${t.duration}` : ''}
                </li>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackRow({ t, active, index }) {
  return (
    <div style={{
      display:'flex',alignItems:'center',gap:12,padding:'6px 10px',
      background: active? 'linear-gradient(90deg,#133136,#0a1618)':'transparent',
      borderRadius:8,fontSize:'.8rem'
    }}>
      <span style={{opacity:.5,width:20}}>{String(index+1).padStart(2,'0')}</span>
      <div style={{flex:1}}>
        <div style={{fontWeight:600,color: active? '#4ecdc4':'#eee'}}>{t.name}</div>
        <div style={{opacity:.55,fontSize:'.65rem'}}>{t.artist}</div>
      </div>
      <span style={{opacity:.6,fontSize:'.65rem'}}>{t.duration}</span>
    </div>
  );
}

const overlay={position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:4000};
const modal={width:'min(800px,92%)',background:'rgba(20,32,36,0.92)',border:'1px solid #1d3c40',borderRadius:18,padding:'1.2rem 1.4rem 1.6rem',boxShadow:'0 20px 40px -10px rgba(0,0,0,0.6)',display:'flex',flexDirection:'column',gap:'1.2rem'};
const header={display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:10};
const closeBtn={background:'none',border:'none',color:'#bbb',fontSize:28, cursor:'pointer',lineHeight:1};
const nowPlaying={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 0 0.75rem',borderBottom:'1px solid rgba(255,255,255,0.06)'};
const ctrl={background:'linear-gradient(135deg,#1c3c40,#122629)',border:'1px solid #214b50',color:'#4ecdc4',padding:'6px 10px',borderRadius:10,cursor:'pointer',fontSize:'0.85rem'};

export default PlaylistModal;

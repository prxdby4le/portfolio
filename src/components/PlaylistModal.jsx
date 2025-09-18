import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx';

export default function PlaylistModal(){
  const { current, playlists, closePlaylist } = useAudioPlayer();
  const ref = useRef(null);
  const data = current ? playlists[current] : null;

  useEffect(()=>{
    if(!current) return;
    const onKey = (e)=> { if(e.key==='Escape') closePlaylist(); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[current, closePlaylist]);

  useEffect(()=>{
    if(current && ref.current){
      // focus first button for accessibility
      ref.current.querySelector('button')?.focus();
    }
  },[current]);

  if(!current) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={`Playlist ${current}`} style={{ position:'fixed', inset:0, zIndex:90, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div onClick={closePlaylist} style={{ position:'absolute', inset:0, backdropFilter:'blur(14px) saturate(140%)', background:'rgba(10,14,20,0.55)' }} />
      <div ref={ref} style={{ position:'relative', width:'min(560px,100%)', maxHeight:'80vh', overflow:'auto', background:'var(--fg-surface)', border:'1px solid var(--fg-border)', borderRadius:20, padding:'1.4rem 1.5rem 1.7rem', boxShadow:'0 18px 46px -12px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,0.08)' }}>
        <header style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1rem' }}>
          <h3 style={{ margin:0, fontSize:'1.05rem', background:'var(--fg-gradient-accent)', WebkitBackgroundClip:'text', color:'transparent' }}>{current}</h3>
          <div style={{ marginLeft:'auto' }}>
            <button onClick={closePlaylist} style={closeBtnStyle} aria-label="Fechar playlist">✕</button>
          </div>
        </header>
        <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:10 }}>
          {data.tracks.map((t,i)=> (
            <li key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'0.65rem 0.75rem', background:'var(--fg-surface-alt)', border:'1px solid var(--fg-border)', borderRadius:12 }}>
              <span style={{ fontSize:'.65rem', opacity:.6, fontWeight:600, width:26, textAlign:'right' }}>{i+1}.</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.8rem', fontWeight:500 }}>{t.title}</div>
                <div style={{ fontSize:'.6rem', opacity:.55 }}>{formatTime(t.duration)}</div>
              </div>
              <button style={trackBtnStyle} aria-label={`Play ${t.title}`}>▶</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatTime(s){
  const m = Math.floor(s/60); const r = s%60; return `${m}:${r.toString().padStart(2,'0')}`;
}

const closeBtnStyle = {
  background:'var(--fg-surface-alt)', border:'1px solid var(--fg-border)', color:'#fff', fontSize:'.7rem', padding:'.45rem .6rem', borderRadius:8, cursor:'pointer'
};

const trackBtnStyle = {
  background:'var(--fg-accent)', border:'none', color:'#fff', fontSize:'.62rem', padding:'.45rem .55rem', borderRadius:8, cursor:'pointer', boxShadow:'0 0 0 1px rgba(255,255,255,0.15)'
};

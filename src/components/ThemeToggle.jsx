import React, { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const [mode,setMode] = useState('default');
  // load persisted
  useEffect(()=>{
    const saved = localStorage.getItem('theme-mode');
    if(saved === 'neon' || saved === 'default') setMode(saved);
  },[]);
  useEffect(()=>{
    const root = document.documentElement;
    if(mode==='default') root.removeAttribute('data-theme'); else root.setAttribute('data-theme','neon');
    localStorage.setItem('theme-mode', mode);
  },[mode]);
  return (
    <button onClick={()=> setMode(m=> m==='default' ? 'neon':'default')} style={{
      background:'var(--fg-surface-alt)', border:'1px solid var(--fg-border)', color:'#fff', fontSize:'.65rem', padding:'.55rem .9rem',
      textTransform:'uppercase', letterSpacing:'.7px', borderRadius:8, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
      backdropFilter:'blur(var(--fg-blur)) saturate(160%)'
    }} aria-label="Alternar tema">
      <span style={{display:'inline-block', width:8, height:8, borderRadius:20, background:'var(--fg-accent)', boxShadow:'0 0 6px var(--fg-accent)'}} />
      {mode==='default' ? 'Neon Mode' : 'Classic Mode'}
    </button>
  );
}

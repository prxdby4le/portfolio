import React, { useEffect, useState } from 'react';
import './asciitext.css';

// Simple ASCII text reveal effect
export default function AsciiText({ text="ABOUT", interval=35 }){
  const chars = '░▒▓█/@#&%*+?<>~=;:';
  const [display,setDisplay] = useState(text.replace(/./g,' '));
  useEffect(()=>{
    let i=0; let current = text.split('');
    const id = setInterval(()=>{
      if(i>=current.length){ clearInterval(id); return; }
      const out = current.map((c,idx)=> idx < i ? c : chars[Math.floor(Math.random()*chars.length)]);
      setDisplay(out.join(''));
      i++;
    }, interval);
    return ()=> clearInterval(id);
  },[text, interval]);
  return <span className="ascii-text">{display}</span>;
}

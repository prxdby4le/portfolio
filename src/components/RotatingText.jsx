import React, { useEffect, useState, useRef } from 'react';
import './rotatingtext.css';

export default function RotatingText({ items = [], interval = 1800, align='center' }) {
  const [idx, setIdx] = useState(0);
  const [w, setW] = useState(null);
  const measRef = useRef(null);

  useEffect(()=>{
    if(items.length){
      // measure widest text offscreen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // approximate font (should match usage context)
      const style = getComputedStyle(document.body);
      ctx.font = `600 16px ${style.fontFamily}`;
      const max = items.reduce((m,t)=> Math.max(m, ctx.measureText(t).width), 0);
      setW(Math.ceil(max)+4);
    }
  },[items]);

  useEffect(()=>{
    if(items.length <= 1) return; const id = setInterval(()=>{
      setIdx(i => (i + 1) % items.length);
    }, interval);
    return ()=>clearInterval(id);
  },[items, interval]);
  return (
    <span className="rt-wrapper" ref={measRef} style={{ width: w? w : undefined, textAlign:align, display:'inline-block' }}>
      {items.map((t,i)=>(
        <span key={t+ i} className={"rt-item" + (i===idx?" rt-active":"")} aria-hidden={i!==idx}>
          {t}
        </span>
      ))}
    </span>
  );
}

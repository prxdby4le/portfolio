import React, { useRef, useEffect } from 'react';
import './blurtext.css';

/* BlurText: texto com animação de entrada desfocada que fica nítido ao aparecer */
export default function BlurText({ text, as:Tag='span', delay=0 }) {
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver((ents)=>{
      ents.forEach(ent=>{
        if(ent.isIntersecting){ el.classList.add('bt-in'); }
      });
    },{ threshold:0.2 });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return <Tag ref={ref} className="blur-text" style={{'--bt-delay':`${delay}ms`}}>{text}</Tag>;
}

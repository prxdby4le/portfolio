import React, { useRef, useEffect } from 'react';
import './scrollmarquee.css';

export default function ScrollMarquee({ items = [], speed = 40 }) {
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    let raf; let offset = 0;
    const step = ()=> {
      offset -= speed/60; // px per frame approx
      if(offset <= -el.scrollWidth/2) offset = 0;
      el.style.transform = `translateX(${offset}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return ()=> cancelAnimationFrame(raf);
  },[speed]);
  return (
    <div className="sm-outer">
      <div className="sm-inner" ref={ref}>
        {[...items, ...items].map((it,i)=>(
          <span key={i} className="sm-item">{it}</span>
        ))}
      </div>
    </div>
  );
}

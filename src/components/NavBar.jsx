import React, { useRef, useEffect, useState } from 'react';
import styles from './NavBar.module.css';
import ThemeToggle from './ThemeToggle.jsx';

export function NavBar({ onNavigate, current }) {
  const links = [
    {id:'home', label:'Home'},
    {id:'music', label:'Produção'},
    {id:'visual', label:'Visual'},
    {id:'about', label:'Sobre'},
    {id:'contact', label:'Contato'}
  ];
  const btnRefs = useRef([]);
  const wrapRef = useRef(null);
  const sliderRef = useRef(null);
  const [mounted,setMounted]=useState(false);
  useEffect(()=>{ setMounted(true); },[]);

  const positionSlider = () => {
    const idx = links.findIndex(l=> l.id===current);
    const btn = btnRefs.current[idx];
    const slider = sliderRef.current;
    const wrap = wrapRef.current;
    if(!btn || !slider || !wrap) return;
    const bRect = btn.getBoundingClientRect();
    const wRect = wrap.getBoundingClientRect();
    const width = bRect.width * 0.46; // relative width
    const left = bRect.left - wRect.left + (bRect.width - width)/2;
    slider.style.width = width + 'px';
    slider.style.transform = `translateX(${left}px)`;
  };
  useEffect(()=>{ positionSlider(); window.addEventListener('resize', positionSlider); return ()=> window.removeEventListener('resize', positionSlider); },[current, mounted]);

  const onKey = (e, idx) => {
    if(e.key==='ArrowRight'){ e.preventDefault(); const n = (idx+1)%links.length; btnRefs.current[n]?.focus(); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); const n = (idx-1+links.length)%links.length; btnRefs.current[n]?.focus(); }
    if(e.key==='Home'){ e.preventDefault(); btnRefs.current[0]?.focus(); }
    if(e.key==='End'){ e.preventDefault(); btnRefs.current[links.length-1]?.focus(); }
  };
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <strong className={styles.brand}>prxdby4le</strong>
      <div className={styles.linksWrap} ref={wrapRef}>
        <span className={styles.slider} ref={sliderRef} aria-hidden="true" />
        {links.map((l,i)=> {
          const active = current===l.id;
          return (
            <button
              key={l.id}
              ref={el=> btnRefs.current[i]=el}
              onKeyDown={e=> onKey(e,i)}
              onClick={()=>onNavigate(l.id)}
              className={`${styles.link} ${active ? styles.linkActive : ''}`}
              aria-current={active ? 'page':undefined}
            >
              {l.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginLeft:'auto' }}>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default NavBar;

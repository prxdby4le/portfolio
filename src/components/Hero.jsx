import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import AnimatedEntry, { StaggeredChildren } from './AnimatedEntry.jsx';
import EnhancedCard from './EnhancedCard.jsx';
import { useBreakpoint } from '../hooks/useResponsive.js';
import OptimizedImage from './OptimizedImage.jsx';

function Card({ title, img, onClick }) {
  return (
    <div onClick={onClick} className={styles.cardContent}>
      <div className={styles.cardImgWrap}>
  <OptimizedImage src={img} alt={title} style={{ maxHeight: 90 }} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>Clique para explorar</p>
    </div>
  );
}

export function Hero({ onEnter }) {
  const { isMobile } = useBreakpoint();
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(()=>{
    const handle = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if(headingRef.current){
        headingRef.current.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
      if(gridRef.current){
        gridRef.current.style.transform = `translateY(${scrollY * -0.05}px)`;
      }
    };
    window.addEventListener('scroll', handle, { passive:true });
    return ()=> window.removeEventListener('scroll', handle);
  },[]);

  return (
    <AnimatedEntry animation="fadeUp" delay={0.1}>
      <section className={styles.section}>
        <AnimatedEntry animation="scale" delay={0.3}>
          <h2 ref={headingRef} style={{ fontSize: isMobile ? '1.9rem' : '2.4rem', marginBottom: '1.2rem', willChange:'transform' }}>
            Escolha o que quer ver
          </h2>
        </AnimatedEntry>
        <div ref={gridRef} className={styles.grid} style={{ willChange:'transform' }}>
          <StaggeredChildren staggerDelay={0.2} animation="fadeUp">
            <EnhancedCard hover3D glow tilt className={styles.cardWrapper}>
              <Card title="Produção Musical" img="assets/images/flsudio.png" onClick={() => onEnter('music')} />
            </EnhancedCard>
            <EnhancedCard hover3D glow tilt className={styles.cardWrapper}>
              <Card title="Visualizers" img="assets/images/aftereffects.png" onClick={() => onEnter('visual')} />
            </EnhancedCard>
          </StaggeredChildren>
        </div>
      </section>
    </AnimatedEntry>
  );
}

export default Hero;
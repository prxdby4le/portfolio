import React, { useState, useEffect } from 'react';
import styles from './VisualSection.module.css';
import AnimatedEntry from './AnimatedEntry.jsx';
import EnhancedCard from './EnhancedCard.jsx';
import { CardSkeleton } from './LoadingStates.jsx';
import { useBreakpoint } from '../hooks/useResponsive.js';
import OptimizedImage from './OptimizedImage.jsx';

export function VisualSection(){
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useBreakpoint();
  
  const items = [
    { img: 'assets/images/hyper_aesthetic_cover.jpg', title: 'Particle Flow', desc: 'Sistema de partículas reativo ao áudio', tags:['WebGL','Audio Reactive'] },
    { img: 'assets/images/synthwave_cover.jpg', title: 'Geometric Waves', desc: 'Formas geométricas em movimento fluido', tags:['Three.js','Animation'] },
    { img: 'assets/images/dnb_cover.jpg', title: 'Spectrum Analyzer', desc: 'Visualização em tempo real do espectro sonoro', tags:['Canvas','Real-time'] },
    { img: 'assets/images/boombao_cover.JPG', title: 'Fluid Dynamics', desc: 'Simulação de fluidos com interação do usuário', tags:['Shader','Interactive'] },
  ];
  
  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.section}>
  {/* delay prop expects seconds, not ms */}
  <AnimatedEntry animation="slideInFromRight" delay={0.2}>
        <h2 style={{
          margin:'0 0 1.5rem',
          fontSize: isMobile ? '1.8rem' : '2.4rem',
          textAlign: 'center'
        }}>
          Visualizers
        </h2>
      </AnimatedEntry>
      
      <div className={styles.grid}>
        {isLoading ? (
          // Show loading skeletons
          Array.from({ length: 4 }, (_, i) => (
            <CardSkeleton key={i} showImage />
          ))
        ) : (
          items.map((it, i) => (
            <AnimatedEntry 
              key={i} 
              animation="fadeUp" 
              delay={0.4 + i * 0.15}
            >
              <EnhancedCard 
                className={styles.visualCard}
                hoverScale={1.03}
                glowIntensity={0.4}
              >
                <div className={styles.imgWrap}>
                  <OptimizedImage src={it.img} alt={it.title} className={styles.img} />
                </div>
                <div className={styles.meta}>
                  <strong className={styles.visualTitle}>{it.title}</strong>
                  <p className={styles.desc}>{it.desc}</p>
                  <div className={styles.tags}>
                    {it.tags.map(t => 
                      <span key={t} className={styles.tag}>{t}</span>
                    )}
                  </div>
                </div>
              </EnhancedCard>
            </AnimatedEntry>
          ))
        )}
      </div>
    </section>
  );
}

export default VisualSection;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext.jsx';
import styles from './MusicSection.module.css';
import AnimatedEntry from './AnimatedEntry.jsx';
import EnhancedCard from './EnhancedCard.jsx';
import { CardSkeleton } from './LoadingStates.jsx';
import { useBreakpoint } from '../hooks/useResponsive.js';

export function MusicSection() {
  const { playlists, openPlaylist } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useBreakpoint();
  // Memoize playlist names to avoid new array each render (prevents duplicate logs)
  const names = useMemo(() => Object.keys(playlists), [playlists]);
  const hasData = names.length > 0;

  // debug logs
  const loggedRef = useRef(false);
  useEffect(()=>{
    if(!isLoading && !loggedRef.current){
      loggedRef.current = true;
      console.log('[MusicSection] playlists keys:', names);
      console.log('[MusicSection] playlists object:', playlists);
    }
  },[isLoading, names]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

    return (
    <section className={styles.section}>
  {/* delay expects seconds; was incorrectly using ms (200) -> 0.2s */}
  <AnimatedEntry animation="slideInFromLeft" delay={0.2}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: isMobile ? '1.8rem' : '2.4rem', textAlign: 'center' }}>Produção Musical</h2>
      </AnimatedEntry>
        <div className={styles.grid} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gridAutoRows:'1fr', gap:'clamp(1.2rem,2vw,1.9rem)' }}>
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
        ) : (
          hasData ? names.map((name, idx) => {
            const p = playlists[name];
              const bentoStyle = idx < 3 ? {
                gridColumn: idx === 0 ? 'span 2' : undefined,
                gridRow: idx === 0 ? 'span 2' : undefined,
                minHeight: idx === 0 ? '100%' : undefined,
                display: 'flex'
              } : {};
              return (
                // 300ms -> .3s; +100ms each card
                <AnimatedEntry key={name} animation="fadeUp" delay={0.3 + idx * 0.1}>
                  <EnhancedCard
                    onClick={() => openPlaylist(name)}
                    className={styles.playlistCard}
                    hoverScale={1.05}
                    glowIntensity={0.3}
                    style={bentoStyle}
                  >
                    <div className={styles.thumb}>♫</div>
                    <strong className={styles.playlistName}>{name}</strong>
                    <div className={styles.count}>{p.tracks.length} faixas</div>
                  </EnhancedCard>
                </AnimatedEntry>
              );
          }) : (
            <div style={{ gridColumn:'1 / -1', textAlign:'center', padding:'3rem 1rem', opacity:.7, fontSize:'.85rem' }}>
              Nenhuma playlist disponível.
              <pre style={{ marginTop:'1rem', background:'rgba(255,255,255,0.05)', padding:'1rem', borderRadius:12, textAlign:'left', overflow:'auto', fontSize:'.6rem' }}>
{JSON.stringify(playlists, null, 2)}
              </pre>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default MusicSection;
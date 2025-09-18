import React, { useRef } from 'react';
import styles from './EnhancedCard.module.css';

function EnhancedCard({
  children,
  className = '',
  hoverScale = 1.03,
  glow = true,
  hover3D = true,
  tilt = true,
  glowIntensity = 0.25,
  onClick
}) {
  const ref = useRef(null);

  const handleMouseMove = e => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -12; // tilt X
    const ry = ((x / rect.width) - 0.5) * 12;   // tilt Y
    ref.current.style.setProperty('--tiltX', `${rx}deg`);
    ref.current.style.setProperty('--tiltY', `${ry}deg`);
    if (glow) {
      ref.current.style.setProperty('--glowX', `${(x / rect.width) * 100}%`);
      ref.current.style.setProperty('--glowY', `${(y / rect.height) * 100}%`);
    }
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--tiltX', '0deg');
    ref.current.style.setProperty('--tiltY', '0deg');
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={`${styles.card} ${className}`}
      style={{
        '--hover-scale': hoverScale,
        '--glow-opacity': glow ? glowIntensity : 0
      }}
    >
      <div className={styles.inner}>{children}</div>
      {glow && <div className={styles.glow} />}
    </div>
  );
}

export default EnhancedCard;
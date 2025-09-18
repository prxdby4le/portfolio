import React, { useRef, useEffect, useState, cloneElement } from 'react';
import styles from './AnimatedEntry.module.css';

const animations = {
  fadeUp: { initial: { opacity: 0, transform: 'translateY(25px)' }, final: { opacity: 1, transform: 'translateY(0)' } },
  fadeDown: { initial: { opacity: 0, transform: 'translateY(-25px)' }, final: { opacity: 1, transform: 'translateY(0)' } },
  fadeIn: { initial: { opacity: 0 }, final: { opacity: 1 } },
  scale: { initial: { opacity: 0, transform: 'scale(.9)' }, final: { opacity: 1, transform: 'scale(1)' } },
  slideInFromLeft: { initial: { opacity: 0, transform: 'translateX(-40px)' }, final: { opacity: 1, transform: 'translateX(0)' } },
  slideInFromRight: { initial: { opacity: 0, transform: 'translateX(40px)' }, final: { opacity: 1, transform: 'translateX(0)' } }
};

function AnimatedEntry({
  children,
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.2,
  once = true,
  style,
  className = ''
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const config = animations[animation] || animations.fadeUp;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // If someone passes a large number (likely ms), auto-convert >10 to seconds.
  const safeDelay = typeof delay === 'number' && delay > 10 ? delay / 1000 : delay;
  const combinedStyle = {
    transition: 'all .7s cubic-bezier(.4,0,.2,1)',
    transitionDelay: typeof safeDelay === 'number' ? `${safeDelay}s` : safeDelay,
    willChange: 'transform, opacity',
    ...(visible ? config.final : config.initial),
    ...style
  };

  return (
    <div ref={ref} style={combinedStyle} className={`${styles.wrapper} ${className}`}>
      {children}
    </div>
  );
}

export function StaggeredChildren({ children, staggerDelay = 0.15, animation = 'fadeUp', startDelay = 0 }) {
  const items = React.Children.toArray(children);
  return items.map((child, i) => (
    <AnimatedEntry key={child.key || i} animation={animation} delay={startDelay + i * staggerDelay}>
      {child}
    </AnimatedEntry>
  ));
}

export default AnimatedEntry;
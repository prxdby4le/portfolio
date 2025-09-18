import React, { useEffect, useRef } from 'react';

// direction: 1 (forward/right) new page slides from right; -1 from left
export default function PageTransition({ children, direction = 1, duration = 520 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { transform: `translateX(${direction * 42}px)`, opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      { duration, easing: 'cubic-bezier(.65,.05,.36,1)' }
    );
  }, [children, direction, duration]);
  return <div ref={ref} style={{ position: 'relative', willChange: 'transform,opacity' }}>{children}</div>;
}
import { useRef } from "react";

/**
 * Click-and-drag horizontal scrolling for the genre rails.
 *
 * Pointer-only by design: touch already has momentum scrolling that is better
 * than anything reimplemented here, so touch events fall straight through.
 *
 * Guards a real problem with this pattern: after dragging across a rail, the
 * pointer lands on a card and fires a click, which would navigate you to a
 * track you never meant to open. `onClickCapture` swallows that click when the
 * pointer actually travelled.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const stop = () => {
    const el = ref.current;
    drag.current.active = false;
    if (el) delete el.dataset.dragging;
  };

  return {
    ref,
    dragProps: {
      onPointerDown: (e: React.PointerEvent<T>) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        const el = ref.current;
        if (!el) return;
        drag.current = {
          active: true,
          startX: e.clientX,
          startLeft: el.scrollLeft,
          moved: 0,
        };
        el.dataset.dragging = "true";
      },

      onPointerMove: (e: React.PointerEvent<T>) => {
        const el = ref.current;
        if (!el || !drag.current.active) return;
        const dx = e.clientX - drag.current.startX;
        drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
        el.scrollLeft = drag.current.startLeft - dx;
      },

      onPointerUp: stop,
      onPointerLeave: stop,
      onPointerCancel: stop,

      onClickCapture: (e: React.MouseEvent<T>) => {
        if (drag.current.moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
        drag.current.moved = 0;
      },
    },
  };
}

import { useRef, useCallback } from 'react';

export function useSwipeDown(onClose, threshold = 100) {
  const startY  = useRef(null);
  const sheetEl = useRef(null);

  const onTouchStart = useCallback(e => {
    startY.current = e.touches[0].clientY;
    if (sheetEl.current) sheetEl.current.style.transition = 'none';
  }, []);

  const onTouchMove = useCallback(e => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy < 0) return; // don't allow dragging up
    if (sheetEl.current) sheetEl.current.style.transform = `translateY(${dy}px)`;
  }, []);

  const onTouchEnd = useCallback(e => {
    if (startY.current === null) return;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (sheetEl.current) {
      sheetEl.current.style.transition = 'transform 280ms cubic-bezier(0.32,0.72,0,1)';
      sheetEl.current.style.transform  = 'translateY(0)';
    }
    if (dy >= threshold) onClose();
    startY.current = null;
  }, [onClose, threshold]);

  return { sheetEl, onTouchStart, onTouchMove, onTouchEnd };
}

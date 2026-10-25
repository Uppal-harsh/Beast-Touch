'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Observe native page scrolling; never cancel wheel, touch, or keyboard events. */
export function useScrollProgress(target: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = target.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, element.offsetHeight - window.innerHeight);
      const next = Math.max(0, Math.min(1, (window.scrollY - top) / distance));
      setProgress(previous => Math.abs(previous - next) < 0.0002 ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    if (target.current) resize.observe(target.current);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [target]);
  return progress;
}

import { useEffect, useRef } from 'react';

/**
 * useMouseParallax:
 * Adds subtle, butter-smooth mouse-based parallax strictly on desktop devices
 * with fine pointers. Completely bypassed on touch/mobile devices or when prefers-reduced-motion is active.
 * @param {number} strength - Maximum pixel displacement (e.g. 4 to 8px)
 */
export default function useMouseParallax(strength = 5) {
  const ref = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      targetX = x * strength;
      targetY = y * strength;

      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (el) {
        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return ref;
}

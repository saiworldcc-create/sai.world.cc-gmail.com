import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp: Smoothly animates a number from 0 to target when entering viewport.
 * @param {number} target - The number to count up to (e.g. 195, 10000, 15)
 * @param {number} duration - Duration in milliseconds (default 1600ms)
 * @param {string} suffix - Optional suffix like '+' or '%'
 */
export default function useCountUp(target = 100, duration = 1600, suffix = '') {
  const [count, setCount] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // If reduced motion is requested, immediately show final value
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun) {
        setHasRun(true);
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Smooth exponential easeOut curve
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(Math.floor(easeOut * target));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(target);
          }
        };
        window.requestAnimationFrame(step);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasRun]);

  return { ref: elementRef, value: `${count.toLocaleString()}${suffix}` };
}

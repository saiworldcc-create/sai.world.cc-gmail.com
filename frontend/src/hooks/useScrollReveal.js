import { useEffect, useRef } from 'react';

/**
 * useScrollReveal:
 * Attaches an IntersectionObserver to the given container ref.
 * Automatically observes the container and any child elements matching
 * '.reveal-init', '.reveal-child', or '.stagger-item', adding 'reveal-visible'
 * once they enter the viewport.
 */
export default function useScrollReveal(options = {}) {
  const containerRef = useRef(null);
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px', once = true } = options;

  useEffect(() => {
    // If reduced motion is requested, immediately reveal all elements
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll('.reveal-init, .reveal-child, .reveal-up, .stagger-item');
    const allElements = [container, ...targets];

    if (prefersReducedMotion) {
      allElements.forEach(el => {
        el.classList.add('reveal-visible', 'active');
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible', 'active');
          if (once) {
            obs.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('reveal-visible', 'active');
        }
      });
    }, { threshold, rootMargin });

    // If container itself has a reveal class, observe it
    if (container.classList.contains('reveal-init') || container.classList.contains('reveal-up')) {
      observer.observe(container);
    }

    // Observe all annotated children
    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return containerRef;
}

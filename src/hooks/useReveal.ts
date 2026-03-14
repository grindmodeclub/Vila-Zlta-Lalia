import { useEffect, useRef } from 'react';

export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold }
    );

    const elements = el.querySelectorAll('.reveal');
    elements.forEach((child) => observer.observe(child));

    if (el.classList.contains('reveal')) observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

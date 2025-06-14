import { useEffect, useState, RefObject } from 'react';

export function useTruncationObserver(refs: RefObject<HTMLElement>[]): boolean[] {
  const [truncated, setTruncated] = useState<boolean[]>(
    refs.map(() => false)
  );

  useEffect(() => {
    let active = true;
    const updateTruncation = () => {
      const states = refs.map(ref => {
        const el = ref.current;
        if (!el) return false;
        return Math.floor(el.scrollWidth) > Math.floor(el.clientWidth);
      });
      if (
        active &&
        (states.length !== truncated.length ||
          states.some((val, i) => val !== truncated[i]))
      ) {
        setTruncated(states);
      }
    };

    updateTruncation();

    const observers = refs.map(ref =>
      ref.current
        ? new ResizeObserver(updateTruncation)
        : null
    );

    refs.forEach((ref, idx) => {
      if (ref.current && observers[idx]) {
        observers[idx]!.observe(ref.current);
      }
    });

    window.addEventListener('resize', updateTruncation);

    return () => {
      active = false; // Corregido!
      observers.forEach(obs => obs?.disconnect());
      window.removeEventListener('resize', updateTruncation);
    };
  }, refs.map(ref => ref.current)); // Corregido!

  return truncated;
}

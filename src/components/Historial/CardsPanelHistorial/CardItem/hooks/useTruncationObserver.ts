import { useEffect, useState, RefObject } from 'react';

type RefMap = {
  [key: string]: RefObject<HTMLElement>;
};

export function useTruncationObserver(refs: RefMap): { [key: string]: boolean } {
  const [states, setStates] = useState(() => {
    const initial: Record<string, boolean> = {};
    for (const key in refs) {
      initial[key] = false;
    }
    return initial;
  });

  useEffect(() => {
    let mounted = true;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (!mounted) return;
          const updated: Record<string, boolean> = {};

          for (const key in refs) {
            const el = refs[key].current;
            if (el) {
              try {
                updated[key] = Math.floor(el.scrollWidth) > Math.floor(el.clientWidth);
              } catch (error) {
                console.warn(`Error al evaluar truncamiento de ${key}:`, error);
                updated[key] = false;
              }
            }
          }

          setStates((prev) => ({ ...prev, ...updated }));
        }, 0);
      });
    });

    for (const key in refs) {
      const el = refs[key].current;
      if (el) observer.observe(el);
    }

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [Object.values(refs)]);

  return states;
}

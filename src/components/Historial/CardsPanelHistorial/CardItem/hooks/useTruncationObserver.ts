import { useEffect, useState, RefObject, useRef } from 'react';

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

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        const updated: Record<string, boolean> = {};
        let hasChanges = false;

        for (const key in refs) {
          const el = refs[key].current;
          if (el) {
            try {
              const isTruncated = Math.floor(el.scrollWidth) > Math.floor(el.clientWidth);
              updated[key] = isTruncated;
              if (states[key] !== isTruncated) {
                hasChanges = true;
              }
            } catch (error) {
              console.warn(`Error al evaluar truncamiento de ${key}:`, error);
              updated[key] = false;
            }
          }
        }

        if (hasChanges && mountedRef.current) {
          setStates(prev => ({ ...prev, ...updated }));
        }
      });
    });

    for (const key in refs) {
      const el = refs[key].current;
      if (el) observer.observe(el);
    }

    return () => {
      mountedRef.current = false;
      observer.disconnect();
    };
  }, [Object.values(refs).join('')]);

  return states;
}

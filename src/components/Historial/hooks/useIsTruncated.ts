import { useState, useEffect, RefObject } from 'react';

export function useIsTruncated(ref: RefObject<HTMLElement>): boolean {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (el) setIsTruncated(el.scrollWidth > el.clientWidth);
    };

    check();
    window.addEventListener('resize', check);

    return () => {
      window.removeEventListener('resize', check);
    };
  }, [ref]);

  return isTruncated;
}

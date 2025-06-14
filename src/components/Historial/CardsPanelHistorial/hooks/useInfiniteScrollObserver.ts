import { useEffect } from 'react';

type InfiniteScrollOptions = {
  root: HTMLElement | null;
  target: HTMLElement | null;
  enabled: boolean;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
};

export function useInfiniteScrollObserver({
  root,
  target,
  enabled,
  onIntersect,
  threshold = 0.01,
  rootMargin = '0px',
}: InfiniteScrollOptions) {
  useEffect(() => {
    if (!enabled || !root || !target) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            onIntersect();
          }
        });
      },
      { root, threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [root, target, enabled, onIntersect, threshold, rootMargin]);
}
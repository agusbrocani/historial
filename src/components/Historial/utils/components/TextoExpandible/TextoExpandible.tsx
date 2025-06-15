import React, { useRef, useState, useEffect, memo } from 'react';
import styles from './TextoExpandible.module.scss';

export type TextoExpandibleProps = {
  texto: string;
  color: string;
  lines?: number;
};

const TextoExpandible: React.FC<TextoExpandibleProps> = ({
  texto,
  color,
  lines = 3,
}) => {
  const [expanded, setExpanded]       = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let mounted = true;
    const update = () => {
      if (!mounted || !pRef.current) return;
      if (!expanded) {
        const el = pRef.current;
        setOverflowing(el.scrollHeight > el.clientHeight + 1);
      }
    };
    update();
    const obs = new ResizeObserver(() =>
      window.requestAnimationFrame(update)
    );
    obs.observe(pRef.current!);
    const onResize = () => window.requestAnimationFrame(update);
    window.addEventListener('resize', onResize);
    return () => {
      mounted = false;
      obs.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [texto, lines, expanded]);

  const handleClick = () => {
    setExpanded((prev) => {
      const next = !prev;
      // si colapsamos, scrollear al párrafo
      if (prev && pRef.current) {
        pRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <p
        ref={pRef}
        className={
          expanded ? styles.textoExpanded : styles.textoTruncado
        }
        style={!expanded ? { WebkitLineClamp: lines } : undefined}
      >
        {texto}
      </p>
      {(overflowing || expanded) && (
        <button
          className={styles.toggleBtn}
          onClick={handleClick}
          aria-expanded={expanded}
          style={{ color }}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
};

export default memo(TextoExpandible);

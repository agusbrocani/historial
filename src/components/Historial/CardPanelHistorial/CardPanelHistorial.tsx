import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Icon, TooltipHost } from '@fluentui/react';
import styles from './CardPanelHistorial.module.scss';

import { IHistorialItem } from '../../HistorialPanel';

type CardPanelHistorialProps<T extends IHistorialItem> = {
  items: T[];                               // Lista completa de items (p. ej. 166)
  batchSize?: number;                       // Tamaño del lote (por defecto 50)
  onLoadMore?: (nextBatchStart: number) => void; // Callback opcional cuando se carga otro lote
};

function CardPanelHistorial<T extends IHistorialItem>({
  items,
  batchSize = 50,
  onLoadMore,
}: CardPanelHistorialProps<T>) {
  const [loadedCount, setLoadedCount] = useState(() =>
    Math.min(batchSize, items.length)
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = items.slice(0, loadedCount);

  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          if (loadedCount < items.length) {
            const nextCount = Math.min(loadedCount + batchSize, items.length);
            setLoadedCount(nextCount);
            if (onLoadMore) {
              onLoadMore(loadedCount);
            }
          }
        }
      });
    },
    [batchSize, items.length, loadedCount, onLoadMore]
  );

  useEffect(() => {
    const node = lastCardRef.current;
    const rootNode = containerRef.current;

    if (!node || !rootNode || loadedCount >= items.length) {
      return;
    }

    const options: IntersectionObserverInit = {
      root: rootNode,
      rootMargin: '0px',
      threshold: 0.01,
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, loadedCount, items.length]);

  return (
    <div className={styles.container} ref={containerRef}>
      {visibleItems.map((item, index) => {
        const globalIndex = index;
        const isLast = index === visibleItems.length - 1;

        return (
          <div key={globalIndex} ref={isLast ? lastCardRef : null}>
            <CardHistorialItem
              item={item}
              index={globalIndex}
              total={items.length}
            />
          </div>
        );
      })}
    </div>
  );
}

type CardHistorialItemProps<T extends IHistorialItem> = {
  item: T;
  index: number;
  total: number;
};

function CardHistorialItem<T extends IHistorialItem>({
  item,
  index,
  total,
}: CardHistorialItemProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const observacionRef = useRef<HTMLParagraphElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasInteracted = useRef(false); // <- nuevo

  const checkOverflow = useCallback(() => {
    const el = observacionRef.current;
    if (!el) {
      setShouldShowButton(false);
      return;
    }
    setShouldShowButton(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    checkOverflow();

    const ro = new ResizeObserver(() => {
      checkOverflow();
    });
    if (observacionRef.current) {
      ro.observe(observacionRef.current);
    }

    return () => {
      ro.disconnect();
    };
  }, [checkOverflow, item.observacion]);

  useEffect(() => {
    if (!expanded && hasInteracted.current && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [expanded]);

  const toggleExpand = (value: boolean) => {
    hasInteracted.current = true;
    setExpanded(value);
  };

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.estados}>
        <span>{item.estadoAnterior}</span>
        <Icon iconName="Forward" className={styles.iconoEstado} />
        <span>{item.estadoPosterior}</span>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.iconoCalendario}>
          <Icon iconName="Calendar" />
        </div>
        <span className={styles.texto}>{`${item.fecha} a las ${item.hora} hs.`}</span>

        <div className={styles.avatar}>
          {(item.usuario[0] + item.usuario.split('.')[1]?.[0] || '').toUpperCase()}
        </div>
        <TooltipHost
          content={item.usuario}
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block' } }}
        >
          <span className={styles.texto}>{item.usuario}</span>
        </TooltipHost>
      </div>

      <div>
        <p
          ref={observacionRef}
          className={expanded ? styles.observacionExpanded : styles.observacion}
          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        >
          {item.observacion}
        </p>
        {!expanded && shouldShowButton && (
          <button className={styles.verMasBtn} onClick={() => toggleExpand(true)}>
            Ver más
          </button>
        )}
        {expanded && (
          <button className={styles.verMasBtn} onClick={() => toggleExpand(false)}>
            Ver menos
          </button>
        )}
      </div>

      <TooltipHost
        content={`Cambio ${index + 1} de ${total}`}
        calloutProps={{ gapSpace: 0 }}
        styles={{ root: { display: 'block', width: '100%' } }}
      >
        <span className={styles.indice}>{`Cambio ${index + 1} de ${total}`}</span>
      </TooltipHost>
    </div>
  );
}

export default CardPanelHistorial;

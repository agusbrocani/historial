import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Panel,
  PanelType,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import styles from './PanelHistorial.module.scss';
import CardList from '../CardsPanelHistorial/CardList/CardList';
import { IHistorialItem } from '../../HistorialPanel';

type PanelHistorialProps<T extends IHistorialItem> = {
  items: T[];
  textoEncabezadoHistorial: string;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
};

function PanelHistorial<T extends IHistorialItem>({
  items,
  textoEncabezadoHistorial,
  isPanelOpen,
  setIsPanelOpen,
  onClose,
}: PanelHistorialProps<T>) {
  const scrollableContentRef = useRef<HTMLDivElement | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const batchSize = 10;
  const [loadedCount, setLoadedCount] = useState(() =>
    Math.min(batchSize, items.length)
  );

  useEffect(() => {
    if (isPanelOpen) {
      setLoadedCount(Math.min(batchSize, items.length));
    }
  }, [isPanelOpen, items.length]);

  const visibleItems = items.slice(0, loadedCount);

  const handleDismiss = () => {
    setIsPanelOpen(false);
    onClose?.();
  };

  const handleCollapseRequest = useCallback((cardRef: HTMLDivElement | null) => {
    if (cardRef && scrollableContentRef.current?.contains(cardRef)) {
      cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          if (loadedCount < items.length) {
            const nextCount = Math.min(loadedCount + batchSize, items.length);
            setLoadedCount(nextCount);
          }
        }
      });
    },
    [batchSize, items.length, loadedCount]
  );

  useEffect(() => {
    if (!isPanelOpen) return;

    const observer = new MutationObserver(() => {
      const real = document.querySelector(
        '.ms-Panel-main .ms-Panel-scrollableContent'
      ) as HTMLDivElement | null;
      if (real) {
        scrollableContentRef.current = real;
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isPanelOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const node = lastCardRef.current;
      const rootNode = scrollableContentRef.current;

      if (!node || !rootNode || loadedCount >= items.length) return;

      const observer = new IntersectionObserver(handleIntersect, {
        root: rootNode,
        rootMargin: '0px',
        threshold: 0.01,
      });

      observer.observe(node);

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [handleIntersect, loadedCount, visibleItems]);

  return (
    <Panel
      className={styles.historialPanel}
      headerText={textoEncabezadoHistorial}
      closeButtonAriaLabel='Cerrar'
      isOpen={isPanelOpen}
      onDismiss={handleDismiss}
      isLightDismiss={true}
      type={PanelType.customNear}
      styles={{
        main: { width: '440px', left: 0, right: 'unset' },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          paddingRight: 0,
          overflow: 'hidden'
        },
        scrollableContent: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          paddingRight: 18
        },
        closeButton: { paddingRight: 0, paddingLeft: 0, marginRight: 0 }
      }}
    >
      {items.length === 0 ? (
        <div className={styles.spinnerContainer}>
          <Spinner
            label='Espere por favor...'
            size={SpinnerSize.large}
            styles={{ label: { color: '#0078d4' } }}
          />
        </div>
      ) : (
        <CardList
          items={visibleItems}
          totalItems={items.length}
          onCollapseRequest={handleCollapseRequest}
          lastCardRef={lastCardRef}
        />
      )}
    </Panel>
  );
}

export default PanelHistorial;

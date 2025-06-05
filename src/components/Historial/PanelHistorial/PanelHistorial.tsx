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
          console.log("🔥 VISTA:", entry.target);
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

  // Capturar el contenedor real del scroll del panel (Fluent UI)
  useEffect(() => {
    const id = setInterval(() => {
      const real = document.querySelector('.ms-Panel-main .ms-Panel-scrollableContent') as HTMLDivElement | null;
      if (real) {
        console.log("🎯 Contenedor real detectado");
        scrollableContentRef.current = real;
        clearInterval(id);
      }
    }, 50);

    return () => clearInterval(id);
  }, [isPanelOpen]);

  // Inicializar IntersectionObserver luego de que el DOM esté completamente montado
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const node = lastCardRef.current;
      const rootNode = scrollableContentRef.current;

      console.log("👁 Observando nodo:", node);
      console.log("📦 Scroll root:", rootNode);

      if (!node || !rootNode || loadedCount >= items.length) return;

      const observer = new IntersectionObserver(handleIntersect, {
        root: rootNode,
        rootMargin: '0px',
        threshold: 0.01,
      });

      observer.observe(node);
    }, 100); // Espera breve para garantizar que el DOM esté montado

    return () => clearTimeout(timeoutId);
  }, [handleIntersect, visibleItems, loadedCount]);

  return (
    <Panel
      headerText={textoEncabezadoHistorial}
      closeButtonAriaLabel="Cerrar"
      isOpen={isPanelOpen}
      onDismiss={handleDismiss}
      isLightDismiss={true}
      type={PanelType.customNear}
      styles={{
        main: {
          width: '340px',
          left: 0,
          right: 'unset',
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        },
        scrollableContent: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {items.length === 0 ? (
        <div className={styles.spinnerContainer}>
          <Spinner
            label="Espere por favor..."
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

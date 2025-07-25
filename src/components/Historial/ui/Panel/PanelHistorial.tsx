import { 
  useState, 
  useRef, 
  useEffect, 
  useCallback 
} from 'react';
import {
  Panel,
  PanelType,
  Spinner,
  SpinnerSize,
  Icon,
  IconButton,
} from '@fluentui/react';
import styles from './PanelHistorial.module.scss';
import CardList from './CardList/CardList';
import { IHistorialItem } from '../../IHistorialItem';

type PanelHistorialProps = {
  items: IHistorialItem[];
  batchSize: number;
  colorGeneral: string;
  colorAvatar: string;
  ordenNumeracionCardsDesc: boolean;
  isLoading: boolean;
  textoEncabezado: string;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timeoutExceeded: boolean;
  onClose?: () => void;
};

function PanelHistorial({
  items,
  batchSize,
  colorGeneral,
  colorAvatar,
  ordenNumeracionCardsDesc,
  isLoading,
  textoEncabezado,
  isPanelOpen,
  setIsPanelOpen,
  timeoutExceeded = false,
  onClose
}: PanelHistorialProps) {
  const scrollableContentRef = useRef<HTMLDivElement | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);

  // visibleItems: items visibles segun el paginado por batchSize
  const visibleItems = items.slice(0, loadedCount);

  const handleDismiss = () => {
    setIsPanelOpen(false);
    onClose?.();
  };

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

  // Espera activa hasta que scrollableContent esté disponible usando observer como fallback
  useEffect(() => {
    if (!isPanelOpen) return;

    const observer = new MutationObserver(() => {
      const scrollContainer = document.querySelector(
        '.ms-Panel-main .ms-Panel-scrollableContent'
      ) as HTMLDivElement | null;

      if (scrollContainer) {
        scrollableContentRef.current = scrollContainer;
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isPanelOpen]);

  // Observa el ultimo nodo visible para paginado infinito
  useEffect(() => {
    if (!scrollableContentRef.current) return;
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
  }, [handleIntersect, loadedCount, visibleItems]);

  useEffect(() => {
    if (isPanelOpen) {
      setLoadedCount(Math.min(batchSize, items.length));
    }
  }, [isPanelOpen, items.length]);

  return (
    <Panel
      className={styles.historialPanel}
      isOpen={isPanelOpen}
      onDismiss={handleDismiss}
      isLightDismiss={true}
      type={PanelType.customNear}
      hasCloseButton={false}
      onRenderNavigation={() => (
        <div
          className={styles.miEncabezadoPersonalizado}
          style={{ backgroundColor: colorGeneral }}
        >
          <Icon
            iconName='Clock'
            styles={{
              root: {
                fontSize: 28,
                color: '#ffffff',
                marginRight: 10,
                lineHeight: '32px',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 3,
              },
            }}
          />
          <span className={styles.tituloEncabezado}>
            {textoEncabezado}
          </span>
          <IconButton
            iconProps={{
              iconName: 'Cancel',
              styles: { root: { color: '#ffffff', fontSize: 18 } },
            }}
            ariaLabel='Cerrar'
            onClick={handleDismiss}
            styles={{
              root: {
                marginLeft: 'auto',
                color: '#ffffff',
                backgroundColor: 'transparent',
              },
              rootHovered: {
                backgroundColor: '#ffffff',
              },
              icon: { fontSize: 18 },
              iconHovered: { color: colorGeneral },
            }}
          />
        </div>
      )}
      styles={{
        main: { width: '440px', left: 0, right: 'unset' },
        navigation: {
          display: 'flex',
          alignItems: 'center',
          paddingTop: 14,
          paddingBottom: 6,
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          paddingRight: 0,
          overflow: 'hidden',
        },
        scrollableContent: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        },
        closeButton: { display: 'none' },
      }}
    >
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner
            label='Cargando historial...'
            size={SpinnerSize.large}
            styles={{
              label: {
                color: colorGeneral,
              },
              circle: {
                borderTopColor: colorGeneral,
              },
            }}
          />
        </div>
      ) : timeoutExceeded ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.estadoCentrado}>
            <Icon iconName='Warning' className={styles.errorIcono} style={{ color: colorGeneral }} />
            <span className={styles.errorTexto} style={{ color: colorGeneral }}>
              No se pudo obtener el historial.
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            flex: '1 1 auto',
          }}
        >
          <div style={{ height: 16, flexShrink: 0 }} />
          <CardList
            items={visibleItems}
            colorGeneral={colorGeneral}
            colorAvatar={colorAvatar}
            totalItems={items.length}
            ordenNumeracionCardsDesc={ordenNumeracionCardsDesc}
            lastCardRef={lastCardRef}
          />
        </div>
      )}
    </Panel>
  );
}

export default PanelHistorial;

// import { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Panel,
//   PanelType,
//   Spinner,
//   SpinnerSize,
// } from '@fluentui/react';
// import styles from './PanelHistorial.module.scss';
// import CardList from '../CardsPanelHistorial/CardList/CardList';
// import { IHistorialItem } from '../../HistorialPanel';

// type PanelHistorialProps<T extends IHistorialItem> = {
//   items: T[];
//   isLoading: boolean;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   textoEncabezadoHistorial: string;
//   isPanelOpen: boolean;
//   setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onClose?: () => void;
// };

// function PanelHistorial<T extends IHistorialItem>({
//   items,
//   isLoading,
//   setIsLoading,
//   textoEncabezadoHistorial,
//   isPanelOpen,
//   setIsPanelOpen,
//   onClose,
// }: PanelHistorialProps<T>) {
//   const scrollableContentRef = useRef<HTMLDivElement | null>(null);
//   const lastCardRef = useRef<HTMLDivElement | null>(null);

//   const batchSize = 10;
//   const [loadedCount, setLoadedCount] = useState(() =>
//     Math.min(batchSize, items.length)
//   );

//   useEffect(() => {
//     if (isPanelOpen) {
//       setLoadedCount(Math.min(batchSize, items.length));
//     }
//   }, [isPanelOpen, items.length]);

//   const visibleItems = items.slice(0, loadedCount);

//   const handleDismiss = () => {
//     setIsPanelOpen(false);
//     onClose?.();
//   };

//   const handleCollapseRequest = useCallback((cardRef: HTMLDivElement | null) => {
//     if (cardRef && scrollableContentRef.current?.contains(cardRef)) {
//       cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }, []);

//   const handleIntersect: IntersectionObserverCallback = useCallback(
//     (entries, observer) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           observer.unobserve(entry.target);
//           if (loadedCount < items.length) {
//             const nextCount = Math.min(loadedCount + batchSize, items.length);
//             setLoadedCount(nextCount);
//           }
//         }
//       });
//     },
//     [batchSize, items.length, loadedCount]
//   );

//   useEffect(() => {
//     if (!isPanelOpen) return;

//     const observer = new MutationObserver(() => {
//       const real = document.querySelector(
//         '.ms-Panel-main .ms-Panel-scrollableContent'
//       ) as HTMLDivElement | null;
//       if (real) {
//         scrollableContentRef.current = real;
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//     });

//     return () => observer.disconnect();
//   }, [isPanelOpen]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const node = lastCardRef.current;
//       const rootNode = scrollableContentRef.current;

//       if (!node || !rootNode || loadedCount >= items.length) return;

//       const observer = new IntersectionObserver(handleIntersect, {
//         root: rootNode,
//         rootMargin: '0px',
//         threshold: 0.01,
//       });

//       observer.observe(node);

//       return () => observer.disconnect();
//     }, 50);

//     return () => clearTimeout(timeoutId);
//   }, [handleIntersect, loadedCount, visibleItems]);

//   if (0 !== items.length) {
//     setIsLoading(false);
//   }

//   return (
//     <Panel
//       className={styles.historialPanel}
//       headerText={textoEncabezadoHistorial}
//       closeButtonAriaLabel='Cerrar'
//       isOpen={isPanelOpen}
//       onDismiss={handleDismiss}
//       isLightDismiss={true}
//       type={PanelType.customNear}
//       styles={{
//         main: { width: '440px', left: 0, right: 'unset' },

//         // Este bloque es el que sobrescribe el contenedor de título + "X"
//         navigation: {
//           display: 'flex',
//           alignItems: 'center',
//           paddingTop: 12,
//           paddingBottom: 4
//         },

//         content: {
//           display: 'flex',
//           flexDirection: 'column',
//           flexGrow: 1,
//           paddingRight: 0,
//           overflow: 'hidden'
//         },
//         scrollableContent: {
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           overflowY: 'auto'
//         },
//         closeButton: {
//           paddingRight: 0,
//           paddingLeft: 0,
//           marginRight: 10
//         }
//       }}
//     >
//       {isLoading ? (
//         <div className={styles.spinnerContainer}>
//           <Spinner
//             label='Espere por favor...'
//             size={SpinnerSize.large}
//             styles={{ label: { color: '#0078d4' } }}
//           />
//         </div>
//       ) : (
//         <CardList
//           items={visibleItems}
//           totalItems={items.length}
//           onCollapseRequest={handleCollapseRequest}
//           lastCardRef={lastCardRef}
//         />
//       )}
//     </Panel>
//   );
// }

// export default PanelHistorial;


// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Panel,
//   PanelType,
//   Spinner,
//   SpinnerSize,
//   Icon,
//   IconButton,
// } from '@fluentui/react';
// import styles from './PanelHistorial.module.scss';
// import CardList from '../CardsPanelHistorial/CardList/CardList';
// import { IHistorialItem } from '../../HistorialPanel';

// type PanelHistorialProps<T extends IHistorialItem> = {
//   items: T[];
//   isLoading: boolean;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   textoEncabezadoHistorial: string;
//   isPanelOpen: boolean;
//   setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onClose?: () => void;
// };

// function PanelHistorial<T extends IHistorialItem>({
//   items,
//   isLoading,
//   setIsLoading,
//   textoEncabezadoHistorial,
//   isPanelOpen,
//   setIsPanelOpen,
//   onClose,
// }: PanelHistorialProps<T>) {
//   const scrollableContentRef = useRef<HTMLDivElement | null>(null);
//   const lastCardRef = useRef<HTMLDivElement | null>(null);

//   const batchSize = 10;
//   const [loadedCount, setLoadedCount] = useState(() =>
//     Math.min(batchSize, items.length)
//   );

//   useEffect(() => {
//     if (isPanelOpen) {
//       setLoadedCount(Math.min(batchSize, items.length));
//     }
//   }, [isPanelOpen, items.length]);

//   const visibleItems = items.slice(0, loadedCount);

//   const handleDismiss = () => {
//     setIsPanelOpen(false);
//     onClose?.();
//   };

//   const handleCollapseRequest = useCallback((cardRef: HTMLDivElement | null) => {
//     if (cardRef && scrollableContentRef.current?.contains(cardRef)) {
//       cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }, []);

//   const handleIntersect: IntersectionObserverCallback = useCallback(
//     (entries, observer) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           observer.unobserve(entry.target);
//           if (loadedCount < items.length) {
//             const nextCount = Math.min(loadedCount + batchSize, items.length);
//             setLoadedCount(nextCount);
//           }
//         }
//       });
//     },
//     [batchSize, items.length, loadedCount]
//   );

//   useEffect(() => {
//     if (!isPanelOpen) return;

//     const observer = new MutationObserver(() => {
//       const real = document.querySelector(
//         '.ms-Panel-main .ms-Panel-scrollableContent'
//       ) as HTMLDivElement | null;
//       if (real) {
//         scrollableContentRef.current = real;
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//     });

//     return () => observer.disconnect();
//   }, [isPanelOpen]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const node = lastCardRef.current;
//       const rootNode = scrollableContentRef.current;

//       if (!node || !rootNode || loadedCount >= items.length) return;

//       const observer = new IntersectionObserver(handleIntersect, {
//         root: rootNode,
//         rootMargin: '0px',
//         threshold: 0.01,
//       });

//       observer.observe(node);

//       return () => observer.disconnect();
//     }, 50);

//     return () => clearTimeout(timeoutId);
//   }, [handleIntersect, loadedCount, visibleItems]);

//   if (0 !== items.length) {
//     setIsLoading(false);
//   }

//   return (
//     <Panel
//       className={styles.historialPanel}
//       isOpen={isPanelOpen}
//       onDismiss={handleDismiss}
//       isLightDismiss={true}
//       type={PanelType.customNear}
//       hasCloseButton={false}
//       onRenderNavigation={() => (
//         <div className={styles.miEncabezadoPersonalizado}>
//           <Icon
//             iconName="Clock"
//             styles={{
//               root: {
//                 fontSize: 20,
//                 color: '#ffffff',
//                 marginRight: 8,
//               },
//             }}
//           />
//           <span className={styles.tituloEncabezado}>
//             {textoEncabezadoHistorial}
//           </span>
//           <IconButton
//             iconProps={{
//               iconName: 'Cancel',
//               styles: { root: { color: '#ffffff', fontSize: 16 } },
//             }}
//             ariaLabel="Cerrar"
//             onClick={handleDismiss}
//             styles={{
//               root: {
//                 marginLeft: 'auto',
//                 color: '#ffffff',
//                 backgroundColor: 'transparent',
//               },
//               rootHovered: {
//                 backgroundColor: '#ffffff',
//               },
//               icon: {
//                 fontSize: 16,
//               },
//               iconHovered: {
//                 color: '#0078d4',
//               },
//             }}
//           />
//         </div>
//       )}
//       styles={{
//         main: { width: '440px', left: 0, right: 'unset' },
//         navigation: {
//           display: 'flex',
//           alignItems: 'center',
//           paddingTop: 12,
//           paddingBottom: 4,
//         },
//         content: {
//           display: 'flex',
//           flexDirection: 'column',
//           flexGrow: 1,
//           paddingRight: 0,
//           overflow: 'hidden',
//         },
//         scrollableContent: {
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           overflowY: 'auto',
//         },
//         closeButton: {
//           display: 'none',
//         },
//       }}
//     >
//       {isLoading ? (
//         <div className={styles.spinnerContainer}>
//           <Spinner
//             label="Espere por favor..."
//             size={SpinnerSize.large}
//             styles={{ label: { color: '#0078d4' } }}
//           />
//         </div>
//       ) : (
//         <CardList
//           items={visibleItems}
//           totalItems={items.length}
//           onCollapseRequest={handleCollapseRequest}
//           lastCardRef={lastCardRef}
//         />
//       )}
//     </Panel>
//   );
// }

// export default PanelHistorial;

// PanelHistorial.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Panel,
  PanelType,
  Spinner,
  SpinnerSize,
  Icon,
  IconButton,
} from '@fluentui/react';
import styles from './PanelHistorial.module.scss';
import CardList from '../CardsPanelHistorial/CardList/CardList';
import { IHistorialItem } from '../../HistorialPanel';

type PanelHistorialProps<T extends IHistorialItem> = {
  items: T[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  textoEncabezadoHistorial: string;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
};

function PanelHistorial<T extends IHistorialItem>({
  items,
  isLoading,
  setIsLoading,
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

  if (0 !== items.length) {
    setIsLoading(false);
  }

  return (
    <Panel
      className={styles.historialPanel}
      isOpen={isPanelOpen}
      onDismiss={handleDismiss}
      isLightDismiss={true}
      type={PanelType.customNear}
      hasCloseButton={false}
      onRenderNavigation={() => (
        <div className={styles.miEncabezadoPersonalizado}>
          <Icon
            iconName='Clock'
            styles={{
              root: {
                fontSize: 28,
                color: '#ffffff',
                marginRight: 10,
                lineHeight: '32px',
                width:  32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 3
              },
            }}
          />
          <span className={styles.tituloEncabezado}>
            {textoEncabezadoHistorial}
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
              icon: {
                fontSize: 18,
              },
              iconHovered: {
                color: '#0078d4',
              },
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
        closeButton: {
          display: 'none',
        },
      }}
    >
      {isLoading ? (
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

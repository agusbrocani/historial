// import { Icon, TooltipHost } from '@fluentui/react';
// import styles from './CardPanelHistorial.module.scss';

// import { IHistorialItem } from '../../HistorialPanel';

// type CardPanelHistorialProps<T extends IHistorialItem> = {
//     items: T[];
// };

// function CardPanelHistorial<T extends IHistorialItem>({ items }: CardPanelHistorialProps<T>) {
//     return (
//         <div className={styles.container}>
//             {items.map((item, index) => (
//                 <div className={styles.card} key={index}>
//                     <div className={styles.estados}>
//                         <span>{item.estadoAnterior}</span>
//                         <Icon iconName='Forward' className={styles.iconoEstado} />
//                         <span>{item.estadoPosterior}</span>
//                     </div>

//                     <div className={styles.infoGrid}>
//                         <div className={styles.iconoCalendario}>
//                             <Icon iconName='Calendar' />
//                         </div>
//                         <span className={styles.texto}>{`${item.fecha} a las ${item.hora} hs.`}</span>

//                         <div className={styles.avatar}>
//                             {(item.usuario[0] + item.usuario.split('.')[1]?.[0] || '').toUpperCase()}
//                         </div>
//                         <TooltipHost
//                             content={item.usuario}
//                             calloutProps={{ gapSpace: 0 }}
//                             styles={{ root: { display: 'inline-block' } }}
//                         >
//                             <span className={styles.texto}>
//                                 {item.usuario}
//                             </span>
//                         </TooltipHost>
//                     </div>

//                     <p className={styles.observacion}>{item.observacion}</p>
//                     <TooltipHost
//                         content={`Cambio ${index + 1} de ${items.length}`}
//                         calloutProps={{ gapSpace: 0 }}
//                         styles={{ root: { display: 'block', width: '100%' } }}
//                     >
//                         <span className={styles.indice}>
//                         {`Cambio ${index + 1} de ${items.length}`}
//                         </span>
//                     </TooltipHost>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default CardPanelHistorial;

// import React, { useRef, useEffect, useCallback, useState } from 'react';
// import { Icon, TooltipHost } from '@fluentui/react';
// import styles from './CardPanelHistorial.module.scss';

// import { IHistorialItem } from '../../HistorialPanel';

// type CardPanelHistorialProps<T extends IHistorialItem> = {
//   items: T[];                               // Lista completa de items (p. ej. 166)
//   batchSize?: number;                       // Tamaño del lote (por defecto 50)
//   onLoadMore?: (nextBatchStart: number) => void; // Callback opcional cuando se carga otro lote
// };

// function CardPanelHistorial<T extends IHistorialItem>({
//   items,
//   batchSize = 50,
//   onLoadMore,
// }: CardPanelHistorialProps<T>) {
//   // 1. Estado local: cuántos items hemos "cargado" (renderizado) hasta ahora.
//   //    Inicialmente: min(batchSize, items.length)
//   const [loadedCount, setLoadedCount] = useState(() =>
//     Math.min(batchSize, items.length)
//   );

//   // 2. Refs para el scroll container y para la “última card” renderizada
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const lastCardRef = useRef<HTMLDivElement | null>(null);

//   // 3. Obtenemos solo los items que vamos a renderizar: del 0 a loadedCount - 1
//   const visibleItems = items.slice(0, loadedCount);

//   // 4. Callback que maneja cuando la última card actual (indice = loadedCount - 1) entra en viewport.
//   const handleIntersect: IntersectionObserverCallback = useCallback(
//     (entries, observer) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           // Desconectamos el observer para evitar disparos múltiples
//           observer.unobserve(entry.target);

//           // Si todavía hay más items por cargar:
//           if (loadedCount < items.length) {
//             const nextCount = Math.min(loadedCount + batchSize, items.length);
//             setLoadedCount(nextCount);

//             // Si el padre quiere saber que cargamos más, lo notificamos:
//             if (onLoadMore) {
//               onLoadMore(loadedCount);
//             }
//           }
//         }
//       });
//     },
//     [batchSize, items.length, loadedCount, onLoadMore]
//   );

//   // 5. useEffect que instancia (o actualiza) el IntersectionObserver cada vez que
//   //    cambian `visibleItems.length` o cambia el contenedor.
//   useEffect(() => {
//     const node = lastCardRef.current;
//     const rootNode = containerRef.current;

//     // Si no hay nodo o no hay items pendientes, no creamos observer
//     if (!node || !rootNode || loadedCount >= items.length) {
//       return;
//     }

//     const options: IntersectionObserverInit = {
//       root: rootNode,
//       rootMargin: '0px',
//       threshold: 0.01, // 1% de visibilidad para disparar
//     };

//     const observer = new IntersectionObserver(handleIntersect, options);
//     observer.observe(node);

//     return () => {
//       observer.disconnect();
//     };
//   }, [handleIntersect, loadedCount, items.length]);

//   return (
//     <div
//       className={styles.container}
//       ref={containerRef}
//       // Asegurarse de que este contenedor tenga overflow: auto en CSS
//       // para que IntersectionObserver detecte “viewport” interno
//     >
//       {visibleItems.map((item, index) => {
//         const globalIndex = index; // 0-based dentro de visibleItems

//         // Comprobamos si es la "última card" de este batch
//         const isLast = index === visibleItems.length - 1;

//         return (
//           <div
//             className={styles.card}
//             key={globalIndex}
//             ref={isLast ? lastCardRef : null}
//           >
//             <div className={styles.estados}>
//               <span>{item.estadoAnterior}</span>
//               <Icon iconName="Forward" className={styles.iconoEstado} />
//               <span>{item.estadoPosterior}</span>
//             </div>

//             <div className={styles.infoGrid}>
//               <div className={styles.iconoCalendario}>
//                 <Icon iconName="Calendar" />
//               </div>
//               <span className={styles.texto}>
//                 {`${item.fecha} a las ${item.hora} hs.`}
//               </span>

//               <div className={styles.avatar}>
//                 {(item.usuario[0] + item.usuario.split('.')[1]?.[0] || '').toUpperCase()}
//               </div>
//               <TooltipHost
//                 content={item.usuario}
//                 calloutProps={{ gapSpace: 0 }}
//                 styles={{ root: { display: 'inline-block' } }}
//               >
//                 <span className={styles.texto}>{item.usuario}</span>
//               </TooltipHost>
//             </div>

//             <p className={styles.observacion}>{item.observacion}</p>
//             <TooltipHost
//               content={`Cambio ${globalIndex + 1} de ${items.length}`}
//               calloutProps={{ gapSpace: 0 }}
//               styles={{ root: { display: 'block', width: '100%' } }}
//             >
//               <span className={styles.indice}>
//                 {`Cambio ${globalIndex + 1} de ${items.length}`}
//               </span>
//             </TooltipHost>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default CardPanelHistorial;

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
  // 1. Estado local: cuántos items hemos "cargado" (renderizado) hasta ahora.
  //    Inicialmente: min(batchSize, items.length)
  const [loadedCount, setLoadedCount] = useState(() =>
    Math.min(batchSize, items.length)
  );

  // 2. Refs para el scroll container y para la “última card” renderizada
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  // 3. Obtenemos solo los items que vamos a renderizar: del 0 a loadedCount - 1
  const visibleItems = items.slice(0, loadedCount);

  // 4. Callback que maneja cuando la última card actual (indice = loadedCount - 1) entra en viewport.
  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Desconectamos el observer para evitar disparos múltiples
          observer.unobserve(entry.target);

          // Si todavía hay más items por cargar:
          if (loadedCount < items.length) {
            const nextCount = Math.min(loadedCount + batchSize, items.length);
            setLoadedCount(nextCount);

            // Si el padre quiere saber que cargamos más, lo notificamos:
            if (onLoadMore) {
              onLoadMore(loadedCount);
            }
          }
        }
      });
    },
    [batchSize, items.length, loadedCount, onLoadMore]
  );

  // 5. useEffect que instancia (o actualiza) el IntersectionObserver cada vez que
  //    cambian `visibleItems.length` o cambia el contenedor.
  useEffect(() => {
    const node = lastCardRef.current;
    const rootNode = containerRef.current;

    // Si no hay nodo o no hay items pendientes, no creamos observer
    if (!node || !rootNode || loadedCount >= items.length) {
      return;
    }

    const options: IntersectionObserverInit = {
      root: rootNode,
      rootMargin: '0px',
      threshold: 0.01, // 1% de visibilidad para disparar
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, loadedCount, items.length]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      // Asegurarse de que este contenedor tenga overflow: auto en CSS
      // para que IntersectionObserver detecte “viewport” interno
    >
      {visibleItems.map((item, index) => {
        const globalIndex = index; // 0-based dentro de visibleItems

        // Comprobamos si es la "última card" de este batch
        const isLast = index === visibleItems.length - 1;

        return (
          <div key={globalIndex} ref={isLast ? lastCardRef : null}>
            {/*
              En lugar de incrustar los hooks dentro del map(), 
              delegamos la renderización de cada tarjeta en un 
              componente separado: <CardHistorialItem />. 
            */}
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
  // Estado para controlar si está expandido o no
  const [expanded, setExpanded] = useState(false);

  // Estado para controlar si debemos mostrar el botón “Ver más”
  const [shouldShowButton, setShouldShowButton] = useState(false);

  // Ref al párrafo de observación para medir overflow
  const observacionRef = useRef<HTMLParagraphElement | null>(null);

  // Función que mide si el contenido desborda 3 líneas (~clamp activo)
  const checkOverflow = useCallback(() => {
    const el = observacionRef.current;
    if (!el) {
      setShouldShowButton(false);
      return;
    }
    // scrollHeight es la altura total (contenido completo)
    // clientHeight es la altura visible (3 líneas truncadas)
    if (el.scrollHeight > el.clientHeight + 1) {
      // +1 píxel de tolerancia para casos de redondeo
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
  }, []);

  // En mount y cada vez que cambie el texto, recalculemos overflow
  useEffect(() => {
    checkOverflow();

    // Observador de resize para recalcular si cambia el ancho
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

  return (
    <div className={styles.card}>
      <div className={styles.estados}>
        <span>{item.estadoAnterior}</span>
        <Icon iconName="Forward" className={styles.iconoEstado} />
        <span>{item.estadoPosterior}</span>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.iconoCalendario}>
          <Icon iconName="Calendar" />
        </div>
        <span className={styles.texto}>
          {`${item.fecha} a las ${item.hora} hs.`}
        </span>

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

      {/*
        SECCIÓN OBSERVACIÓN CON “VER MÁS”
        =================================
      */}
      <div>
        <p
          ref={observacionRef}
          className={
            expanded
              ? styles.observacionExpanded
              : styles.observacion
          }
        >
          {item.observacion}
        </p>
        {!expanded && shouldShowButton && (
          <button
            className={styles.verMasBtn}
            onClick={() => setExpanded(true)}
          >
            Ver más
          </button>
        )}
        {expanded && (
          <button
            className={styles.verMasBtn}
            onClick={() => setExpanded(false)}
          >
            Ver menos
          </button>
        )}
      </div>

      <TooltipHost
        content={`Cambio ${index + 1} de ${total}`}
        calloutProps={{ gapSpace: 0 }}
        styles={{ root: { display: 'block', width: '100%' } }}
      >
        <span className={styles.indice}>
          {`Cambio ${index + 1} de ${total}`}
        </span>
      </TooltipHost>
    </div>
  );
}

export default CardPanelHistorial;


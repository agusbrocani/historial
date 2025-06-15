// import { useRef, useEffect, useState, memo } from 'react';
// import { Icon } from '@fluentui/react';
// import styles from './CardItem.module.scss';
// import { IHistorialItem } from '../../../HistorialPanel';
// import { useIsTruncated } from './hooks/useIsTruncated';
// import Tooltip from '../../Tooltip';

// type CardHistorialItemProps<T extends IHistorialItem> = {
//   item: T;
//   index: number;
//   total: number;
//   colorGeneral: string;
//   colorAvatar: string;
//   onCollapseRequest?: (ref: HTMLDivElement | null) => void;
// };

// function CardItem<T extends IHistorialItem>({
//   item,
//   index,
//   total,
//   colorGeneral,
//   colorAvatar,
//   onCollapseRequest,
// }: CardHistorialItemProps<T>) {
//   const [expanded, setExpanded] = useState(false);
//   const [shouldShowButton, setShouldShowButton] = useState(false);

//   const observacionRef = useRef<HTMLParagraphElement | null>(null);
//   const usuarioRef = useRef<HTMLSpanElement | null>(null);
//   const indiceRef = useRef<HTMLSpanElement | null>(null);
//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const hasInteracted = useRef(false);

//   useEffect(() => {
//     let mounted = true;

//     const update = () => {
//       if (!mounted) return;
//       const el = observacionRef.current;
//       setShouldShowButton(
//         !!el && el.scrollHeight - el.clientHeight > 1
//       );
//     };

//     update();

//     const observer =
//       observacionRef.current &&
//       new window.ResizeObserver(update);

//     if (observacionRef.current && observer) {
//       observer.observe(observacionRef.current);
//     }
//     window.addEventListener('resize', update);

//     return () => {
//       mounted = false;
//       observer && observer.disconnect();
//       window.removeEventListener('resize', update);
//     };
//   }, [item.observacion]);

//   useEffect(() => {
//     if (!expanded && hasInteracted.current) {
//       onCollapseRequest?.(cardRef.current);
//     }
//   }, [expanded, onCollapseRequest]);

//   const toggleExpand = (value: boolean) => {
//     hasInteracted.current = true;
//     setExpanded(value);
//   };

//   const partes = item.usuario?.split('.') ?? [];
//   const iniciales =
//     ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || '?';
//   const fechaHoraTexto =
//     item.fecha && item.hora
//       ? `${item.fecha} a las ${item.hora} hs.`
//       : 'Fecha no disponible';
//   const estadoUnico = item.estadoUnico || 'Sin estado unico';
//   const estadoAnterior = item.estadoAnterior || 'Sin estado anterior';
//   const estadoPosterior = item.estadoPosterior || 'Sin estado posterior';

//   const conEstadoUnico = <span>{estadoUnico}</span>;
//   const conEstadoAnteriorPosterior = (
//     <>
//       <span>{estadoAnterior}</span>
//       <Icon
//         iconName='Forward'
//         className={styles.iconoEstado}
//         style={{ color: `${colorGeneral}` }}
//       />
//       <span>{estadoPosterior}</span>
//     </>
//   );

//   const estadoDefinido = (() => {
//     if (item.estadoUnico && item.estadoAnterior && item.estadoPosterior)
//       return 'Exceso de estados';
//     else if (!item.estadoUnico && !item.estadoAnterior && item.estadoPosterior)
//       return 'Sin estado';
//     else if (item.estadoUnico) return conEstadoUnico;
//     else return conEstadoAnteriorPosterior;
//   })();

//   const usuarioTexto = item.usuario || 'Usuario no identificado';
//   const observacionTexto = item.observacion || 'Sin observaciones';
//   const observacionId = `obs-${index}`;
//   const textoIndice = `Cambio ${index + 1} de ${total}`;

//   // Hook para saber si hay truncado
//   const usuarioTrunc = useIsTruncated(usuarioRef);
//   const indiceTrunc = useIsTruncated(indiceRef);

//   return (
//     <div
//       className={styles.card}
//       ref={cardRef}
//       style={{ borderLeftColor: `${colorGeneral}` }}
//     >
//       <div className={styles.estados}>{estadoDefinido}</div>

//       <div className={styles.infoGrid}>
//         <div className={styles.iconoCalendario}>
//           <Icon iconName='Calendar' />
//         </div>
//         <span className={styles.textoMultilinea}>{fechaHoraTexto}</span>
//         <div
//           className={styles.avatar}
//           style={{ backgroundColor: colorAvatar }}
//         >
//           {iniciales}
//         </div>

//         {/* Usuario con Tooltip solo si truncado */}
//         <Tooltip content={usuarioTexto} show={usuarioTrunc}>
//           <span ref={usuarioRef} className={styles.texto}>
//             {usuarioTexto}
//           </span>
//         </Tooltip>
//       </div>

//       <div>
//         <p
//           id={observacionId}
//           ref={observacionRef}
//           className={expanded ? styles.observacionExpanded : styles.observacion}
//           style={{
//             wordWrap: 'break-word',
//             overflowWrap: 'break-word',
//           }}
//         >
//           {observacionTexto}
//         </p>
//         {!expanded && shouldShowButton && (
//           <button
//             className={styles.verBtn}
//             style={{ color: `${colorGeneral}` }}
//             onClick={() => toggleExpand(true)}
//             aria-expanded={false}
//             aria-controls={observacionId}
//           >
//             Ver más
//           </button>
//         )}
//         {expanded && (
//           <button
//             className={styles.verBtn}
//             style={{ color: `${colorGeneral}` }}
//             onClick={() => toggleExpand(false)}
//             aria-expanded={true}
//             aria-controls={observacionId}
//           >
//             Ver menos
//           </button>
//         )}
//       </div>

//       {/* Indice con Tooltip solo si truncado */}
//       <Tooltip content={textoIndice} show={indiceTrunc}>
//         <span ref={indiceRef} className={styles.indice}>
//           {textoIndice}
//         </span>
//       </Tooltip>
//     </div>
//   );
// }

// export default memo(CardItem);

import { useRef, useEffect, useState, memo } from 'react';
import { Icon } from '@fluentui/react';
import styles from './CardItem.module.scss';
import { IHistorialItem } from '../../../HistorialPanel';
import { useIsTruncated } from './hooks/useIsTruncated';
import Tooltip from '../../Tooltip';

type CardHistorialItemProps<T extends IHistorialItem> = {
  item: T;
  index: number;
  total: number;
  colorGeneral: string;
  colorAvatar: string;
  onCollapseRequest?: (ref: HTMLDivElement | null) => void;
};

function CardItem<T extends IHistorialItem>({
  item,
  index,
  total,
  colorGeneral,
  colorAvatar,
  onCollapseRequest,
}: CardHistorialItemProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const observacionRef = useRef<HTMLParagraphElement | null>(null);
  const usuarioRef = useRef<HTMLSpanElement | null>(null);
  const indiceRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    let mounted = true;

    const update = () => {
      if (!mounted) return;
      const el = observacionRef.current;
      setShouldShowButton(
        !!el && el.scrollHeight - el.clientHeight > 1
      );
    };

    update();

    const observer =
      observacionRef.current &&
      new window.ResizeObserver(update);

    if (observacionRef.current && observer) {
      observer.observe(observacionRef.current);
    }
    window.addEventListener('resize', update);

    return () => {
      mounted = false;
      observer && observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [item.observacion]);

  useEffect(() => {
    if (!expanded && hasInteracted.current) {
      onCollapseRequest?.(cardRef.current);
    }
  }, [expanded, onCollapseRequest]);

  const toggleExpand = (value: boolean) => {
    hasInteracted.current = true;
    setExpanded(value);
  };

  const partes = item.usuario?.split('.') ?? [];
  const iniciales =
    ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || '?';
  const fechaHoraTexto =
    item.fecha && item.hora
      ? `${item.fecha} a las ${item.hora} hs.`
      : 'Fecha no disponible';
  const estadoUnico = (item.estadoUnico || 'Sin estado unico').toUpperCase();
  const estadoAnterior = (item.estadoAnterior || 'Sin estado anterior').toUpperCase();
  const estadoPosterior = (item.estadoPosterior || 'Sin estado posterior').toUpperCase();

  // Solo grid para el caso solicitado
  const conEstadoAnteriorPosterior = (
    <div className={styles.estadoGrid}>
      <span className={styles.estadoTexto}>{estadoAnterior}</span>
      <span className={styles.flechaCentro}>
        <Icon
          iconName='Forward'
          className={styles.iconoEstado}
          style={{ color: `${colorGeneral}` }}
        />
      </span>
      <span className={styles.estadoTexto}>{estadoPosterior}</span>
    </div>
  );

  // Igual que antes, sin grid si hay estado unico o casos edge
  const estadoDefinido = (() => {
    if (item.estadoUnico && item.estadoAnterior && item.estadoPosterior)
      return 'Exceso de estados';
    else if (!item.estadoUnico && !item.estadoAnterior && item.estadoPosterior)
      return 'Sin estado';
    else if (item.estadoUnico)
      return <span>{estadoUnico}</span>;
    else
      return conEstadoAnteriorPosterior;
  })();

  const usuarioTexto = item.usuario || 'Usuario no identificado';
  const observacionTexto = item.observacion || 'Sin observaciones';
  const observacionId = `obs-${index}`;
  const textoIndice = `Cambio ${index + 1} de ${total}`;

  const usuarioTrunc = useIsTruncated(usuarioRef);
  const indiceTrunc = useIsTruncated(indiceRef);

  return (
    <div
      className={styles.card}
      ref={cardRef}
      style={{ borderLeftColor: `${colorGeneral}` }}
    >
      <div className={styles.estados}>{estadoDefinido}</div>

      <div className={styles.infoGrid}>
        <div className={styles.iconoCalendario}>
          <Icon iconName='Calendar' />
        </div>
        <span className={styles.textoMultilinea}>{fechaHoraTexto}</span>
        <div
          className={styles.avatar}
          style={{ backgroundColor: colorAvatar }}
        >
          {iniciales}
        </div>
        <Tooltip content={usuarioTexto} show={usuarioTrunc}>
          <span ref={usuarioRef} className={styles.texto}>
            {usuarioTexto}
          </span>
        </Tooltip>
      </div>

      <div>
        <p
          id={observacionId}
          ref={observacionRef}
          className={expanded ? styles.observacionExpanded : styles.observacion}
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {observacionTexto}
        </p>
        {!expanded && shouldShowButton && (
          <button
            className={styles.verBtn}
            style={{ color: `${colorGeneral}` }}
            onClick={() => toggleExpand(true)}
            aria-expanded={false}
            aria-controls={observacionId}
          >
            Ver más
          </button>
        )}
        {expanded && (
          <button
            className={styles.verBtn}
            style={{ color: `${colorGeneral}` }}
            onClick={() => toggleExpand(false)}
            aria-expanded={true}
            aria-controls={observacionId}
          >
            Ver menos
          </button>
        )}
      </div>

      <Tooltip content={textoIndice} show={indiceTrunc}>
        <span ref={indiceRef} className={styles.indice}>
          {textoIndice}
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(CardItem);

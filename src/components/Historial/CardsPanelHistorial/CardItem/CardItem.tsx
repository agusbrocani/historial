import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Icon, TooltipHost } from '@fluentui/react';
import styles from './CardItem.module.scss';
import { IHistorialItem } from '../../../HistorialPanel';

type CardHistorialItemProps<T extends IHistorialItem> = {
  item: T;
  index: number;
  total: number;
  onCollapseRequest?: (ref: HTMLDivElement | null) => void;
};

function CardItem<T extends IHistorialItem>({
  item,
  index,
  total,
  onCollapseRequest,
}: CardHistorialItemProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const observacionRef = useRef<HTMLParagraphElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasInteracted = useRef(false);

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
    if (!expanded && hasInteracted.current) {
      onCollapseRequest?.(cardRef.current);
    }
  }, [expanded, onCollapseRequest]);

  const toggleExpand = (value: boolean) => {
    hasInteracted.current = true;
    setExpanded(value);
  };

  const partes = item.usuario?.split('.') ?? [];
  const iniciales = ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || '?';

  const fechaHoraTexto = (item.fecha && item.hora)
    ? `${item.fecha} a las ${item.hora} hs.`
    : 'Fecha no disponible';

  const estadoAnterior = item.estadoAnterior || 'Sin estado';
  const estadoPosterior = item.estadoPosterior || 'Sin estado';
  const usuarioTexto = item.usuario || 'Usuario no identificado';
  const observacionTexto = item.observacion || 'Sin observaciones';

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.estados}>
        <span>{estadoAnterior}</span>
        <Icon iconName='Forward' className={styles.iconoEstado} />
        <span>{estadoPosterior}</span>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.iconoCalendario}>
          <Icon iconName='Calendar' />
        </div>
        <span className={styles.texto}>{fechaHoraTexto}</span>

        <div className={styles.avatar}>
          {iniciales}
        </div>
        <TooltipHost
          content={usuarioTexto}
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block' } }}
        >
          <span className={styles.texto}>{usuarioTexto}</span>
        </TooltipHost>
      </div>

      <div>
        <p
          ref={observacionRef}
          className={expanded ? styles.observacionExpanded : styles.observacion}
          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        >
          {observacionTexto}
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

export default CardItem;

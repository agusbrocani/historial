import { useRef, useEffect, useCallback, useState, memo } from 'react';
import { Icon, TooltipHost, ICalloutProps } from '@fluentui/react';
import styles from './CardItem.module.scss';
import { IHistorialItem } from '../../../HistorialPanel';

type CardHistorialItemProps<T extends IHistorialItem> = {
  item: T;
  index: number;
  total: number;
  colorGeneral: string;
  colorAvatar: string;
  onCollapseRequest?: (ref: HTMLDivElement | null) => void;
};

const tooltipCalloutProps: ICalloutProps = {
  gapSpace: 8,
  directionalHint: 0,
  isBeakVisible: false,
  styles: {
    root: {
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      border: '1px solid #e0e0e0',
      background: '#fff',
      padding: 8,
    }
  }
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
  const [isUsuarioTruncado, setIsUsuarioTruncado] = useState(false);
  const [isIndiceTruncado, setIsIndiceTruncado] = useState(false);

  const observacionRef = useRef<HTMLParagraphElement | null>(null);
  const usuarioRef = useRef<HTMLSpanElement | null>(null);
  const indiceRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasInteracted = useRef(false);

  const checkOverflow = useCallback(() => {
    const el = observacionRef.current;
    if (!el) {
      setShouldShowButton(false);
      return;
    }
    const isOverflowing = el.scrollHeight - el.clientHeight > 1;
    setShouldShowButton(isOverflowing);
  }, []);

  const checkUsuarioOverflow = useCallback(() => {
    const el = usuarioRef.current;
    if (!el) return;
    const isTruncated = el.scrollWidth > el.clientWidth + 1;
    setIsUsuarioTruncado(isTruncated);
  }, []);

  const checkIndiceOverflow = useCallback(() => {
    const el = indiceRef.current;
    if (!el) return;
    const isTruncated = el.scrollWidth > el.clientWidth + 1;
    setIsIndiceTruncado(isTruncated);
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
    checkUsuarioOverflow();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => checkUsuarioOverflow());
    });
    if (usuarioRef.current) ro.observe(usuarioRef.current);
    return () => ro.disconnect();
  }, [checkUsuarioOverflow, item.usuario]);

  useEffect(() => {
    checkIndiceOverflow();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => checkIndiceOverflow());
    });
    if (indiceRef.current) ro.observe(indiceRef.current);
    return () => ro.disconnect();
  }, [checkIndiceOverflow, index, total]);

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

  const estadoUnico = item.estadoUnico || 'Sin estado unico';
  const estadoAnterior = item.estadoAnterior || 'Sin estado anterior';
  const estadoPosterior = item.estadoPosterior || 'Sin estado posterior';

  const conEstadoUnico = <span>{estadoUnico}</span>;

  const conEstadoAnteriorPosterior = (
    <>
      <span>{estadoAnterior}</span>
      <Icon
        iconName='Forward'
        className={styles.iconoEstado}
        style={{ color: `${colorGeneral}` }}
      />
      <span>{estadoPosterior}</span>
    </>
  );

  const estadoDefinido = (() => {
    if (item.estadoUnico && item.estadoAnterior && item.estadoPosterior)
      return 'Exceso de estados';
    else if (!item.estadoUnico && !item.estadoAnterior && item.estadoPosterior)
      return 'Sin estado';
    else if (item.estadoUnico)
      return conEstadoUnico;
    else
      return conEstadoAnteriorPosterior;
  })();

  const usuarioTexto = item.usuario || 'Usuario no identificado';
  const observacionTexto = item.observacion || 'Sin observaciones';
  const observacionId = `obs-${index}`;

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

        <div className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
          {iniciales}
        </div>

        {isUsuarioTruncado ? (
          <TooltipHost
            content={usuarioTexto}
            calloutProps={tooltipCalloutProps}
            styles={{ root: { display: 'inline-block', maxWidth: '100%' } }}
          >
            <span ref={usuarioRef} className={styles.texto}>
              {usuarioTexto}
            </span>
          </TooltipHost>
        ) : (
          <span ref={usuarioRef} className={styles.texto}>
            {usuarioTexto}
          </span>
        )}
      </div>

      <div>
        <p
          id={observacionId}
          ref={observacionRef}
          className={expanded ? styles.observacionExpanded : styles.observacion}
          style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
        >
          {observacionTexto}
        </p>
        {!expanded && shouldShowButton && (
          <button
            className={styles.verBtn}
            style={{ color: `${colorGeneral}` }}
            onClick={() => toggleExpand(true)}
            role='button'
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
            role='button'
            aria-expanded={true}
            aria-controls={observacionId}
          >
            Ver menos
          </button>
        )}
      </div>

      {isIndiceTruncado ? (
        <TooltipHost
          content={`Cambio ${index + 1} de ${total}`}
          calloutProps={tooltipCalloutProps}
          styles={{ root: { display: 'block', width: '100%' } }}
        >
          <span ref={indiceRef} className={styles.indice}>
            {`Cambio ${index + 1} de ${total}`}
          </span>
        </TooltipHost>
      ) : (
        <span ref={indiceRef} className={styles.indice}>
          {`Cambio ${index + 1} de ${total}`}
        </span>
      )}
    </div>
  );
}

export default memo(CardItem);

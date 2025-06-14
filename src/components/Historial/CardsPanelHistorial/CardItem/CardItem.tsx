import { useRef, useEffect, useState, memo } from 'react';
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
    },
  },
};

type TooltipSpanProps = {
  refEl: React.RefObject<HTMLElement>;
  content: string;
  isTruncated: boolean;
  className: string;
  block?: boolean;
};

const TooltipSpan = ({ refEl, content, isTruncated, className, block = false }: TooltipSpanProps) =>
  isTruncated ? (
    <TooltipHost
      content={content}
      calloutProps={tooltipCalloutProps}
      styles={{ root: { display: block ? 'block' : 'inline-block', maxWidth: '100%', width: block ? '100%' : 'auto' } }}
    >
      <span ref={refEl} className={className}>
        {content}
      </span>
    </TooltipHost>
  ) : (
    <span ref={refEl} className={className}>
      {content}
    </span>
  );

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

  useEffect(() => {
    let mounted = true;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            if (!mounted) return;

            const obs = observacionRef.current;
            if (obs) {
              const isOverflowing = obs.scrollHeight - obs.clientHeight > 1;
              setShouldShowButton(isOverflowing);
            }

            const usr = usuarioRef.current;
            if (usr) {
              const isTruncated = Math.floor(usr.scrollWidth) > Math.floor(usr.clientWidth);
              setIsUsuarioTruncado(isTruncated);
            }

            const ind = indiceRef.current;
            if (ind) {
              const isTruncated = Math.floor(ind.scrollWidth) > Math.floor(ind.clientWidth);
              setIsIndiceTruncado(isTruncated);
            }
          } catch (error) {
            console.warn('Error en ResizeObserver:', error);
            setShouldShowButton(false);
            setIsUsuarioTruncado(false);
            setIsIndiceTruncado(false);
          }
        }, 0);
      });
    });

    if (observacionRef.current) observer.observe(observacionRef.current);
    if (usuarioRef.current) observer.observe(usuarioRef.current);
    if (indiceRef.current) observer.observe(indiceRef.current);

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [item.usuario, item.observacion]);

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
  const textoIndice = `Cambio ${index + 1} de ${total}`;

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

        <TooltipSpan
          refEl={usuarioRef}
          content={usuarioTexto}
          isTruncated={isUsuarioTruncado}
          className={styles.texto}
        />
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

      <TooltipSpan
        refEl={indiceRef}
        content={textoIndice}
        isTruncated={isIndiceTruncado}
        className={styles.indice}
        block
      />
    </div>
  );
}

export default memo(CardItem);

import React, {
  Fragment,
  useRef,
  useState,
  memo
} from 'react';
import { Icon } from '@fluentui/react';
import styles from './CardItem.module.scss';
import { IHistorialItem } from '../../../../IHistorialItem';
import { useIsTruncated } from '../../../../utils/hooks/useIsTruncated';
import CustomTooltip from '../../../../utils/components/CustomTooltip';

type CardItemProps = {
  item: IHistorialItem;
  index: number;
  total: number;
  ordenNumeracionCardsDesc: boolean;
  colorGeneral: string;
  colorAvatar: string;
};

function CardItem({
  item,
  index,
  total,
  ordenNumeracionCardsDesc = false,
  colorGeneral,
  colorAvatar,
}: CardItemProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const isHovered = isCardHovered || isTooltipHovered;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const usuarioRef = useRef<HTMLSpanElement | null>(null);
  const indiceRef = useRef<HTMLSpanElement | null>(null);

  const partes = item.usuario?.split('.') ?? [];
  const iniciales =
    ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase() || '?';

  const fechaHoraTexto = (() => {
    if (item.fecha && item.hora)
      return `${item.fecha} a las ${item.hora} hs.`;
    else if (item.fecha && !item.hora)
      return `${item.fecha}.`;
    else
      return 'Fecha no disponible';
  })();

  const estadoUnico = (item.estadoUnico || 'Sin estado unico').toUpperCase();
  const estadoAnterior = (item.estadoAnterior || 'Sin estado anterior').toUpperCase();
  const estadoPosterior = (item.estadoPosterior || 'Sin estado posterior').toUpperCase();

  const conEstadoAnteriorPosterior = (
    <div className={styles.statusContainer}>
      <span
        className={styles.statusBadge}
        style={{ color: `${colorGeneral}` }}
      >
        {estadoAnterior}
      </span>
      <Icon
        iconName='Forward'
        className={styles.statusArrow}
        style={{ color: colorGeneral }}
      />
      <span
        className={styles.statusBadge}
        style={{ color: `${colorGeneral}` }}
      >
        {estadoPosterior}
      </span>
    </div>
  );

  const estadoDefinido = (() => {
    if (item.estadoUnico && item.estadoAnterior && item.estadoPosterior) {
      return (
        <div className={styles.statusContainer}>
          <span
            className={styles.statusBadge}
            style={{ color: `${colorGeneral}` }}
          >
            Hay 3 estados en donde debería haber 1 o 2.
          </span>
        </div>
      );
    }

    if (!item.estadoUnico && !item.estadoAnterior && !item.estadoPosterior) {
      return (
        <div className={styles.statusContainer}>
          <span
            className={styles.statusBadge}
            style={{ color: `${colorGeneral}` }}
          >
            Sin estado
          </span>
        </div>
      );
    }

    if (item.estadoUnico) {
      return (
        <div className={styles.statusContainer}>
          <span
            className={styles.statusBadge}
            style={{ color: `${colorGeneral}` }}
          >
            {estadoUnico}
          </span>
        </div>
      );
    }

    return conEstadoAnteriorPosterior;
  })();

  const usuarioTexto = item.usuario || 'Usuario no identificado';
  const textoIndice = `Cambio ${ordenNumeracionCardsDesc? total - index : index + 1} de ${total}`;
  const usuarioTrunc = useIsTruncated(usuarioRef);
  const indiceTrunc = useIsTruncated(indiceRef);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      style={{
        borderLeftColor: colorGeneral,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...(isHovered && {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }),
      }}
    >
      {/* Estados */}
      <div className={styles.estados}>{estadoDefinido}</div>

      {/* Icono Fecha, Fecha, Avatar y Usuario */}
      <div className={styles.infoGrid}>
        <div className={styles.iconoCalendario}>
          <Icon iconName="Calendar" />
        </div>
        <span className={styles.fechaHoraTexto}>{fechaHoraTexto}</span>
        <div className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
          {iniciales}
        </div>
        <CustomTooltip
          content={usuarioTexto}
          show={usuarioTrunc}
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => setIsTooltipHovered(false)}
        >
          <span ref={usuarioRef} className={styles.textoUsuario}>
            {usuarioTexto}
          </span>
        </CustomTooltip>
      </div>

      {/* Sección renderizable */}
      <div className={styles.renderizableSection}>
        {item.renderizable?.map((item, idx) => (
          <Fragment key={idx}>{item}</Fragment>
        ))}
      </div>

      {/* Índice */}
      <CustomTooltip
        content={textoIndice}
        show={indiceTrunc}
        onMouseEnter={() => setIsTooltipHovered(true)}
        onMouseLeave={() => setIsTooltipHovered(false)}
      >
        <span ref={indiceRef} className={styles.indice}>
          {textoIndice}
        </span>
      </CustomTooltip>
    </div>
  );
}

export default memo(CardItem);

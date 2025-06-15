import { useEffect, useState, useRef } from 'react';
import {
  IconButton,
  IButtonStyles
} from '@fluentui/react';
import PanelHistorial from './PanelHistorial/PanelHistorial';
import { IHistorialItem } from '../HistorialPanel';
import Tooltip from './Tooltip';

type HistorialProps<T extends IHistorialItem> = {
  items: T[];
  batchSize?: number;
  textoEncabezadoHistorial: string;
  colorGeneral?: string;
  colorAvatar?: string;
  leyendaToolTip?: string;
  estilosBoton?: IButtonStyles;
  onClose?: () => void;
};

const BATCH_SIZE_MINIMO = 10;
function Historial<T extends IHistorialItem>({
  items,
  batchSize = BATCH_SIZE_MINIMO,
  textoEncabezadoHistorial,
  colorGeneral,
  colorAvatar,
  leyendaToolTip,
  estilosBoton,
  onClose
}: HistorialProps<T>) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const leyendaDefaultToolTip = 'Historial';
  const leyenda = leyendaToolTip ?? leyendaDefaultToolTip;
  const colorGeneralFinal = (() => { 
    const s = new Option().style; 
    s.color = colorGeneral?.trim() || ''; 
    return s.color ? colorGeneral : '#000000'; 
  })();

  const colorAvatarFinal = (() => { 
    const s = new Option().style; 
    s.color = colorAvatar?.trim() || ''; 
    if (s.color) return colorAvatar; 
    // Si el avatar no es válido, intento usar colorGeneralFinal:
    const g = new Option().style; 
    g.color = colorGeneralFinal; 
    return g.color ? colorGeneralFinal : '#000000'; 
  })();

  useEffect(() => {
    if (isPanelOpen) {
      setIsLoading(true);
      setTimeoutExceeded(false);
      timeoutRef.current = setTimeout(() => {
        setTimeoutExceeded(true);
        setIsLoading(false);
      }, 15000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPanelOpen]);

  useEffect(() => {
    if (isPanelOpen && items.length > 0) {
      setIsLoading(false);
      setTimeoutExceeded(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [items, isPanelOpen]);

  const iconButton = (
    <IconButton
      iconProps={{ iconName: 'History' }}
      styles={
        estilosBoton ?? {
          root: {
            color: colorGeneralFinal,
            width: 30,
            height: 30,
            border: `1px solid ${colorGeneralFinal}`,
            borderRadius: 6,
          },
          rootHovered: {
            color: '#fff',
            background: colorGeneralFinal,
            border: `1px solid ${colorGeneralFinal}`,
          },
          rootPressed: {
            color: '#fff',
            background: colorGeneralFinal,
            border: `1px solid ${colorGeneralFinal}`,
          }
        }
      }
      aria-label={leyenda}
      onClick={() => {
        (document.activeElement as HTMLElement)?.blur();
        setIsPanelOpen(true);
      }}
    />
  );

  const batchSizeFinal = Number.isFinite(batchSize)
    ? Math.max(batchSize, BATCH_SIZE_MINIMO)
    : BATCH_SIZE_MINIMO;

  return (
    <>
      <Tooltip content={leyenda} show={true}>
        {iconButton}
      </Tooltip>
      {isPanelOpen && (
        <PanelHistorial
          items={items}
          batchSize={batchSizeFinal}
          colorGeneral={colorGeneralFinal}
          colorAvatar={colorAvatarFinal}
          isLoading={isLoading}
          textoEncabezadoHistorial={textoEncabezadoHistorial}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          onClose={onClose}
          timeoutExceeded={timeoutExceeded}
        />
      )}
    </>
  );
}

export default Historial;

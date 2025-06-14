import { useEffect, useState, useRef } from 'react';
import {
  TooltipHost,
  IconButton,
  IButtonStyles
} from '@fluentui/react';
import PanelHistorial from './PanelHistorial/PanelHistorial';
import { IHistorialItem } from '../HistorialPanel';

type HistorialProps<T extends IHistorialItem> = {
  items: T[];
  batchSize: number;
  textoEncabezadoHistorial: string;
  colorGeneral: string;
  colorAvatar?: string;
  leyendaToolTip?: string;
  estilosBoton?: IButtonStyles;
  onClose?: () => void;
};

function Historial<T extends IHistorialItem>({
  items,
  batchSize,
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
  const colorGeneralFinal = colorGeneral?.trim() ? colorGeneral : '#000000';
  const colorAvatarFinal = colorAvatar ?? colorGeneralFinal;

  // Al abrir el panel, mostrar spinner y comenzar timeout
  useEffect(() => {
    if (isPanelOpen) {
      setIsLoading(true);
      setTimeoutExceeded(false);

      timeoutRef.current = setTimeout(() => {
        setTimeoutExceeded(true);
        setIsLoading(false);
      }, 15000); // 15 segundos máximo
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPanelOpen]);

  // Si llegan los items con el panel abierto, ocultar spinner y cancelar timeout
  useEffect(() => {
    if (isPanelOpen && items.length > 0) {
      setIsLoading(false);
      setTimeoutExceeded(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
        }
      }
      onClick={() => {
        (document.activeElement as HTMLElement)?.blur();
        setIsPanelOpen(true);
      }}
    />
  );
  
  const cargaMinima = 10;
  const batchSizeFinal = Math.max(batchSize, cargaMinima);

  return (
    <>
      <TooltipHost content={leyenda}>
        {iconButton}
      </TooltipHost>
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

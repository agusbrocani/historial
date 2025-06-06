import { useState } from 'react';
import {
    TooltipHost,
    IconButton,
    IButtonStyles
} from '@fluentui/react';
import PanelHistorial from '../PanelHistorial/PanelHistorial';
import styles from './Historial.module.scss';

import { IHistorialItem } from '../../HistorialPanel';

type HistorialProps<T extends IHistorialItem> = {
    items: T[];
    textoEncabezadoHistorial: string;
    leyendaToolTip?: string;
    estilosBoton?: IButtonStyles;
    onClose?: () => void;
};

function Historial<T extends IHistorialItem> ({
    items,
    textoEncabezadoHistorial,
    leyendaToolTip,
    estilosBoton,
    onClose
}: HistorialProps<T>) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const leyendaDefaultToolTip = 'Historial';
    const leyenda = leyendaToolTip ?? leyendaDefaultToolTip;

    const iconButton =
        <IconButton
            iconProps={{ iconName: 'History' }}
            className={!estilosBoton ? styles.botonHistorialDefault : undefined}
            styles={estilosBoton}
            onClick={() => {
                (document.activeElement as HTMLElement)?.blur();
                setIsPanelOpen(true);
            }}
        />;

    return (
        <>
            <TooltipHost content={leyenda}>
                {iconButton}
            </TooltipHost>
            {isPanelOpen && <PanelHistorial
                items={items}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                textoEncabezadoHistorial={textoEncabezadoHistorial}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
                onClose={onClose}
            />}
        </>
    );
}

export default Historial;

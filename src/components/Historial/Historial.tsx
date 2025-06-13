import { useState } from 'react';
import {
    TooltipHost,
    IconButton,
    IButtonStyles
} from '@fluentui/react';
import PanelHistorial from './PanelHistorial/PanelHistorial';
import { IHistorialItem } from '../HistorialPanel';

type HistorialProps<T extends IHistorialItem> = {
    items: T[];
    textoEncabezadoHistorial: string;
    colorGeneral: string;
    colorAvatar?: string;
    leyendaToolTip?: string;
    estilosBoton?: IButtonStyles;
    onClose?: () => void;
};

function Historial<T extends IHistorialItem>({
    items,
    textoEncabezadoHistorial,
    colorGeneral,
    colorAvatar,
    leyendaToolTip,
    estilosBoton,
    onClose
}: HistorialProps<T>) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const leyendaDefaultToolTip = 'Historial';
    const leyenda = leyendaToolTip ?? leyendaDefaultToolTip;
    const colorGeneralFinal: string = colorGeneral ? colorGeneral : '#000000';
    const colorAvatarFinal: string = colorAvatar ?? colorGeneralFinal;
    const iconButton = (
        <IconButton
            iconProps={{ iconName: 'History' }}
            styles={
                estilosBoton
                    ? estilosBoton
                    : {
                        root: {
                            color: `${colorGeneralFinal}`,
                            width: '30px',
                            height: '30px',
                            border: `1px solid ${colorGeneralFinal}`,
                            borderRadius: '6px',
                        },
                    }
            }
            onClick={() => {
                (document.activeElement as HTMLElement)?.blur();
                setIsPanelOpen(true);
            }}
        />
    );

    return (
        <>
            <TooltipHost content={leyenda}>
                {iconButton}
            </TooltipHost>
            {isPanelOpen && <PanelHistorial
                items={items}
                colorGeneral={colorGeneralFinal}
                colorAvatar={colorAvatarFinal}
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

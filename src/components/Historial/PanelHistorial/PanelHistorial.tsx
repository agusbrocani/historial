import { useState } from 'react';
import {
    Panel,
    PanelType,
    Spinner, 
    SpinnerSize
} from '@fluentui/react';
import styles from './PanelHistorial.module.scss';
import CardPanelHistorial from '../CardPanelHistorial/CardPanelHistorial';

import { IHistorialItem } from '../../HistorialPanel';

type PanelHistorialProps<T extends IHistorialItem> = {
    items: T[];
    textoEncabezadoHistorial: string;
    isPanelOpen: boolean;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: () => void;
};

function PanelHistorial<T extends IHistorialItem> ({
    items,
    textoEncabezadoHistorial,
    isPanelOpen,
    setIsPanelOpen,
    onClose,
}: PanelHistorialProps<T>) {
    const handleDismiss = () => {
        setIsPanelOpen(false);
        onClose?.();
    };
    const [isLoading, setIsLoading] = useState(true);

    const spinner =       
        <div className={styles.spinnerContainer}>
            <Spinner 
                label='Espere por favor...' 
                size={SpinnerSize.large}
                styles={{ label: { color: '#0078d4' } }}
            />
        </div>;

    return (
        <Panel
            headerText={textoEncabezadoHistorial}
            closeButtonAriaLabel='Cerrar'
            isOpen={isPanelOpen}
            onDismiss={handleDismiss}
            isLightDismiss={true}
            type={PanelType.customNear}
              styles={{
                main: {
                    width: '340px',
                    left: 0,
                    right: 'unset',
                },
                content: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                },
                scrollableContent: {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {0 === items.length ? spinner : <CardPanelHistorial items={items}/>}
        </Panel>
    );
}

export default PanelHistorial;

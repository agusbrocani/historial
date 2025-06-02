import { Panel } from '@fluentui/react';
import styles from './PanelHistorial.module.scss';

type PanelHistorialProps<T> = {
    items: T[]
    textoEncabezadoHistorial: string
    isPanelOpen: boolean
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose?: () => void;
};

function PanelHistorial<T>({
    items,
    textoEncabezadoHistorial,
    isPanelOpen,
    setIsPanelOpen,
    onClose
}: PanelHistorialProps<T>) {
    console.log(items);
    const handleDismiss = () => {
        setIsPanelOpen(false);
        onClose?.();
    };

    return (
        <Panel
            headerText={textoEncabezadoHistorial}
            closeButtonAriaLabel='Cerrar'
            isOpen={isPanelOpen}
            onDismiss={handleDismiss}
            isLightDismiss={true}
        >
            {/* Renderizar los datos del historial */}
            <p>Contenido del historial</p>
        </Panel>
    );
}

export default PanelHistorial;
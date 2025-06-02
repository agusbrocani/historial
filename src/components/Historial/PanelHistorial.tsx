import { Panel } from '@fluentui/react';

type PanelHistorialProps<T> = {
    items: T[]
    textoEncabezadoHistorial: string
    isPanelOpen: boolean
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
    onClose?: () => void;
};

function PanelHistorial<T>({ items, textoEncabezadoHistorial, isPanelOpen, setIsPanelOpen, onClose }: PanelHistorialProps<T>) {
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
            {/* Acá podés renderizar los datos del historial */}
            <p>Aquí iría tu contenido del historial...</p>
        </Panel>
    );
}

export default PanelHistorial;
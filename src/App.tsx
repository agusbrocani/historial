import * as React from 'react';
import { DefaultButton } from '@fluentui/react';
import { HistorialPanel, IItem } from './components/HistorialPanel';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();


const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const items: IItem[] = [
    {
      estadoAnterior: 'Borrador',
      estadoPosterior: 'Publicado',
      usuario: 'agustin.brocani@outlook.com',
      fecha: '2025-05-29',
      observacion: 'Se aprobó el cambio',
    },
    {
      estadoAnterior: 'Publicado',
      estadoPosterior: 'Archivado',
      usuario: 'admin.system',
      fecha: '2025-05-30',
      observacion: 'Fin del ciclo de vida',
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <DefaultButton text="Ver Historial" onClick={() => setIsPanelOpen(true)} />
      <HistorialPanel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        items={items}
      />
    </div>
  );
};

export default App;

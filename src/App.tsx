import * as React from 'react';
import { DefaultButton } from '@fluentui/react';
import { HistorialPanel, IItem } from './components/HistorialPanel';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import Historial from './components/Historial/Historial'

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
      observacion: 'Fin del ciclo de vida AGREGO ESTE CODIGO PARA QUE SEA LARGO Y SI TIENE QUE ROMPER, SE ROMPA',
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* <DefaultButton text="Ver Historial" onClick={() => isPanelOpen ? setIsPanelOpen(false) : setIsPanelOpen(true)} />
      <HistorialPanel
        isOpen={isPanelOpen}
        onDismiss={() => isPanelOpen ? setIsPanelOpen(false) : setIsPanelOpen(true)}
        items={items}
      /> */}

      <Historial
        items={items}
        textoEncabezadoHistorial={'Historial de cambios'}
        // leyendaToolTip='Historial'
        // estilosBoton={{
        //   root: {
        //     color: '#7D50A5',
        //     width: 30,
        //     height: 30,
        //     border: '1px solid #7D50A5',
        //     borderRadius: 6,
        //   }
        // }}
        onClose={() => console.log('Cerré la ventana lateral.')}
      />

    </div>
  );
};

export default App;

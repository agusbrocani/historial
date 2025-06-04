// import * as React from 'react';
// import { Panel, PanelType } from '@fluentui/react';
// import { DefaultButton } from '@fluentui/react';
// import styles from './HistorialPanel.module.scss';

// export interface IHistorialItem {
//   estadoAnterior: string;
//   estadoPosterior: string;
//   usuario: string;
//   fecha: string;
//   observacion: string;
// }

// interface HistorialPanelProps {
//   isOpen: boolean;
//   onDismiss: () => void;
//   items: IHistorialItem[];
// }

// export const HistorialPanel: React.FC<HistorialPanelProps> = ({ isOpen, onDismiss, items }) => {
//   return (
//     <Panel
//       isOpen={isOpen}
//       onDismiss={onDismiss}
//       headerText="Historial de Cambios"
//       closeButtonAriaLabel="Cerrar"
//       type={PanelType.smallFixedNear} // PanelType.smallFixedFar => por defecto a la derecha
//     >
//       {/* {items.map((item, index) => (
//         <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
//           <p><strong>Cambio {index + 1} de {items.length}</strong></p>
//           <p><strong>Estado:</strong> {item.estadoAnterior} ➡️ {item.estadoPosterior}</p>
//           <p><strong>Usuario:</strong> {item.usuario}</p>
//           <p><strong>Fecha:</strong> {item.fecha}</p>
//           <p><strong>Observacion:</strong> {item.observacion}</p>
//         </div>
//       ))} */}


//     {/* {items.map((item, index) => (
//         <div key={index} className={styles.historialItem}>
//             <div className={styles.punto}></div>
//             <div>
//             <div className={styles.rol}>SISTEMA</div>
//             <div className={styles.fecha}>{item.fecha}</div>
//             <div className={styles.usuario}>{item.usuario}</div>
//             <div className={styles.observacion}>{item.observacion}</div>
//             <div className={styles.numeroRegistro}>
//                 Cambio {index + 1} de {items.length}
//             </div>
//             </div>
//         </div>
//     ))} */}
//     </Panel>
//   );
// };


import * as React from 'react';
import { Panel, PanelType, Icon } from '@fluentui/react';
import styles from './HistorialPanel.module.scss';

export interface IHistorialItem {
  estadoAnterior: string;
  estadoPosterior: string;
  usuario: string;
  fecha: string;
  hora: string;
  observacion: string;
}

interface HistorialPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  items: IHistorialItem[];
}

export const HistorialPanel: React.FC<HistorialPanelProps> = ({ isOpen, onDismiss, items }) => {
  const fallbackFocusRef = React.useRef<HTMLDivElement>(null);

  const handleDismiss = () => {
    onDismiss();
    fallbackFocusRef.current?.focus();
  };

  return (
    <>
      <div tabIndex={-1} ref={fallbackFocusRef} />

      <Panel
        isOpen={isOpen}
        onDismiss={handleDismiss}
        headerText='Historial de Cambios'
        closeButtonAriaLabel='Cerrar'
        type={PanelType.smallFixedNear}
        styles={{
          main: {
            maxWidth: 'min(100vw, 320px)',
            width: 'auto',
            paddingRight: 16,
          },
        }}
      >
        <div className={styles.contenedorHistorial}>
          {items.map((item, index) => (
            <div key={index} className={styles.historialItem}>
              <div className={styles.filaEstado}>
                <span className={styles.etiqueta}><strong>Estado:</strong></span>
                <span>{item.estadoAnterior}</span>
                <Icon
                  iconName='SkypeArrow'
                  className={styles.iconoEstado}
                  aria-label='flecha derecha'
                />
                <span>{item.estadoPosterior}</span>
              </div>

              <div className={styles.fila}>
                <Icon iconName='Calendar' className={styles.iconoFecha} />
                <span>{item.fecha}</span>
              </div>

              {item.usuario?.trim() && (
                <div className={styles.usuarioManual}>
                  <div className={styles.avatar}>
                    {getInitials(item.usuario)}
                  </div>
                  <span className={styles.usuarioTexto}>{item.usuario}</span>
                </div>
              )}

              {item.observacion?.trim() && (
                <div className={styles.observacion}>{item.observacion}</div>
              )}

              <div className={styles.numeroRegistro}>
                Cambio {index + 1} de {items.length}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
};

function getInitials(usuario: string): string {
  if (!usuario) return '??';
  const base = usuario.includes('@') ? usuario.split('@')[0] : usuario;
  return base
    .split('.')
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || '??';
}

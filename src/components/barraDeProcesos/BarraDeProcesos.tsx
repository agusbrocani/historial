import React from 'react';
import styles from './BarraDeProcesos.module.scss';
import Stepper from '../stepper/Stepper';
import { StepperProps } from '../stepper/Stepper';
import Historial from '../historial/Historial';
import { HistorialProps } from '../historial/Historial';
import { ArrowSyncCheckmark20Regular } from '@fluentui/react-icons';

type BarraProcesoProps = {estado: string} & StepperProps & HistorialProps;

export default function BarraProceso({
  estado,
  pasos,
  stepActual,
  colorGeneral,
  colorAvatar,
  ordenNumeracionCardsDesc,
  items,
  batchSize,
  textoEncabezadoPanel,
  textoToolTipBoton,
  estilosBoton,
  onClosePanel
}: BarraProcesoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.estadoWrapper}>
        <span
          className={styles.estadoCapsula}
          style={{ color: colorGeneral, borderColor: colorGeneral }}
        >
          <ArrowSyncCheckmark20Regular style={{ marginRight: 6 }} />
          {`ESTADO: ${estado ? estado.toUpperCase() : 'SIN ESTADO'}`}
        </span>
      </div>

      <div className={styles.stepperWrapper}>
        <Stepper
          pasos={pasos} 
          stepActual={stepActual}
          colorGeneral={colorGeneral}
        />
      </div>

      <div className={styles.historialWrapper}>
        <Historial 
          items={items} 
          colorGeneral={colorGeneral}
          colorAvatar={colorAvatar}
          ordenNumeracionCardsDesc={ordenNumeracionCardsDesc}
          batchSize={batchSize}
          textoEncabezadoPanel={textoEncabezadoPanel}
          textoToolTipBoton={textoToolTipBoton}
          estilosBoton={estilosBoton}
          onClosePanel={onClosePanel}
        />
      </div>
    </div>
  );
}
 
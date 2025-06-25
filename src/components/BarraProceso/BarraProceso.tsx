import styles from './BarraProceso.module.scss';
import {
  Mail24Regular,
  CloudAdd24Regular,
  Search24Regular,
  Checkmark24Regular,
  ArrowSyncCheckmark20Regular
} from '@fluentui/react-icons';
import Stepper from '../Stepper/ProcesoStepper';
import Historial from '../Historial/Historial';

const pasos = [
  { nombre: 'Solicitud', icono: <Mail24Regular /> },
  { nombre: 'Carga', icono: <CloudAdd24Regular /> },
  { nombre: 'Validación', icono: <Search24Regular /> },
  { nombre: 'Aprobación', icono: <Checkmark24Regular /> },
];

const PASO_STEPPER = {
  SOLICITUD: 1,
  CARGA: 2,
  VALIDACION: 3,
  APROBACION: 4,
};

type Props = {
  estado: string;
  colorGeneral: string;
};

export default function BarraProceso({ estado, colorGeneral }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.estadoWrapper}>
        <span className={styles.estadoCapsula}>
          <ArrowSyncCheckmark20Regular style={{ marginRight: 6 }} />
          {`ESTADO: ${estado.toUpperCase()}`}
        </span>
      </div>

      <div className={styles.stepperWrapper}>
        <Stepper
          pasos={pasos}
          stepActual={PASO_STEPPER.CARGA}
          colorPrincipal={colorGeneral}
        />
      </div>

      <div className={styles.historialWrapper}>
        <Historial items={[]} colorGeneral={colorGeneral} />
      </div>
    </div>
  );
}





// import styles from './BarraProceso.module.scss';
// import {
//   Mail24Regular,
//   CloudAdd24Regular,
//   Search24Regular,
//   Checkmark24Regular,
//   ArrowSyncCheckmark20Regular // NUEVO icono propuesto por vos
// } from '@fluentui/react-icons';
// import Stepper from '../Stepper/ProcesoStepper';
// import Historial from '../Historial/Historial';

// const pasos = [
//   { nombre: 'Solicitud', icono: <Mail24Regular /> },
//   { nombre: 'Carga', icono: <CloudAdd24Regular /> },
//   { nombre: 'Validación', icono: <Search24Regular /> },
//   { nombre: 'Aprobación', icono: <Checkmark24Regular /> },
// ];

// const PASO_STEPPER = {
//   SOLICITUD: 1,
//   CARGA: 2,
//   VALIDACION: 3,
//   APROBACION: 4,
// };

// type Props = {
//   estado: string;
//   colorGeneral: string;
// };

// export default function BarraProceso({ estado, colorGeneral }: Props) {
//   return (
//     <div className={styles.container}>
//       <div className={styles.estadoWrapper}>
//         <span className={styles.estadoCapsula} style={{ color: colorGeneral }}>
//           <ArrowSyncCheckmark20Regular />
//           {estado.toUpperCase()}
//         </span>
//       </div>

//       <div className={styles.stepperWrapper}>
//         <Stepper
//           pasos={pasos}
//           stepActual={PASO_STEPPER.CARGA}
//           colorPrincipal={colorGeneral}
//         />
//       </div>

//       <div className={styles.historialWrapper}>
//         <Historial items={[]} colorGeneral={colorGeneral} />
//       </div>
//     </div>
//   );
// }




// import styles from './BarraProceso.module.scss';
// import {
//   Mail24Regular,
//   CloudAdd24Regular,
//   Search24Regular,
//   Checkmark24Regular,
//   Info24Regular // Ícono genérico para "estado"
// } from '@fluentui/react-icons';
// import Stepper from '../Stepper/ProcesoStepper';
// import Historial from '../Historial/Historial';

// const pasos = [
//   { nombre: 'Solicitud', icono: <Mail24Regular /> },
//   { nombre: 'Carga', icono: <CloudAdd24Regular /> },
//   { nombre: 'Validación', icono: <Search24Regular /> },
//   { nombre: 'Aprobación', icono: <Checkmark24Regular /> },
// ];

// const PASO_STEPPER = {
//   SOLICITUD: 1,
//   CARGA: 2,
//   VALIDACION: 3,
//   APROBACION: 4,
// };

// type Props = {
//   estado: string;
//   colorGeneral: string;
// };

// export default function BarraProceso({ estado, colorGeneral }: Props) {
//   return (
//     <div className={styles.container}>
//       <div className={styles.estadoWrapper}>
//         <Info24Regular className={styles.estadoIcono} style={{ color: colorGeneral }} />
//         <span className={styles.estadoLabel}>Estado:</span>
//         <span className={styles.estadoValor} style={{ color: colorGeneral }}>
//           {estado}
//         </span>
//       </div>

//       <div className={styles.stepperWrapper}>
//         <Stepper
//           pasos={pasos}
//           stepActual={PASO_STEPPER.CARGA}
//           colorPrincipal={colorGeneral}
//         />
//       </div>

//       <div className={styles.historialWrapper}>
//         <Historial items={[]} colorGeneral={colorGeneral} />
//       </div>
//     </div>
//   );
// }


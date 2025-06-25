import styles from './ProcesoStepper.module.scss';

type Paso = {
  nombre: string;
  icono: React.ReactNode;
};

type ProcesoStepperProps = {
  pasos: Paso[];
  stepActual: number;
  colorPrincipal?: string;
};

export default function ProcesoStepper({
  pasos,
  stepActual,
  colorPrincipal = '#000000',
}: ProcesoStepperProps) {
  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepper}>
        {pasos.map((paso, index) => {
          const pasoNumero = index + 1;
          const esActual = pasoNumero === stepActual;
          const esPrevio = pasoNumero < stepActual;

          return (
            <div key={`${paso.nombre}-${index}`} className={styles.step}>
              <div
                className={`${styles.iconWrapper} ${
                  esActual
                    ? styles.actual
                    : esPrevio
                    ? styles.completado
                    : styles.pendiente
                }`}
                style={esActual ? { backgroundColor: colorPrincipal } : undefined}
              >
                {paso.icono}
              </div>
              <span
                className={`${styles.nombrePaso} ${
                  esActual ? styles.actualText : ''
                }`}
                style={esActual ? { color: colorPrincipal } : undefined}
              >
                {paso.nombre}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

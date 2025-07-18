import React from 'react';
import styles from './Stepper.module.scss';

export type Paso = {
  nombre: string;
  icono: React.ReactNode;
};

export type StepperProps = {
  pasos: Paso[];
  stepActual: number;
  colorGeneral?: string;
};

function aclararColor(color: string | null | undefined, factor: number = 0.4): string {
  const HEX_LENGTH_SHORT = 3;
  const HEX_LENGTH_FULL = 6;
  const RGB_MAX = 255;
  const DEFAULT_RGB_COMPONENT = 200;
  const RGB_FALLBACK = `rgb(${DEFAULT_RGB_COMPONENT}, ${DEFAULT_RGB_COMPONENT}, ${DEFAULT_RGB_COMPONENT})`;

  if (typeof color !== 'string' || !color.startsWith('#')) return RGB_FALLBACK;

  const hex = color.slice(1);
  const isValidHex = /^[0-9a-fA-F]+$/.test(hex);
  if (![HEX_LENGTH_SHORT, HEX_LENGTH_FULL].includes(hex.length) || !isValidHex) {
    return RGB_FALLBACK;
  }

  const fullHex = hex.length === HEX_LENGTH_SHORT
    ? hex.split('').map(c => c + c).join('')
    : hex;

  const num = parseInt(fullHex, 16);
  const red = (num >> 16) & 0xff;
  const green = (num >> 8) & 0xff;
  const blue = num & 0xff;

  const blend = (value: number) =>
    Math.round(value * factor + RGB_MAX * (1 - factor));

  return `rgb(${blend(red)}, ${blend(green)}, ${blend(blue)})`;
}

export default function Stepper({
  pasos,
  stepActual,
  colorGeneral = '#000000',
}: StepperProps) {
  let totalSteps;
  let pasosCompletadosForzados;
  if (pasos) {
    totalSteps = pasos.length;
    pasosCompletadosForzados = stepActual < 1 || stepActual > totalSteps;
  }

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepper}>
        {pasos && pasos.map((paso, index) => {
          if (!paso) {
            return
          }
          const pasoNumero = index + 1;
          const esActual = !pasosCompletadosForzados && pasoNumero === stepActual;
          const esPrevio = pasosCompletadosForzados || pasoNumero < stepActual;

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
                style={{
                  backgroundColor: esActual
                    ? colorGeneral
                    : esPrevio
                    ? aclararColor(colorGeneral)
                    : '',
                }}
              >
                {paso.icono}
              </div>
              <span
                className={`${styles.nombrePaso} ${
                  esActual ? styles.actualText : ''
                }`}
                style={{ color: esActual ? colorGeneral : '' }}
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

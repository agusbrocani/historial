import { ReactNode } from "react";

export interface IHistorialItem {
  estadoUnico?: string;
  estadoAnterior?: string;
  estadoPosterior?: string;
  usuario: string;
  fecha: string;
  hora: string;
  // observacion: string;
  renderizable?: ReactNode[];
}

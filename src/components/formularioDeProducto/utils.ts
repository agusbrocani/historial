import { IArea, ILineaDeNegocio, ISeccion } from "../gestionDeProductos/tipos";

export const obtenerAreasPorLinea = (lineaSeleccionada: ILineaDeNegocio, areas: IArea[]): IArea[] | null => !areas? null : areas.filter((a) => a?.LineaNegocioId === Number(lineaSeleccionada?.key));
export const obtenerSeccionesPorArea = (areaSeleccionada: IArea, secciones: ISeccion[]): ISeccion[] | null =>!secciones? null : secciones.filter((s) => s?.AreaId === areaSeleccionada?.Id);

import { IArea, ILineaDeNegocio, IProducto, IProductoFormulario, ISeccion } from "../gestionDeProductos/tipos";

export const obtenerAreasPorLinea = (lineaSeleccionada: ILineaDeNegocio, areas: IArea[]): IArea[] | null => !areas? null : areas.filter((a) => a?.LineaNegocioId === Number(lineaSeleccionada?.key));
export const obtenerSeccionesPorArea = (areaSeleccionada: IArea, secciones: ISeccion[]): ISeccion[] | null =>!secciones? null : secciones.filter((s) => s?.AreaId === areaSeleccionada?.Id);

export const transformarProducto = (
  p: IProductoFormulario,
): IProducto => ({
  Id: null,
  Titulo: p.producto,
  LineaNegocioId: parseInt(p.lineaDeNegocio.key),
  AreaId: p.area.Id,
  SeccionId: p.seccion.Id,
  EnCatalogo: p.enCatalogo,
  CantidadFDS: p.cantidadDeFds,
  CantidadFIE: p.cantidadDeFie,
  IdViejoFDS: p.idViejoFds,
  IdViejoFIE: p.idViejoFie
});
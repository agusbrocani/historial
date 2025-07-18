import { IProducto, IProductoExtendido, ILineaDeNegocio, IArea, ISeccion } from './tipos';

export function contruirProductosBuscables(
  productos: IProducto[],
  lineas: ILineaDeNegocio[],
  areas: IArea[],
  secciones: ISeccion[],
): IProductoExtendido[] {
  if (!productos || !lineas || !areas || !secciones) {
    console.warn('contruirProductosBuscables: uno o más parámetros son nulos o indefinidos');
    return [];
  }

  return productos.map((producto): IProductoExtendido => {
    const linea = lineas.find(l => parseInt(l.key) === producto.LineaNegocioId) ?? null;
    const area = areas.find(a => a.Id === producto.AreaId) ?? null;
    const seccion = secciones.find(s => s.Id === producto.SeccionId) ?? null;

    return {
      Id: producto.Id,
      Titulo: producto.Titulo,
      LineaNegocio: linea?.text ?? null,
      Area: area?.Titulo ?? null,
      Seccion: seccion?.Titulo ?? null,
      EnCatalogoTexto:
        producto.EnCatalogo === true ? 'Sí' :
        producto.EnCatalogo === false ? 'No' : null,
      CantidadFDS: producto.CantidadFDS,
      CantidadFIE: producto.CantidadFIE,
      IdViejoFDS: producto.IdViejoFDS,
      IdViejoFIE: producto.IdViejoFIE,
    };
  });
}

export function filtrarProductosPorIds(
  productos: IProducto[] | null | undefined,
  productosExtendidos: IProductoExtendido[] | null | undefined
): IProducto[] {
  if (!productos || !productosExtendidos) {
    console.warn('filtrarProductosPorIds: uno o ambos arrays son nulos o indefinidos');
    return [];
  }

  return productosExtendidos
    .map(ext => productos.find(p => p.Id === ext.Id))
    .filter((p): p is IProducto => p !== undefined);
}
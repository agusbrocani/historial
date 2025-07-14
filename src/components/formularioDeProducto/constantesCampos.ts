// constante que representa las claves internas
export enum ClaveCampo {
  Producto = 'producto',
  LineaDeNegocio = 'lineaDeNegocio',
  Area = 'area',
  Seccion = 'seccion',
  EnCatalogo = 'enCatalogo',
  CantidadFDS = 'cantidadFDS',
  CantidadFIE = 'cantidadFIE',
  IdViejoFDS = 'idViejoFDS',
  IdViejoFIE = 'idViejoFIE',
}

// diccionario legible para mostrar en UI
export const NOMBRE_CAMPO_LEIBLE: Record<ClaveCampo, string> = {
  [ClaveCampo.Producto]: 'Producto',
  [ClaveCampo.LineaDeNegocio]: 'Línea de Negocio',
  [ClaveCampo.Area]: 'Área',
  [ClaveCampo.Seccion]: 'Sección',
  [ClaveCampo.EnCatalogo]: 'En Catálogo',
  [ClaveCampo.CantidadFDS]: 'Cantidad de FDS',
  [ClaveCampo.CantidadFIE]: 'Cantidad de FIE',
  [ClaveCampo.IdViejoFDS]: 'Id Viejo FDS',
  [ClaveCampo.IdViejoFIE]: 'Id Viejo FIE',
};

export interface ProductoData {
  [ClaveCampo.Producto]: string;
  [ClaveCampo.LineaDeNegocio]: string;
  [ClaveCampo.Area]: string;
  [ClaveCampo.Seccion]: string;
  [ClaveCampo.EnCatalogo]: 'Sí' | 'No';
  [ClaveCampo.CantidadFDS]: number | null;
  [ClaveCampo.CantidadFIE]: number | null;
  [ClaveCampo.IdViejoFDS]: number | null;
  [ClaveCampo.IdViejoFIE]: number | null;
}
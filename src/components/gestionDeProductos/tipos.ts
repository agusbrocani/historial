export interface ILineaDeNegocio {
  key: string;
  text: string;
}
export interface IArea {
  Id: number;
  Titulo: string;
  LineaNegocioId: number;
  ResponsableId: number | null;
}
export interface ISeccion {
  Id: number;
  Titulo: string;
  AreaId: number;
}
export interface IProducto {
  Id: number | null;
  Titulo: string;
  AreaId: number;
  SeccionId: number;
  LineaNegocioId: number;
  EnCatalogo: boolean;
  CantidadFDS: number | null;
  CantidadFIE: number | null;
  IdViejoFDS: number | null;
  IdViejoFIE: number | null;
}

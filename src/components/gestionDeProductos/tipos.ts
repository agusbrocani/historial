export interface IProducto {
  producto: string;
  lineaDeNegocio: string;
  area: string;
  seccion: string;
  enCatalogo: boolean | string;
  cantidadDeFds: number;
  cantidadDeFie: number;
  idViejoFds: number;
  idViejoFie: number;
}

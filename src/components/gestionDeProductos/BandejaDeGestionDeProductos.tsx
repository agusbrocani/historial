import React from 'react';
import { Spinner } from '@fluentui/react/lib/Spinner';
import estilos from './BandejaDeGestionDeProductos.module.scss';
import { IProducto } from './tipos';
import { columnasProducto } from './Columnas';
import CustomTooltip from './CustomTooltip';

interface PropsBandeja {
  productos: IProducto[] | null;
  cargando: boolean;
}

export const BandejaDeGestionDeProductos: React.FC<PropsBandeja> = ({ productos, cargando }) => {
  return (
    <div className={estilos.contenedorTabla}>
      <div className={estilos.encabezado}>
        <button className={estilos.botonNuevo}>+ Nuevo</button>
      </div>

      {cargando ? (
        <div className={estilos.spinnerContainer}>
          <Spinner label="Cargando productos..." />
        </div>
      ) : (
        <div className={estilos.wrapper}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                {columnasProducto.map((col) => (
                  <th key={col.clave} className={estilos.celdaEncabezado}>{col.encabezado}</th>
                ))}
              </tr>
            </thead>
          </table>
          <div className={estilos.scrollBody}>
            <table className={estilos.tabla}>
              <tbody>
                {productos && productos.length > 0 ? (
                  productos.map((producto, indice) => (
                    <tr key={indice}>
                      {columnasProducto.map((col) => {
                        const valor = producto[col.clave as keyof IProducto]?.toString() || '';
                        const debeTruncar = valor.length > 30;

                        return (
                          <td key={col.clave}>
                            {debeTruncar ? (
                              <CustomTooltip content={valor}>
                                <span className={estilos.truncado}>{valor}</span>
                              </CustomTooltip>
                            ) : (
                              valor
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columnasProducto.length} className={estilos.sinDatos}>
                      No hay productos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

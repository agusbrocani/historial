import React, { useEffect, useRef, useState } from 'react';
import { IProducto } from './tipos';
import {
  IconButton,
  PrimaryButton,
  TooltipHost,
  TooltipOverflowMode
} from '@fluentui/react';
import styles from './BandejaDeGestionDeProductos.module.scss';

interface Props {
  productos: IProducto[];
  onEditar: (producto: IProducto) => void;
  onEliminar: (producto: IProducto) => void;
  onAgregar: () => void;
}

const ITEMS_POR_CARGA = 10;

const BandejaDeGestionDeProductos: React.FC<Props> = ({
  productos,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  const [productosVisibles, setProductosVisibles] = useState<IProducto[]>([]);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Array.isArray(productos) && productos.length > 0) {
      setProductosVisibles(productos.slice(0, ITEMS_POR_CARGA));
    }
  }, [productos]);

  const cargarMas = () => {
    const siguiente = productosVisibles.length + ITEMS_POR_CARGA;
    setProductosVisibles(productos.slice(0, siguiente));
  };

  const manejarScroll = () => {
    if (!contenedorRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contenedorRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      cargarMas();
    }
  };

  const formatear = (valor: any) => {
    if (valor === null || valor === undefined) return '-';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    return valor;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.barraSuperior}>
        <PrimaryButton
          text="Nuevo"
          iconProps={{ iconName: 'Add' }}
          onClick={onAgregar}
        />
      </div>

      <div className={styles.tabla} ref={contenedorRef} onScroll={manejarScroll}>
        <div className={`${styles.fila} ${styles.encabezado}`}>
          <div>ID</div>
          <div>Producto</div>
          <div>Línea De Negocio</div>
          <div>Área</div>
          <div>Sección</div>
          <div>En Catálogo</div>
          <div>Cantidad De FDS</div>
          <div>Cantidad De FIE</div>
          <div>Id Viejo FDS</div>
          <div>Id Viejo FIE</div>
          <div>Editar</div>
          <div>Eliminar</div>
        </div>

        {productosVisibles.map((p) => (
          <div className={styles.fila} key={p.Id ?? Math.random()}>
            <div>{formatear(p.Id)}</div>
            <TooltipHost content={formatear(p.Titulo)} overflowMode={TooltipOverflowMode.Parent}>
              <div className={styles.truncado}>{formatear(p.Titulo)}</div>
            </TooltipHost>
            <div>{formatear(p.LineaNegocioId)}</div>
            <div>{formatear(p.AreaId)}</div>
            <div>{formatear(p.SeccionId)}</div>
            <div>{formatear(p.EnCatalogo)}</div>
            <div>{formatear(p.CantidadFDS)}</div>
            <div>{formatear(p.CantidadFIE)}</div>
            <div>{formatear(p.IdViejoFDS)}</div>
            <div>{formatear(p.IdViejoFIE)}</div>
            <div>
              <IconButton iconProps={{ iconName: 'Edit' }} title="Editar" onClick={() => onEditar(p)} />
            </div>
            <div>
              <IconButton iconProps={{ iconName: 'Delete' }} title="Eliminar" onClick={() => onEliminar(p)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandejaDeGestionDeProductos;

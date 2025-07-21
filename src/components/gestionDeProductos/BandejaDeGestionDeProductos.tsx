import React, { useEffect, useRef, useState } from 'react';
import { IArea, ILineaDeNegocio, IProducto, ISeccion } from './tipos';
import {
  IconButton,
  PrimaryButton,
  TooltipHost,
  DirectionalHint,
  TooltipDelay
} from '@fluentui/react';
import styles from './BandejaDeGestionDeProductos.module.scss';
import Buscador from '../buscador/Buscador';

interface Props {
  productos: IProducto[];
  lineasDeNegocio: ILineaDeNegocio[];
  areas: IArea[];
  secciones: ISeccion[];
  onEditar: (producto: IProducto) => void;
  onEliminar: (producto: IProducto) => void;
  onAgregar: () => void;
}

const ITEMS_POR_CARGA = 10;

const BandejaDeGestionDeProductos: React.FC<Props> = ({
  productos,
  lineasDeNegocio,
  areas,
  secciones,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  const [productosFiltrados, setProductosFiltrados] = useState<IProducto[]>(productos);
  const [productosVisibles, setProductosVisibles] = useState<IProducto[]>([]);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // sincroniza cuando cambia el array completo
  useEffect(() => {
    setProductosFiltrados(productos);
  }, [productos]);

  // sincroniza cuando cambia el filtrado
  useEffect(() => {
    setProductosVisibles(productosFiltrados.slice(0, ITEMS_POR_CARGA));
  }, [productosFiltrados]);

  const cargarMas = () => {
    const siguiente = productosVisibles.length + ITEMS_POR_CARGA;
    setProductosVisibles(productosFiltrados.slice(0, siguiente));
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

  const obtenerTextoLinea = (id: number) => {
    const linea = lineasDeNegocio.find((l) => parseInt(l.key) === id);
    return linea?.text ?? '-';
  };

  const obtenerTituloArea = (id: number) => {
    const area = areas.find((a) => a.Id === id);
    return area?.Titulo ?? '-';
  };

  const obtenerTituloSeccion = (id: number) => {
    const seccion = secciones.find((s) => s.Id === id);
    return seccion?.Titulo ?? '-';
  };

  const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);
  useEffect(() => {
    const manejarResize = () => setAnchoPantalla(window.innerWidth);
    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.barraSuperior}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Buscador
            productos={productos}
            lineasDeNegocio={lineasDeNegocio}
            areas={areas}
            secciones={secciones}
            setProductosVisibles={setProductosFiltrados} // clave: usar productosFiltrados
          />
          <PrimaryButton
            text="Nuevo"
            iconProps={{ iconName: 'Add' }}
            onClick={onAgregar}
          />
        </div>
      </div>

      <div className={styles.tabla} ref={contenedorRef} onScroll={manejarScroll}>
        <div className={`${styles.fila} ${styles.encabezado}`}>
          <div>ID</div>
          <div>Producto</div>
          <div>Línea de Negocio</div>
          <div>Área</div>
          <div>Sección</div>
          {anchoPantalla < 1040 ? (
            <TooltipHost
              content="En catálogo"
              directionalHint={DirectionalHint.topCenter}
              delay={TooltipDelay.zero}
              calloutProps={{
                isBeakVisible: false,
                gapSpace: 0,
                layerProps: {
                  styles: {
                    root: {
                      background: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      padding: 0,
                      margin: 0
                    }
                  }
                },
                styles: {
                  root: {
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0
                  },
                  calloutMain: {
                    backgroundColor: '#fff',
                    border: '1px solid #edebe9',
                    borderRadius: 4,
                    padding: 6,
                    fontFamily: 'Segoe UI',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#323130',
                    textAlign: 'center',
                    maxWidth: 140,
                    boxShadow: 'none'
                  }
                }
              }}
            >
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 14
                }}
              >
                ...
              </div>
            </TooltipHost>
          ) : (
            <div>
              {anchoPantalla < 1389 ? (
                <>
                  En<br />
                  catálogo
                </>
              ) : (
                'En catálogo'
              )}
            </div>
          )}
          <div>Cantidad de FDS</div>
          <div>Cantidad de FIE</div>
          <div>Id viejo FDS</div>
          <div>Id viejo FIE</div>
          <div>Editar</div>
          <div>Eliminar</div>
        </div>

        {productosVisibles.map((p) => (
          <div className={styles.fila} key={p.Id}>
            <div>{formatear(p.Id)}</div>
            <div>{formatear(p.Titulo)}</div>
            <div>{obtenerTextoLinea(p.LineaNegocioId)}</div>
            <div>{obtenerTituloArea(p.AreaId)}</div>
            <div>{obtenerTituloSeccion(p.SeccionId)}</div>
            <div>{formatear(p.EnCatalogo)}</div>
            <div className={styles.cellBreakable}>{formatear(p.CantidadFDS)}</div>
            <div className={styles.cellBreakable}>{formatear(p.CantidadFIE)}</div>
            <div className={styles.cellBreakable}>{formatear(p.IdViejoFDS)}</div>
            <div className={styles.cellBreakable}>{formatear(p.IdViejoFIE)}</div>

            <div className={styles.celdaCentrada}>
              <IconButton
                iconProps={{ iconName: 'Edit' }}
                title="Editar"
                onClick={() => onEditar(p)}
              />
            </div>
            <div className={styles.celdaCentrada}>
              <IconButton
                iconProps={{ iconName: 'Delete' }}
                title="Eliminar"
                onClick={() => onEliminar(p)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandejaDeGestionDeProductos;

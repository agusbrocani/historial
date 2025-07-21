import React, { useState } from 'react';
import {
  SearchBox,
  DefaultButton,
  ISearchBoxStyles
} from '@fluentui/react';
import {
  buscar,
  definirIndicesResultadoPorPalabraEncontrada
} from './buscadorUtils';
import {
  IArea,
  ILineaDeNegocio,
  IProducto,
  ISeccion
} from '../gestionDeProductos/tipos';
import {
  contruirProductosBuscables,
  filtrarProductosPorIds
} from '../gestionDeProductos/utils';

interface Props {
  productos: IProducto[];
  lineasDeNegocio: ILineaDeNegocio[];
  areas: IArea[];
  secciones: ISeccion[];
  setProductosVisibles: (productos: IProducto[]) => void;
}

const Buscador: React.FC<Props> = ({
  productos,
  lineasDeNegocio,
  areas,
  secciones,
  setProductosVisibles,
}) => {
  const [termino, setTermino] = useState('');

  const estilosSearchBox: ISearchBoxStyles = {
    root: { width: 250, height: 32 },
  };

  const ejecutarBusqueda = (texto: string) => {
    const valor = texto.trim();
    console.log("Termino: ", valor);

    if (valor === '') {
      setProductosVisibles(productos);
      return;
    }

    const resultado = buscar(
      contruirProductosBuscables(productos, lineasDeNegocio, areas, secciones),
      valor,
      definirIndicesResultadoPorPalabraEncontrada
    );

    const productosFiltrados = filtrarProductosPorIds(productos, resultado);
    console.log("Resultado ", productosFiltrados);
    setProductosVisibles(productosFiltrados);

    setTermino(''); // Limpiar el input después de la búsqueda
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setProductosVisibles(productos); // muestra todos
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <SearchBox
        placeholder="Buscar producto…"
        value={termino}
        onChange={(_, nuevoValor) => {
          const valor = nuevoValor || '';
          setTermino(valor);
          if (valor.trim() === '') {
            setProductosVisibles(productos);
          }
        }}
        onClear={limpiarBusqueda}
        onSearch={(valor) => ejecutarBusqueda(valor || '')}
        underlined
        styles={estilosSearchBox}
      />
      <DefaultButton
        text="Buscar"
        onClick={() => ejecutarBusqueda(termino)}
        styles={{ root: { height: 32 } }}
      />
    </div>
  );
};

export default Buscador;

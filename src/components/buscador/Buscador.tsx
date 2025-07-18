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

  const ejecutarBusqueda = () => {
    console.log("Termino: ", termino);
    if (termino.trim() === '') {
        return;
    }

    const resultado = buscar(
      contruirProductosBuscables(productos, lineasDeNegocio, areas, secciones),
      termino,
      definirIndicesResultadoPorPalabraEncontrada
    );
    console.log("Productos", productos);
    console.log("Resultado ", filtrarProductosPorIds(productos, resultado));
    setProductosVisibles(filtrarProductosPorIds(productos, resultado));
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
        underlined
        styles={estilosSearchBox}
      />
      <DefaultButton
        text="Buscar"
        onClick={ejecutarBusqueda}
        styles={{ root: { height: 32 } }}
      />
    </div>
  );
};

export default Buscador;

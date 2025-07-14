import React, { useState, useEffect } from 'react';
import {
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton
} from '@fluentui/react';
import styles from './FormularioDeProducto.module.scss';

interface Props {
  lineasDeNegocio: string[];
  areasPorLinea: Record<string, string[]>;
  seccionesPorArea: Record<string, string[]>;
  onGuardar: (data: any) => void;
}

const FormularioDeProducto: React.FC<Props> = ({
  lineasDeNegocio,
  areasPorLinea,
  seccionesPorArea,
  onGuardar
}) => {
  const [producto, setProducto] = useState('');
  const [linea, setLinea] = useState('');
  const [area, setArea] = useState('');
  const [seccion, setSeccion] = useState('');
  const [enCatalogo, setEnCatalogo] = useState('No');
  const [cantidadFDS, setCantidadFDS] = useState(0);
  const [cantidadFIE, setCantidadFIE] = useState(0);
  const [idViejoFDS, setIdViejoFDS] = useState('');
  const [idViejoFIE, setIdViejoFIE] = useState('');
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<any>(null);

  const opcionesDropdown = (items: string[]): IDropdownOption[] =>
    items.map((item) => ({ key: item, text: item }));

  const handleSubmit = () => {
    const camposValidos = producto && linea && area && seccion;

    if (!camposValidos) {
      setError(true);
      setExito(false);
      return;
    }

    const nuevoProducto = {
      producto,
      lineaDeNegocio: linea,
      area,
      seccion,
      enCatalogo,
      cantidadFDS,
      cantidadFIE,
      idViejoFDS,
      idViejoFIE
    };

    setError(false);
    setExito(true);
    setProductoPendiente(nuevoProducto);
  };

  useEffect(() => {
    if (exito && productoPendiente) {
      onGuardar(productoPendiente);
      setProductoPendiente(null);
    }
  }, [exito, productoPendiente, onGuardar]);

  const handleCancelar = () => {
    setProducto('');
    setLinea('');
    setArea('');
    setSeccion('');
    setEnCatalogo('No');
    setCantidadFDS(0);
    setCantidadFIE(0);
    setIdViejoFDS('');
    setIdViejoFIE('');
    setError(false);
    setExito(false);
  };

  const areasDisponibles = linea ? areasPorLinea[linea] || [] : [];
  const seccionesDisponibles = area ? seccionesPorArea[area] || [] : [];

  return (
    <div className={styles.contenedorFormulario}>
      <h2 className={styles.titulo}>Nuevo Producto</h2>

      <div className={styles.fila}>
        <TextField
          label="Producto"
          required
          value={producto}
          onChange={(_, v) => setProducto(v || '')}
        />
      </div>

      <fieldset className={styles.grupoCampos}>
        <legend className={styles.tituloGrupo}>Ubicación en la estructura</legend>

        <div className={styles.fila}>
          <Dropdown
            label="Línea De Negocio"
            required
            options={opcionesDropdown(lineasDeNegocio)}
            selectedKey={linea}
            onChange={(_, o) => {
              setLinea(o?.key as string);
              setArea('');
              setSeccion('');
            }}
          />
        </div>

        <div className={styles.fila}>
          <Dropdown
            label="Área"
            required
            options={opcionesDropdown(areasDisponibles)}
            selectedKey={area}
            onChange={(_, o) => {
              setArea(o?.key as string);
              setSeccion('');
            }}
            disabled={!linea}
          />
        </div>

        <div className={styles.fila}>
          <Dropdown
            label="Sección"
            required
            options={opcionesDropdown(seccionesDisponibles)}
            selectedKey={seccion}
            onChange={(_, o) => setSeccion(o?.key as string)}
            disabled={!area}
          />
        </div>
      </fieldset>

      <div className={styles.fila}>
        <Dropdown
          label="En Catálogo"
          options={[
            { key: 'Sí', text: 'Sí' },
            { key: 'No', text: 'No' }
          ]}
          selectedKey={enCatalogo}
          onChange={(_, o) => setEnCatalogo(o?.key as string)}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Cantidad de FDS"
          type="number"
          value={cantidadFDS.toString()}
          onChange={(_, v) => setCantidadFDS(Math.max(0, Number(v)))}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Cantidad de FIE"
          type="number"
          value={cantidadFIE.toString()}
          onChange={(_, v) => setCantidadFIE(Math.max(0, Number(v)))}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Id Viejo FDS"
          value={idViejoFDS}
          onChange={(_, v) => setIdViejoFDS(v || '')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Id Viejo FIE"
          value={idViejoFIE}
          onChange={(_, v) => setIdViejoFIE(v || '')}
        />
      </div>

      {error && (
        <div className={styles.error}>
          Por favor complete todos los campos obligatorios.
        </div>
      )}

      {exito && (
        <div className={styles.exito}>
          Producto agregado exitosamente.
        </div>
      )}

      <div className={styles.botones}>
        <PrimaryButton onClick={handleSubmit}>Agregar producto</PrimaryButton>
        <DefaultButton onClick={handleCancelar}>Cancelar</DefaultButton>
      </div>
    </div>
  );
};

export default FormularioDeProducto;

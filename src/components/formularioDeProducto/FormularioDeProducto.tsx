import React, { useState } from 'react';
import { TextField, Dropdown, IDropdownOption, PrimaryButton, DefaultButton } from '@fluentui/react';
import styles from './FormularioDeProducto.module.scss';

interface Props {
  lineasDeNegocio: string[];
  areasPorLinea: Record<string, string[]>;
  seccionesPorArea: Record<string, string[]>;
  onGuardar: (data: any) => void;
}

const FormularioDeProducto: React.FC<Props> = ({ lineasDeNegocio, areasPorLinea, seccionesPorArea, onGuardar }) => {
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

  const opcionesDropdown = (items: string[]): IDropdownOption[] =>
    items.map((item) => ({ key: item, text: item }));

  const handleSubmit = () => {
    if (!producto || !linea || !area || !seccion) {
      setError(true);
      return;
    }
    setError(false);
    onGuardar({
      producto,
      lineaDeNegocio: linea,
      area,
      seccion,
      enCatalogo,
      cantidadFDS,
      cantidadFIE,
      idViejoFDS,
      idViejoFIE,
    });
  };

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
  };

  const areasDisponibles = linea ? areasPorLinea[linea] || [] : [];
  const seccionesDisponibles = area ? seccionesPorArea[area] || [] : [];

  return (
    <div className={styles.contenedorFormulario}>
      <h2>Nuevo Producto</h2>
      <div className={styles.grid}>
        <TextField
          label="Producto"
          required
          value={producto}
          onChange={(_, v) => setProducto(v || '')}
        />
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
        <Dropdown
          label="Sección"
          required
          options={opcionesDropdown(seccionesDisponibles)}
          selectedKey={seccion}
          onChange={(_, o) => setSeccion(o?.key as string)}
          disabled={!area}
        />
        <Dropdown
          label="En Catálogo"
          options={[
            { key: 'Sí', text: 'Sí' },
            { key: 'No', text: 'No' },
          ]}
          selectedKey={enCatalogo}
          onChange={(_, o) => setEnCatalogo(o?.key as string)}
        />
        <TextField
          label="Cantidad de FDS"
          type="number"
          value={cantidadFDS.toString()}
          onChange={(_, v) => setCantidadFDS(Math.max(0, Number(v)))}
        />
        <TextField
          label="Cantidad de FIE"
          type="number"
          value={cantidadFIE.toString()}
          onChange={(_, v) => setCantidadFIE(Math.max(0, Number(v)))}
        />
        <TextField
          label="Id Viejo FDS"
          value={idViejoFDS}
          onChange={(_, v) => setIdViejoFDS(v || '')}
        />
        <TextField
          label="Id Viejo FIE"
          value={idViejoFIE}
          onChange={(_, v) => setIdViejoFIE(v || '')}
        />

        {error && (
          <div className={styles.mensajeError}>
            Por favor complete todos los campos obligatorios.
          </div>
        )}

        <div className={styles.botones}>
          <PrimaryButton onClick={handleSubmit}>Agregar producto</PrimaryButton>
          <DefaultButton onClick={handleCancelar}>Cancelar</DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default FormularioDeProducto;

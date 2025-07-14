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
  const [cantidadFDS, setCantidadFDS] = useState('');
  const [cantidadFIE, setCantidadFIE] = useState('');
  const [idViejoFDS, setIdViejoFDS] = useState('');
  const [idViejoFIE, setIdViejoFIE] = useState('');
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<any>(null);
  const [bloqueado, setBloqueado] = useState(false); // 🔒 Nuevo estado

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
      cantidadFDS: cantidadFDS === '' ? null : Number(cantidadFDS),
      cantidadFIE: cantidadFIE === '' ? null : Number(cantidadFIE),
      idViejoFDS: idViejoFDS || null,
      idViejoFIE: idViejoFIE || null
    };

    setError(false);
    setExito(true);
    setProductoPendiente(nuevoProducto);
    setBloqueado(true); // 🔒 Bloqueo real
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
    setCantidadFDS('');
    setCantidadFIE('');
    setIdViejoFDS('');
    setIdViejoFIE('');
    setError(false);
    setExito(false);
    setBloqueado(false);
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
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setProducto(v || '')}
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
            disabled={bloqueado}
            onChange={(_, o) => {
              if (bloqueado) return;
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
            disabled={!linea || bloqueado}
            onChange={(_, o) => {
              if (bloqueado) return;
              setArea(o?.key as string);
              setSeccion('');
            }}
          />
        </div>

        <div className={styles.fila}>
          <Dropdown
            label="Sección"
            required
            options={opcionesDropdown(seccionesDisponibles)}
            selectedKey={seccion}
            disabled={!area || bloqueado}
            onChange={(_, o) => !bloqueado && setSeccion(o?.key as string)}
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
          disabled={bloqueado}
          onChange={(_, o) => !bloqueado && setEnCatalogo(o?.key as string)}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Cantidad de FDS"
          type="number"
          value={cantidadFDS}
          disabled={bloqueado}
          onChange={(_, v) => {
            if (bloqueado) return;
            setCantidadFDS(v ?? '');
          }}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Cantidad de FIE"
          type="number"
          value={cantidadFIE}
          disabled={bloqueado}
          onChange={(_, v) => {
            if (bloqueado) return;
            setCantidadFIE(v ?? '');
          }}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Id Viejo FDS"
          value={idViejoFDS}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setIdViejoFDS(v ?? '')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label="Id Viejo FIE"
          value={idViejoFIE}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setIdViejoFIE(v ?? '')}
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
        <PrimaryButton onClick={handleSubmit} disabled={bloqueado}>
          Agregar producto
        </PrimaryButton>
        <DefaultButton onClick={handleCancelar} disabled={bloqueado}>
          Cancelar
        </DefaultButton>
      </div>
    </div>
  );
};

export default FormularioDeProducto;

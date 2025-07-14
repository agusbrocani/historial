import React, { useState, useEffect } from 'react';
import {
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import styles from './FormularioDeProducto.module.scss';
import { ClaveCampo, NOMBRE_CAMPO_LEIBLE } from './constantesCampos';

interface ProductoData {
  [ClaveCampo.Producto]: string;
  [ClaveCampo.LineaDeNegocio]: string;
  [ClaveCampo.Area]: string;
  [ClaveCampo.Seccion]: string;
  [ClaveCampo.EnCatalogo]: 'Sí' | 'No';
  [ClaveCampo.CantidadFDS]: number | null;
  [ClaveCampo.CantidadFIE]: number | null;
  [ClaveCampo.IdViejoFDS]: number | null;
  [ClaveCampo.IdViejoFIE]: number | null;
}

interface Props {
  lineasDeNegocio: string[];
  areasPorLinea: Record<string, string[]>;
  seccionesPorArea: Record<string, string[]>;
  onGuardar: (data: ProductoData) => void;
  productoAEditar?: ProductoData;
}

const FormularioDeProducto: React.FC<Props> = ({
  lineasDeNegocio,
  areasPorLinea,
  seccionesPorArea,
  onGuardar,
  productoAEditar
}) => {
  const [producto, setProducto] = useState(productoAEditar?.producto || '');
  const [linea, setLinea] = useState(productoAEditar?.lineaDeNegocio || '');
  const [area, setArea] = useState(productoAEditar?.area || '');
  const [seccion, setSeccion] = useState(productoAEditar?.seccion || '');
  const [enCatalogo, setEnCatalogo] = useState<'Sí' | 'No'>(productoAEditar?.enCatalogo || 'No');
  const [cantidadFDS, setCantidadFDS] = useState(productoAEditar?.cantidadFDS?.toString() || '');
  const [cantidadFIE, setCantidadFIE] = useState(productoAEditar?.cantidadFIE?.toString() || '');
  const [idViejoFDS, setIdViejoFDS] = useState(productoAEditar?.idViejoFDS?.toString() || '');
  const [idViejoFIE, setIdViejoFIE] = useState(productoAEditar?.idViejoFIE?.toString() || '');

  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<ProductoData | null>(null);

  const opcionesDropdown = (items: string[]): IDropdownOption[] =>
    items.map((item) => ({ key: item, text: item }));

  const construirProducto = (): ProductoData => ({
    [ClaveCampo.Producto]: producto,
    [ClaveCampo.LineaDeNegocio]: linea,
    [ClaveCampo.Area]: area,
    [ClaveCampo.Seccion]: seccion,
    [ClaveCampo.EnCatalogo]: enCatalogo,
    [ClaveCampo.CantidadFDS]: cantidadFDS === '' ? null : Number(cantidadFDS),
    [ClaveCampo.CantidadFIE]: cantidadFIE === '' ? null : Number(cantidadFIE),
    [ClaveCampo.IdViejoFDS]: idViejoFDS === '' ? null : Number(idViejoFDS),
    [ClaveCampo.IdViejoFIE]: idViejoFIE === '' ? null : Number(idViejoFIE)
  });

  const validarCampos = (): boolean => {
    if (!producto || !linea || !area || !seccion) return false;
    if (
      (cantidadFDS !== '' && Number(cantidadFDS) < 0) ||
      (cantidadFIE !== '' && Number(cantidadFIE) < 0) ||
      (idViejoFDS !== '' && isNaN(Number(idViejoFDS))) ||
      (idViejoFIE !== '' && isNaN(Number(idViejoFIE)))
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validarCampos()) {
      setError(true);
      setExito(false);
      return;
    }
    setProductoPendiente(construirProducto());
    setMostrarDialogo(true);
  };

  const confirmarGuardar = () => {
    setError(false);
    setExito(true);
    setBloqueado(true);
    setMostrarDialogo(false);
  };

  const cancelarGuardar = () => {
    setProductoPendiente(null);
    setMostrarDialogo(false);
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

  const renderResumenProducto = () => {
    if (!productoPendiente) return null;
    return (
      <ul style={{ paddingLeft: 16 }}>
        {(Object.entries(productoPendiente) as [ClaveCampo, any][])
          .filter(([_, valor]) => valor !== null && valor !== '')
          .map(([clave, valor]) => (
            <li key={clave}>
              <strong>{NOMBRE_CAMPO_LEIBLE[clave]}:</strong> {valor}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className={styles.contenedorFormulario}>
      <h2 className={styles.titulo}>
        {productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Producto]}
          required
          value={producto}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setProducto(v || '')}
        />
      </div>

      <fieldset className={styles.grupoCampos}>
        <div className={styles.fila}>
          <Dropdown
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.LineaDeNegocio]}
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
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Area]}
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
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Seccion]}
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
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.EnCatalogo]}
          options={[
            { key: 'Sí', text: 'Sí' },
            { key: 'No', text: 'No' }
          ]}
          selectedKey={enCatalogo}
          disabled={bloqueado}
          onChange={(_, o) => !bloqueado && setEnCatalogo(o?.key as 'Sí' | 'No')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.CantidadFDS]}
          type="number"
          value={cantidadFDS}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setCantidadFDS(v ?? '')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.CantidadFIE]}
          type="number"
          value={cantidadFIE}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setCantidadFIE(v ?? '')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.IdViejoFDS]}
          type="number"
          value={idViejoFDS}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setIdViejoFDS(v ?? '')}
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.IdViejoFIE]}
          type="number"
          value={idViejoFIE}
          disabled={bloqueado}
          onChange={(_, v) => !bloqueado && setIdViejoFIE(v ?? '')}
        />
      </div>

      {error && (
        <div className={styles.error}>
          Por favor complete todos los campos obligatorios y verifique los valores ingresados.
        </div>
      )}

      {exito && (
        <div className={styles.exito}>
          Producto {productoAEditar ? 'editado' : 'agregado'} exitosamente.
        </div>
      )}

      <div className={styles.botones}>
        <PrimaryButton onClick={handleSubmit} disabled={bloqueado}>
          {productoAEditar ? 'Guardar cambios' : 'Agregar producto'}
        </PrimaryButton>
        <DefaultButton onClick={handleCancelar} disabled={bloqueado}>
          Cancelar
        </DefaultButton>
      </div>

      <Dialog
        hidden={!mostrarDialogo}
        onDismiss={cancelarGuardar}
        dialogContentProps={{
          type: DialogType.normal,
          title: `¿Está seguro que desea ${productoAEditar ? 'guardar los cambios' : 'agregar este nuevo producto'}?`,
          subText: 'Revise la información antes de confirmar:'
        }}
      >
        {renderResumenProducto()}
        <DialogFooter>
          <PrimaryButton onClick={confirmarGuardar} text="Sí" />
          <DefaultButton onClick={cancelarGuardar} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default FormularioDeProducto;

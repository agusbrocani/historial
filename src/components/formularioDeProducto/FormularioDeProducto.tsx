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
import { useNavigate } from 'react-router-dom';
import { IArea, ILineaDeNegocio, IProductoFormulario, ISeccion } from '../gestionDeProductos/tipos';
import { obtenerAreasPorLinea, obtenerSeccionesPorArea } from './utils';

interface Props {
  lineasDeNegocio: ILineaDeNegocio[];
  areas: IArea[];
  secciones: ISeccion[];
  onGuardar: (data: IProductoFormulario) => void;
  producto: IProductoFormulario;
  setProducto: React.Dispatch<React.SetStateAction<IProductoFormulario>>;
}

const FormularioDeProducto: React.FC<Props> = ({
  lineasDeNegocio,
  areas,
  secciones,
  onGuardar,
  producto,
  setProducto
}) => {
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<IProductoFormulario>(producto);
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();

  const esProductoValido = (p: IProductoFormulario) =>
    p.producto.trim() !== '' &&
    p.lineaDeNegocio?.key.trim() !== '' &&
    p.area?.Id !== 0 &&
    p.seccion?.Id !== 0;

  const esEdicion = esProductoValido(producto) && !confirmado;

  const validarCampos = (): boolean => {
    if (!esProductoValido(productoPendiente)) return false;

    if (
      (productoPendiente.cantidadDeFds !== null && productoPendiente.cantidadDeFds < 0) ||
      (productoPendiente.cantidadDeFie !== null && productoPendiente.cantidadDeFie < 0) ||
      (productoPendiente.idViejoFds !== null && isNaN(Number(productoPendiente.idViejoFds))) ||
      (productoPendiente.idViejoFie !== null && isNaN(Number(productoPendiente.idViejoFie)))
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

    setMostrarDialogo(true);
  };

  const confirmarGuardar = () => {
    setError(false);
    setExito(true);
    setConfirmado(true);
    setMostrarDialogo(false);
    onGuardar(productoPendiente);
  };

  const cancelarGuardar = () => {
    setMostrarDialogo(false);
  };

  const handleCancelar = () => {
    setError(false);
    setExito(false);
    setConfirmado(true);

    if (esEdicion) {
      setProductoPendiente(producto);
    } else {
      const productoVacio: IProductoFormulario = {
        producto: '',
        lineaDeNegocio: { key: '', text: '' },
        area: { Id: 0, Titulo: '', LineaNegocioId: 0, ResponsableId: null },
        seccion: { Id: 0, Titulo: '', AreaId: 0 },
        enCatalogo: null,
        cantidadDeFds: null,
        cantidadDeFie: null,
        idViejoFds: null,
        idViejoFie: null
      };
      setProducto(productoVacio);
      setProductoPendiente(productoVacio);
    }

    navigate(-1);
  };

  const areasDisponibles = obtenerAreasPorLinea(productoPendiente.lineaDeNegocio, areas);
  const seccionesDisponibles = obtenerSeccionesPorArea(productoPendiente.area, secciones);

  useEffect(() => {
    if (esProductoValido(producto)) {
      setProductoPendiente(producto);
    }
  }, [producto]);

  const renderResumenProducto = () => {
    return (
      <ul style={{ paddingLeft: 16 }}>
        <li><strong>Producto:</strong> {productoPendiente.producto}</li>
        <li><strong>Línea de negocio:</strong> {productoPendiente.lineaDeNegocio.text}</li>
        <li><strong>Área:</strong> {productoPendiente.area.Titulo}</li>
        <li><strong>Sección:</strong> {productoPendiente.seccion.Titulo}</li>
        <li>
          <strong>En Catálogo:</strong>{' '}
          {productoPendiente.enCatalogo === true
            ? 'Sí'
            : productoPendiente.enCatalogo === false
              ? 'No'
              : '-'}
        </li>
        <li><strong>Cantidad FDS:</strong> {productoPendiente.cantidadDeFds ?? '-'}</li>
        <li><strong>Cantidad FIE:</strong> {productoPendiente.cantidadDeFie ?? '-'}</li>
        <li><strong>ID Viejo FDS:</strong> {productoPendiente.idViejoFds ?? '-'}</li>
        <li><strong>ID Viejo FIE:</strong> {productoPendiente.idViejoFie ?? '-'}</li>
      </ul>
    );
  };

  return (
    <div className={styles.contenedorFormulario}>
      <h2 className={styles.titulo}>{esEdicion ? 'Editar Producto' : 'Alta de Producto'}</h2>

      <TextField
        label="Nombre del producto"
        required
        value={productoPendiente.producto}
        disabled={confirmado}
        onChange={(_, v) => {
          const texto = v ?? '';
          const soloPermitido = texto.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/g, '');
          setProductoPendiente(p => ({ ...p, producto: soloPermitido }));
        }}
        onBlur={() => {
          const texto = productoPendiente.producto ?? '';
          const normalizado = texto.replace(/\s+/g, ' ').trim().slice(0, 255);
          setProductoPendiente(p => ({ ...p, producto: normalizado }));
        }}
      />

      <Dropdown
        label="Línea de Negocio"
        required
        options={lineasDeNegocio}
        selectedKey={productoPendiente.lineaDeNegocio.key}
        disabled={confirmado}
        onChange={(_, o) => {
          const ln = lineasDeNegocio.find(l => l.key === o?.key) ?? { key: '', text: '' };
          setProductoPendiente(p => ({
            ...p,
            lineaDeNegocio: ln,
            area: { Id: 0, Titulo: '', LineaNegocioId: 0, ResponsableId: null },
            seccion: { Id: 0, Titulo: '', AreaId: 0 }
          }));
        }}
      />

      <Dropdown
        label="Área"
        required
        options={areasDisponibles.map(a => ({ key: a.Id, text: a.Titulo }))}
        selectedKey={productoPendiente.area.Id}
        disabled={!productoPendiente.lineaDeNegocio.key || confirmado}
        onChange={(_, o) => {
          const area = areas.find(a => a.Id === o?.key) ?? { Id: 0, Titulo: '', LineaNegocioId: 0, ResponsableId: null };
          setProductoPendiente(p => ({
            ...p,
            area,
            seccion: { Id: 0, Titulo: '', AreaId: 0 }
          }));
        }}
      />

      <Dropdown
        label="Sección"
        required
        options={seccionesDisponibles.map(s => ({ key: s.Id, text: s.Titulo }))}
        selectedKey={productoPendiente.seccion.Id}
        disabled={!productoPendiente.area.Id || confirmado}
        onChange={(_, o) => {
          const seccion = secciones.find(s => s.Id === o?.key) ?? { Id: 0, Titulo: '', AreaId: 0 };
          setProductoPendiente(p => ({ ...p, seccion }));
        }}
      />

      <Dropdown
        label="En Catálogo"
        options={[
          { key: 'true', text: 'Sí' },
          { key: 'false', text: 'No' }
        ]}
        selectedKey={
          productoPendiente.enCatalogo === true
            ? 'true'
            : productoPendiente.enCatalogo === false
              ? 'false'
              : null
        }
        disabled={confirmado}
        onChange={(_, o) => {
          const valor = o?.key;
          setProductoPendiente((p) => ({
            ...p,
            enCatalogo:
              valor === 'true' ? true :
              valor === 'false' ? false : null
          }));
        }}
      />


      {[
        { key: 'cantidadDeFds', label: 'Cantidad FDS' },
        { key: 'cantidadDeFie', label: 'Cantidad FIE' },
        { key: 'idViejoFds', label: 'ID Viejo FDS' },
        { key: 'idViejoFie', label: 'ID Viejo FIE' }
      ].map((campo) => (
        <TextField
          key={campo.key}
          label={campo.label}
          type="number"
          value={productoPendiente[campo.key as keyof IProductoFormulario]?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) => {
            const valor = v?.trim() ?? '';
            const numero = /^\d+$/.test(valor) ? Number(valor) : null;
            setProductoPendiente(p => ({ ...p, [campo.key]: numero }));
          }}
        />
      ))}

      <div className={styles.botones}>
        <PrimaryButton onClick={handleSubmit} disabled={confirmado}>
          {esEdicion ? 'Guardar cambios' : 'Dar de alta'}
        </PrimaryButton>
        <DefaultButton onClick={handleCancelar} disabled={confirmado}>
          Cancelar
        </DefaultButton>
      </div>

      <Dialog
        hidden={!mostrarDialogo}
        onDismiss={cancelarGuardar}
        dialogContentProps={{
          type: DialogType.normal,
          title: `¿Está seguro que desea ${esEdicion ? 'guardar' : 'dar de alta'} el producto?`,
          subText: 'Revise la información antes de confirmar:'
        }}
      >
        {renderResumenProducto()}
        <DialogFooter>
          <PrimaryButton onClick={confirmarGuardar} text="Sí" />
          <DefaultButton onClick={cancelarGuardar} text="No" />
        </DialogFooter>
      </Dialog>

      {error && (
        <div className={styles.error}>
          Por favor complete todos los campos obligatorios y verifique los valores ingresados.
        </div>
      )}

      {exito && (
        <div className={styles.exito}>
          Producto {esEdicion ? 'editado' : 'dado de alta'} exitosamente.
        </div>
      )}
    </div>
  );
};

export default FormularioDeProducto;

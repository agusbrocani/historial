import React, { useState, useEffect } from 'react';
import {
  TextField,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import styles from './FormularioDeProducto.module.scss';
import { useNavigate } from 'react-router-dom';
import { IArea, ILineaDeNegocio, IProducto, ISeccion } from '../gestionDeProductos/tipos';

interface Props {
  lineasDeNegocio: ILineaDeNegocio[];
  areas: IArea[];
  secciones: ISeccion[];
  onGuardar: (data: IProducto) => void;
  producto: IProducto;
  setProducto: React.Dispatch<React.SetStateAction<IProducto>>;
}
const FormularioDeProducto: React.FC<Props> = ({
  lineasDeNegocio,
  areas,
  secciones,
  onGuardar,
  producto,
  setProducto
}) => {
  const [productoPendiente, setProductoPendiente] = useState<IProducto>(producto);
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();

  const esProductoValido = (p: IProducto) =>
    p.Titulo.trim() !== '' &&
    p.LineaNegocioId !== null &&
    p.AreaId !== null &&
    p.SeccionId !== null;

  const esEdicion = producto.Id !== null;

  const validarCampos = (): boolean => {
    if (!esProductoValido(productoPendiente)) return false;
    const numerosValidos = ['CantidadFDS', 'CantidadFIE', 'IdViejoFDS', 'IdViejoFIE'] as const;
    for (const campo of numerosValidos) {
      const valor = productoPendiente[campo];
      if (valor !== null && (isNaN(valor) || valor < 0)) return false;
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
    const productoFinal = {
      ...productoPendiente,
      Titulo: productoPendiente.Titulo.trim()
    };
    setError(false);
    setExito(true);
    setConfirmado(true);
    setMostrarDialogo(false);
    setProducto(productoPendiente);
    onGuardar(productoFinal);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  const cancelarGuardar = () => {
    setMostrarDialogo(false);
  };

  const handleCancelar = () => {
    setError(false);
    setExito(false);
    setConfirmado(true);
    navigate(-1);
  };

  useEffect(() => {
    setProductoPendiente(producto);
  }, [producto]);

  const areasDisponibles = areas.filter(a => a.LineaNegocioId === productoPendiente.LineaNegocioId);
  const seccionesDisponibles = secciones.filter(s => s.AreaId === productoPendiente.AreaId);

  const renderResumenProducto = () => {
    const linea = lineasDeNegocio.find(l => parseInt(l.key) === productoPendiente.LineaNegocioId);
    const area = areas.find(a => a.Id === productoPendiente.AreaId);
    const seccion = secciones.find(s => s.Id === productoPendiente.SeccionId);
    return (
      <ul style={{ paddingLeft: 16 }}>
        <li><strong>Producto:</strong> {productoPendiente.Titulo}</li>
        <li><strong>Línea de negocio:</strong> {linea?.text ?? '-'}</li>
        <li><strong>Área:</strong> {area?.Titulo ?? '-'}</li>
        <li><strong>Sección:</strong> {seccion?.Titulo ?? '-'}</li>
        <li><strong>En Catálogo:</strong> {productoPendiente.EnCatalogo === true ? 'Sí' : productoPendiente.EnCatalogo === false ? 'No' : '-'}</li>
        <li><strong>Cantidad FDS:</strong> {productoPendiente.CantidadFDS ?? '-'}</li>
        <li><strong>Cantidad FIE:</strong> {productoPendiente.CantidadFIE ?? '-'}</li>
        <li><strong>ID Viejo FDS:</strong> {productoPendiente.IdViejoFDS ?? '-'}</li>
        <li><strong>ID Viejo FIE:</strong> {productoPendiente.IdViejoFIE ?? '-'}</li>
      </ul>
    );
  };

  return (
    <div className={styles.contenedorFormulario}>
      <h2 className={styles.titulo}>{esEdicion ? 'Editar Producto' : 'Alta de Producto'}</h2>
      
      <TextField
        label="Nombre del producto"
        required
        value={productoPendiente.Titulo}
        disabled={confirmado}
        onChange={(_, v) => {
          if (v === undefined) return;
          const limpio = v
            .replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+/g, '') // solo caracteres válidos
            .replace(/\s+/g, ' ')                      // solo un espacio
            .replace(/^\s+/, '')                       // remueve espacios al inicio
            .slice(0, 255);

          setProductoPendiente(p => ({ ...p, Titulo: limpio }));
        }}
        onBlur={() => {
          setProductoPendiente(p => ({
            ...p,
            Titulo: p.Titulo.trim() // remueve espacios iniciales/finales
          }));
        }}
      />

      <Dropdown
        label="Línea de Negocio"
        required
        options={lineasDeNegocio.map(l => ({ key: l.key, text: l.text }))}
        selectedKey={productoPendiente.LineaNegocioId?.toString()}
        disabled={confirmado}
        onChange={(_, option) => {
          const nuevaLineaId = option?.key ? parseInt(option.key.toString()) : null;
          setProductoPendiente(p => ({
            ...p,
            LineaNegocioId: nuevaLineaId,
            AreaId: null,
            SeccionId: null
          }));
        }}
      />

      <Dropdown
        label="Área"
        required
        options={areasDisponibles.map(a => ({ key: a.Id, text: a.Titulo }))}
        selectedKey={productoPendiente.AreaId}
        disabled={productoPendiente.LineaNegocioId === null || confirmado}
        onChange={(_, option) => {
          setProductoPendiente(p => ({
            ...p,
            AreaId: option ? Number(option?.key) : null,
            SeccionId: null
          }));
        }}
      />

      <Dropdown
        label="Sección"
        required
        options={seccionesDisponibles.map(s => ({ key: s.Id, text: s.Titulo }))}
        selectedKey={productoPendiente.SeccionId}
        disabled={productoPendiente.AreaId === null || confirmado}
        onChange={(_, option) => {
          setProductoPendiente(p => ({
            ...p,
            SeccionId: option ? Number(option.key) : null
          }));
        }}
      />

      <Dropdown
        label="En Catálogo"
        options={[
          { key: 'true', text: 'Sí' },
          { key: 'false', text: 'No' }
        ]}
        selectedKey={
          productoPendiente.EnCatalogo === true ? 'true' :
          productoPendiente.EnCatalogo === false ? 'false' : null
        }
        disabled={confirmado}
        onChange={(_, o) => {
          setProductoPendiente(p => ({
            ...p,
            EnCatalogo: o?.key === 'true'
              ? true
              : o?.key === 'false'
              ? false
              : null
          }));
        }}
      />

      {[
        ['CantidadFDS', 'Cantidad FDS'],
        ['CantidadFIE', 'Cantidad FIE'],
        ['IdViejoFDS', 'ID Viejo FDS'],
        ['IdViejoFIE', 'ID Viejo FIE']
      ].map(([key, label]) => (
        <TextField
          key={key}
          label={label}
          type="text"
          inputMode="numeric"
          value={productoPendiente[key as keyof IProducto]?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) => {
            // Permito vacío (borra el campo) o número válido dentro del rango seguro
            if (/^\d*$/.test(v ?? '') && (v === '' || Number(v) <= Number.MAX_SAFE_INTEGER)) {
              const numero = v === '' ? null : Number(v);
              setProductoPendiente(p => ({ ...p, [key]: numero }));
            }
            // Si no es válido, ignoro el cambio (no seteo el estado)
          }}
          onKeyDown={(e) => {
            const tecla = e.key;
            const esDigito = /^[0-9]$/.test(tecla);
            const teclasPermitidas = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
            if (!esDigito && !teclasPermitidas.includes(tecla)) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('Text');
            if (!/^\d+$/.test(pasted) || Number(pasted) > Number.MAX_SAFE_INTEGER) {
              e.preventDefault();
            }
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

      {error && <div className={styles.error}>Por favor complete todos los campos obligatorios y verifique los valores ingresados.</div>}
      {exito && <div className={styles.exito}>Producto {esEdicion ? 'editado' : 'dado de alta'} exitosamente. Redirigiendo...</div>}
    </div>
  );
};

export default FormularioDeProducto;

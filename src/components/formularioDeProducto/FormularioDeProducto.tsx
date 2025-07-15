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
import { ClaveCampo, NOMBRE_CAMPO_LEIBLE, ProductoData } from './constantesCampos';
import { useNavigate } from 'react-router-dom';

interface Props {
  lineasDeNegocio: string[];
  areasPorLinea: Record<string, string[]>;
  seccionesPorArea: Record<string, string[]>;
  onGuardar: (data: ProductoData) => void;
  producto: ProductoData;
  setProducto: React.Dispatch<React.SetStateAction<ProductoData>>;
}

const FormularioDeProducto: React.FC<Props> = ({
  lineasDeNegocio,
  areasPorLinea,
  seccionesPorArea,
  onGuardar,
  producto,
  setProducto
}) => {
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState<ProductoData>(producto);
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();

  const esProductoValido = (p: ProductoData) =>
    p.producto && p.lineaDeNegocio && p.area && p.seccion;

  const esEdicion = esProductoValido(producto) && !confirmado;

  const opcionesDropdown = (items: string[]): IDropdownOption[] =>
    items.map((item) => ({ key: item, text: item }));

  const validarCampos = (): boolean => {
    if (!esProductoValido(productoPendiente)) return false;

    if (
      (productoPendiente.cantidadFDS !== null && productoPendiente.cantidadFDS < 0) ||
      (productoPendiente.cantidadFIE !== null && productoPendiente.cantidadFIE < 0) ||
      (productoPendiente.idViejoFDS !== null && isNaN(Number(productoPendiente.idViejoFDS))) ||
      (productoPendiente.idViejoFIE !== null && isNaN(Number(productoPendiente.idViejoFIE)))
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
    navigate(-1);
  };

  const cancelarGuardar = () => {
    setMostrarDialogo(false);
  };

  const handleCancelar = () => {
    setError(false);
    setExito(false);
    setConfirmado(true);

    if (esEdicion) {
      setProductoPendiente(producto); // Restaurar en edición
    } else {
      const productoVacio: ProductoData = {
        producto: '',
        lineaDeNegocio: '',
        area: '',
        seccion: '',
        enCatalogo: null,
        cantidadFDS: null,
        cantidadFIE: null,
        idViejoFDS: null,
        idViejoFIE: null
      };
      setProducto(productoVacio);
      setProductoPendiente(productoVacio);
    }
    for (let t = Date.now(); Date.now() - t < 1000; );
    navigate(-1);
  };

  const areasDisponibles = productoPendiente.lineaDeNegocio
    ? areasPorLinea[productoPendiente.lineaDeNegocio] || []
    : [];

  const seccionesDisponibles = productoPendiente.area
    ? seccionesPorArea[productoPendiente.area] || []
    : [];

  useEffect(() => {
    const productoRecibidoEsValido = esProductoValido(producto);
    if (productoRecibidoEsValido) {
      setProductoPendiente(producto);
    }
  }, [producto]);

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

  const textoAccion = esEdicion ? 'guardar' : 'dar de alta';

  return (
    <div className={styles.contenedorFormulario}>
      <h2 className={styles.titulo}>
        {esEdicion ? 'Editar Producto' : 'Alta de Producto'}
      </h2>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Producto]}
          required
          value={productoPendiente.producto}
          disabled={confirmado}
          onChange={(_, v) =>
            setProductoPendiente((p) => ({ ...p, producto: v || '' }))
          }
        />
      </div>

      <fieldset className={styles.grupoCampos}>
        <div className={styles.fila}>
          <Dropdown
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.LineaDeNegocio]}
            required
            options={opcionesDropdown(lineasDeNegocio)}
            selectedKey={productoPendiente.lineaDeNegocio}
            disabled={confirmado}
            onChange={(_, o) => {
              setProductoPendiente((p) => ({
                ...p,
                lineaDeNegocio: o?.key as string,
                area: '',
                seccion: ''
              }));
            }}
          />
        </div>

        <div className={styles.fila}>
          <Dropdown
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Area]}
            required
            options={opcionesDropdown(areasDisponibles)}
            selectedKey={productoPendiente.area}
            disabled={!productoPendiente.lineaDeNegocio || confirmado}
            onChange={(_, o) => {
              setProductoPendiente((p) => ({
                ...p,
                area: o?.key as string,
                seccion: ''
              }));
            }}
          />
        </div>

        <div className={styles.fila}>
          <Dropdown
            label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.Seccion]}
            required
            options={opcionesDropdown(seccionesDisponibles)}
            selectedKey={productoPendiente.seccion}
            disabled={!productoPendiente.area || confirmado}
            onChange={(_, o) =>
              setProductoPendiente((p) => ({ ...p, seccion: o?.key as string }))
            }
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
          selectedKey={productoPendiente.enCatalogo}
          disabled={confirmado}
          onChange={(_, o) =>
            setProductoPendiente((p) => ({
              ...p,
              enCatalogo: o?.key as 'Sí' | 'No'
            }))
          }
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.CantidadFDS]}
          type="number"
          value={productoPendiente.cantidadFDS?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) =>
            setProductoPendiente((p) => ({
              ...p,
              cantidadFDS: v ? Number(v) : null
            }))
          }
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.CantidadFIE]}
          type="number"
          value={productoPendiente.cantidadFIE?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) =>
            setProductoPendiente((p) => ({
              ...p,
              cantidadFIE: v ? Number(v) : null
            }))
          }
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.IdViejoFDS]}
          type="number"
          value={productoPendiente.idViejoFDS?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) =>
            setProductoPendiente((p) => ({
              ...p,
              idViejoFDS: v ? Number(v) : null
            }))
          }
        />
      </div>

      <div className={styles.fila}>
        <TextField
          label={NOMBRE_CAMPO_LEIBLE[ClaveCampo.IdViejoFIE]}
          type="number"
          value={productoPendiente.idViejoFIE?.toString() ?? ''}
          disabled={confirmado}
          onChange={(_, v) =>
            setProductoPendiente((p) => ({
              ...p,
              idViejoFIE: v ? Number(v) : null
            }))
          }
        />
      </div>

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
          title: `¿Está seguro que desea ${textoAccion} el producto?`,
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

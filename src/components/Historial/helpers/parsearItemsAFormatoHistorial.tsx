import * as React from 'react'
import TextoExpandible from "../utils/components/TextoExpandible/TextoExpandible";

// coloco any ya que no implemento el tipo especifico del cual es el helper, pero existe
export const parsearItemsSolicitudAFormatoHistorial = (items: any[], colorBotonVerMas: string): any[] => {
    return items.map((item) => {
        const fechaISO = new Date(item.Fecha);
        const fecha = fechaISO.toLocaleDateString('es-AR');
        const hora = fechaISO.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        return {
            estadoAnterior: item?.EstadoAnterior || '',
            estadoPosterior: item?.EstadoActual || '',
            usuario: item.Usuario?.Email || '',
            fecha,
            hora,
            renderizable: [
                <TextoExpandible
                    texto={item.Observacion}
                    color={colorBotonVerMas}
                    lines={3}
                />
            ]
        };
    });
};

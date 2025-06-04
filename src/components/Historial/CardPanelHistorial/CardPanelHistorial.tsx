import { Icon } from '@fluentui/react';
import styles from './CardPanelHistorial.module.scss';

import { IHistorialItem } from '../../HistorialPanel';

type CardPanelHistorialProps<T extends IHistorialItem> = {
    items: T[];
};

function CardPanelHistorial<T extends IHistorialItem>({ items }: CardPanelHistorialProps<T>) {
    return (
        <div className={styles.container}>
            {items.map((item, index) => (
                <div className={styles.card} key={index}>
                    <div className={styles.estados}>
                        <strong>Estado</strong>
                        <span>{item.estadoAnterior}</span>
                        <Icon iconName='Forward' className={styles.iconoEstado} />
                        <span>{item.estadoPosterior}</span>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.iconoCalendario}>
                            <Icon iconName='Calendar' />
                        </div>
                        <span className={styles.texto}>{item.fecha}</span>

                        <div className={styles.avatar}>
                            {(item.usuario[0] + item.usuario.split('.')[1]?.[0] || '').toUpperCase()}
                        </div>
                        <span className={styles.texto}>{item.usuario}</span>
                    </div>

                    <p className={styles.observacion}>{item.observacion}</p>
                    <p className={styles.indice}>Cambio {index + 1} de {items.length}</p>
                </div>
            ))}
        </div>
    );
}

export default CardPanelHistorial;
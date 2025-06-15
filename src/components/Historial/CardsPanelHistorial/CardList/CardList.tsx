import styles from './CardList.module.scss';
import { IHistorialItem } from '../../../HistorialPanel';
import CardItem from '../CardItem/CardItem';
import { RefObject } from 'react';

type CardListProps<T extends IHistorialItem> = {
  items: T[];
  colorGeneral: string;
  colorAvatar: string;
  totalItems: number;
  onCollapseRequest?: (ref: HTMLDivElement | null) => void;
  lastCardRef: RefObject<HTMLDivElement>;
};

function CardList<T extends IHistorialItem>({
  items,
  colorGeneral,
  colorAvatar,
  totalItems,
  onCollapseRequest,
  lastCardRef,
}: CardListProps<T>) {
  return (
    <div className={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} ref={isLast ? lastCardRef : null}>
            <CardItem
              item={item}
              colorGeneral={colorGeneral}
              colorAvatar={colorAvatar}
              index={index}
              total={totalItems}
              onCollapseRequest={onCollapseRequest}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CardList;

import styles from './CardList.module.scss';
import { IHistorialItem } from '../../../IHistorialItem';
import CardItem from './CardItem/CardItem';
import { RefObject } from 'react';

type CardListProps = {
  items: IHistorialItem[];
  colorGeneral: string;
  colorAvatar: string;
  totalItems: number;
  ordenNumeracionCardsAsc: boolean;
  lastCardRef: RefObject<HTMLDivElement>;
};

function CardList({
  items,
  colorGeneral,
  colorAvatar,
  totalItems,
  ordenNumeracionCardsAsc,
  lastCardRef,
}: CardListProps) {
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
              ordenNumeracionCardsAsc={ordenNumeracionCardsAsc}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CardList;

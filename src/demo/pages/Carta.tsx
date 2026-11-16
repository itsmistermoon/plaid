import { useState } from 'react';
import { useStore } from 'zustand';
import { DishPlate } from '../../components/DishPlate';
import { KitCheck } from '../../components/KitCheck';
import { money } from '../../format';
import { useDishText, useT } from '../../i18n';
import { type Category, categories, type Dish, dishes } from '../../menu';
import { store } from '../store';

export function Carta({ onOpen }: { onOpen: (dish: Dish) => void }) {
  const { cart, setQty } = useStore(store);
  const t = useT();
  const text = useDishText();
  const [category, setCategory] = useState<Category>(categories[0]);
  return (
    <>
      <div
        className="segmented"
        role="tablist"
        aria-label={t('categoriesLabel')}
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={category === item}
            onClick={() => setCategory(item)}
          >
            {t('categories')[item]}
          </button>
        ))}
      </div>
      <ul
        className="dish-list"
        data-tour="elegir"
        aria-label={t('categories')[category]}
      >
        {dishes
          .filter((dish) => dish.category === category)
          .map((dish) => (
            <li
              className="card dish"
              key={dish.id}
              data-sold-out={dish.soldOut || undefined}
            >
              <DishPlate dish={dish} />
              <div className="dish-text">
                <h3>{dish.name}</h3>
                <p>{dish.soldOut ? t('soldOut') : text(dish)}</p>
              </div>
              <div className="dish-side">
                <span className="dish-price">{money(dish.price)}</span>
                <KitCheck
                  label={t('addToOrder')(dish.name)}
                  disabled={dish.soldOut}
                  checked={cart.some(
                    (line) =>
                      line.dishId === dish.id &&
                      !line.extras.length &&
                      !line.note,
                  )}
                  onChange={(checked) =>
                    setQty({ dishId: dish.id }, checked ? 1 : 0)
                  }
                />
                <button
                  className="light-button"
                  type="button"
                  aria-label={t('seeDetailOf')(dish.name)}
                  onClick={() => onOpen(dish)}
                >
                  {t('seeDetail')}
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}

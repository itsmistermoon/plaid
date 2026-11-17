import { useState } from 'react';
import { useStore } from 'zustand';
import { CategoryTabs } from '../../components/CategoryTabs';
import { Chalkboard } from '../../components/Chalkboard';
import { DietFilter } from '../../components/DietFilter';
import { DishPlate } from '../../components/DishPlate';
import { KitCheck } from '../../components/KitCheck';
import { money } from '../../format';
import { useDishText, useT } from '../../i18n';
import {
  type Diet,
  type Dish,
  dishes,
  matchesDiets,
  soldOutDishes,
  specials,
  type Tab,
} from '../../menu';
import { store } from '../store';

export function Carta({ onOpen }: { onOpen: (dish: Dish) => void }) {
  const { cart, setQty, seeTour } = useStore(store);
  const t = useT();
  const text = useDishText();
  const [category, setCategory] = useState<Tab>('Hoy');
  const [chosen, setChosen] = useState<Diet[]>([]);
  return (
    <>
      <CategoryTabs
        value={category}
        onChange={(next) => {
          setCategory(next);
          if (next === 'Hoy') seeTour('hoy');
        }}
      />
      {category === 'Hoy' ? (
        <Chalkboard
          specials={specials}
          soldOut={soldOutDishes}
          onOpen={(dish) => {
            seeTour('hoy');
            onOpen(dish);
          }}
        />
      ) : (
        <>
          <DietFilter value={chosen} onChange={setChosen} />
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
                  data-off-diet={!matchesDiets(dish, chosen) || undefined}
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
      )}
    </>
  );
}

import { useState } from 'react';
import { useStore } from 'zustand';
import { DishPlate } from '../../components/DishPlate';
import { Extras } from '../../components/Extras';
import { PostIt } from '../../components/PostIt';
import { QuantityWheel } from '../../components/QuantityWheel';
import { Receipt } from '../../components/Receipt';
import { Ribbon } from '../../components/Ribbon';
import { type Line, unitPrice } from '../../domain';
import { useDishText, useExtraName, useT } from '../../i18n';
import type { Dish } from '../../menu';
import { receiptLine } from '../lines';
import { store } from '../store';

/** Dish detail: extras, kitchen note and quantity before adding it. */
export function Detalle({ dish, onDone }: { dish: Dish; onDone: () => void }) {
  const addToCart = useStore(store, (state) => state.addToCart);
  const t = useT();
  const text = useDishText();
  const extraName = useExtraName();
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const choice: Line = {
    dishId: dish.id,
    extras,
    note: note.trim(),
    qty: quantity,
  };
  return (
    <section className="card detail" aria-label={dish.name}>
      <DishPlate dish={dish} size="big" />
      <Ribbon>{dish.name}</Ribbon>
      <div className="detail-text">
        <p>{text(dish)}</p>
        <PostIt
          label={t('kitchenNote')}
          placeholder={t('addNote')}
          value={note}
          disabled={dish.soldOut}
          onChange={setNote}
        />
      </div>
      <div className="detail-foot">
        {dish.extras && (
          <Extras
            extras={dish.extras}
            selected={extras}
            disabled={dish.soldOut}
            onChange={setExtras}
          />
        )}
        <div className="detail-order">
          <div className="detail-qty">
            {dish.soldOut ? (
              <p className="sold-out">{t('soldOut')}</p>
            ) : (
              <QuantityWheel
                value={quantity}
                onChange={setQuantity}
                label={t('quantityOf')(dish.name)}
              />
            )}
            <button
              type="button"
              className="light-button"
              disabled={dish.soldOut}
              data-tour="elegir"
              onClick={() => {
                addToCart(choice, quantity);
                onDone();
              }}
            >
              {t('add')}
            </button>
          </div>
          <div className="detail-receipt">
            <Receipt
              caption={t('previewOf')(dish.name)}
              lines={[receiptLine(choice, dish.id, `x${quantity}`, extraName)]}
              total={dish.soldOut ? 0 : unitPrice(choice) * quantity}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

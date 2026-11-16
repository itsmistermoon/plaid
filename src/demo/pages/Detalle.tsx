import { Label } from '@ui-sdk/react/label';
import { BadgePlus } from 'lucide-react';
import { useId, useState } from 'react';
import { useStore } from 'zustand';
import { DishPlate } from '../../components/DishPlate';
import { KitCheck } from '../../components/KitCheck';
import { QuantityWheel } from '../../components/QuantityWheel';
import { Receipt } from '../../components/Receipt';
import { type Line, unitPrice } from '../../domain';
import { money } from '../../format';
import { useDishText, useExtraName, useT } from '../../i18n';
import type { Dish } from '../../menu';
import { receiptLine } from '../lines';
import { store } from '../store';

/** Detalle de un plato: agregados, nota para cocina y cantidad antes de agregarlo. */
export function Detalle({ dish, onDone }: { dish: Dish; onDone: () => void }) {
  const addToCart = useStore(store, (state) => state.addToCart);
  const t = useT();
  const extrasId = useId();
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
      <h3 className="ribbon">
        <span className="ribbon-cloth">
          <svg
            className="ribbon-stitch"
            viewBox="0 0 100 26"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline points="0,20 50,7 100,20" />
          </svg>
          {dish.name}
        </span>
      </h3>
      <div className="detail-text">
        <p>{text(dish)}</p>
        <label className="post-it">
          <span className="sr-only">{t('kitchenNote')}</span>
          <textarea
            value={note}
            maxLength={120}
            placeholder={t('addNote')}
            disabled={dish.soldOut}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </div>
      <div className="detail-foot">
        {dish.extras && (
          <fieldset className="extras" aria-labelledby={extrasId}>
            <div className="extras-title" id={extrasId}>
              <BadgePlus className="extras-icon" aria-hidden="true" />
              {t('extras')}
            </div>
            {dish.extras.map((extra) => (
              <Label key={extra.id} className="extra">
                <KitCheck
                  label={`${extraName(extra)}, ${money(extra.price)}`}
                  disabled={dish.soldOut}
                  checked={extras.includes(extra.id)}
                  onChange={(checked) =>
                    setExtras((current) =>
                      checked
                        ? [...current, extra.id]
                        : current.filter((id) => id !== extra.id),
                    )
                  }
                />
                <span aria-hidden="true">{extraName(extra)}</span>
                <span className="extra-price" aria-hidden="true">
                  +{money(extra.price)}
                </span>
              </Label>
            ))}
          </fieldset>
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

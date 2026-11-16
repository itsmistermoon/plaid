import { ShoppingCart } from 'lucide-react';
import { useStore } from 'zustand';
import { Receipt, ReceiptActions, Stepper } from '../../components/Receipt';
import { cartTotal } from '../../domain';
import { useExtraName, useT } from '../../i18n';
import { dishById, lineKey, receiptLine } from '../lines';
import type { Go } from '../pages';
import { store } from '../store';

export function Carrito({ go }: { go: Go }) {
  const { cart, setQty, sendOrder } = useStore(store);
  const t = useT();
  const extraName = useExtraName();
  return (
    <section className="card ticket-card" aria-label={t('yourOrder')}>
      {cart.length === 0 ? (
        <div className="empty">
          <ShoppingCart aria-hidden="true" />
          <p>{t('emptyOrder')}</p>
          <button
            type="button"
            className="light-button"
            onClick={() => go('carta')}
          >
            {t('seeMenu')}
          </button>
        </div>
      ) : (
        <>
          <Receipt
            caption={t('yourOrder')}
            total={cartTotal(cart)}
            lines={cart.map((line) =>
              receiptLine(
                line,
                lineKey(line),
                <Stepper
                  name={dishById(line.dishId)?.name ?? line.dishId}
                  qty={line.qty}
                  onChange={(qty) => setQty(line, qty)}
                />,
                extraName,
              ),
            )}
          />
          <ReceiptActions total={cartTotal(cart)}>
            <button
              type="button"
              className="light-button"
              data-tour="enviar"
              onClick={() => {
                sendOrder();
                go('estado');
              }}
            >
              {t('placeOrder')}
            </button>
          </ReceiptActions>
        </>
      )}
    </section>
  );
}

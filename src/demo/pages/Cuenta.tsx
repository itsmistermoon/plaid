import { ReceiptText } from 'lucide-react';
import { useStore } from 'zustand';
import { Receipt, ReceiptActions } from '../../components/Receipt';
import { billTotal, findVisitorTable } from '../../domain';
import { useExtraName, useT } from '../../i18n';
import { lineKey, receiptLine } from '../lines';
import { store } from '../store';

export function Cuenta() {
  const { tables, requestBill } = useStore(store);
  const t = useT();
  const extraName = useExtraName();
  const mesa = findVisitorTable(tables);
  return (
    <section className="card ticket-card" aria-label={t('yourBill')}>
      {mesa.orders.length === 0 ? (
        <div className="empty">
          <ReceiptText aria-hidden="true" />
          <p>{t('emptyBill')}</p>
        </div>
      ) : (
        <>
          <Receipt
            caption={t('yourBill')}
            total={billTotal(mesa)}
            lines={mesa.orders.flatMap((order) =>
              order.lines.map((line) =>
                receiptLine(
                  line,
                  `${order.id}-${lineKey(line)}`,
                  `x${line.qty}`,
                  extraName,
                ),
              ),
            )}
          />
          <ReceiptActions total={billTotal(mesa)}>
            {mesa.calls.includes('pago') ? (
              <p className="notice" role="status">
                {t('billComing')}
              </p>
            ) : (
              <button
                type="button"
                className="light-button"
                data-tour="cuenta"
                onClick={requestBill}
              >
                {t('askBill')}
              </button>
            )}
          </ReceiptActions>
        </>
      )}
    </section>
  );
}

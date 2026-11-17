import { ReceiptText } from 'lucide-react';
import { useState } from 'react';
import { useStore } from 'zustand';
import {
  Receipt,
  ReceiptActions,
  ReceiptOption,
} from '../../components/Receipt';
import {
  type SplitPeople,
  SplitSelector,
} from '../../components/SplitSelector';
import { type TipPercent, TipSelector } from '../../components/TipSelector';
import {
  billTotal,
  findVisitorTable,
  splitShares,
  tipAmount,
} from '../../domain';
import { useExtraName, useT } from '../../i18n';
import { lineKey, receiptLine } from '../lines';
import { store } from '../store';

export function Cuenta() {
  const { tables, requestBill } = useStore(store);
  const t = useT();
  const extraName = useExtraName();
  const [percent, setPercent] = useState<TipPercent>(10);
  const mesa = findVisitorTable(tables);
  const tip = tipAmount(billTotal(mesa), percent);
  const [people, setPeople] = useState<SplitPeople>(1);
  const total = billTotal(mesa) + tip;
  const shares = splitShares(total, people);
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
            total={total}
            tip={{ percent, amount: tip }}
            shares={shares}
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
          <ReceiptActions total={total} shares={shares}>
            <ReceiptOption label={t('tip')}>
              <TipSelector value={percent} onChange={setPercent} />
            </ReceiptOption>
            <ReceiptOption label={t('splitBill')}>
              <SplitSelector value={people} onChange={setPeople} />
            </ReceiptOption>
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

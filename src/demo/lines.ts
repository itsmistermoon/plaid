import type { ReactNode } from 'react';
import type { Line } from '../domain';
import { dishes, type Extra } from '../menu';

export const dishById = (id: string) => dishes.find((dish) => dish.id === id);

/** La línea tal como se imprime en la boleta: agregados y nota debajo. */
export const receiptLine = (
  line: Line,
  key: string,
  qty: ReactNode,
  extraName: (extra: Extra) => string,
) => {
  const dish = dishById(line.dishId);
  return {
    key,
    name: dish?.name ?? line.dishId,
    qty,
    price: (dish?.price ?? 0) * line.qty,
    extras: (dish?.extras ?? [])
      .filter((extra) => line.extras.includes(extra.id))
      .map((extra) => ({
        name: extraName(extra),
        price: extra.price * line.qty,
      })),
    note: line.note,
  };
};

export const lineKey = (line: Line) =>
  [line.dishId, ...line.extras, line.note].join('|');

/** Resumen de una línea para la lista del pedido: "2 × Italiano + Palta (sin mayo)". */
export const lineSummary = (
  line: Line,
  extraName: (extra: Extra) => string,
) => {
  const dish = dishById(line.dishId);
  const extras = (dish?.extras ?? [])
    .filter((extra) => line.extras.includes(extra.id))
    .map((extra) => ` + ${extraName(extra)}`)
    .join('');
  return `${line.qty} × ${dish?.name}${extras}${line.note ? ` (${line.note})` : ''}`;
};

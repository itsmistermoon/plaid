import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { money } from '../format';

export interface ReceiptLine {
  key: string;
  name: string;
  qty: ReactNode;
  price: number;
}

/** Boleta de papel con bordes dentados y columnas plato, cantidad y precio. */
export function Receipt({
  lines,
  total,
  caption,
  children,
}: {
  lines: ReceiptLine[];
  total: number;
  caption: string;
  children?: ReactNode;
}) {
  return (
    <div className="receipt">
      <span className="receipt-slot" aria-hidden="true" />
      <div className="receipt-paper">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Plato</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.key}>
                <th scope="row">{line.name}</th>
                <td>{line.qty}</td>
                <td>{money(line.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="receipt-total">Total: {money(total)}</p>
        {children}
      </div>
    </div>
  );
}

/** Botones −/+ de una línea de la boleta. */
export function Stepper({
  name,
  qty,
  onChange,
}: {
  name: string;
  qty: number;
  onChange: (qty: number) => void;
}) {
  return (
    <span className="stepper">
      <button
        type="button"
        aria-label={`Quitar una unidad de ${name}`}
        onClick={() => onChange(qty - 1)}
      >
        <Minus aria-hidden="true" strokeWidth={3} />
      </button>
      <output>x{qty}</output>
      <button
        type="button"
        aria-label={`Agregar una unidad de ${name}`}
        onClick={() => onChange(qty + 1)}
      >
        <Plus aria-hidden="true" strokeWidth={3} />
      </button>
    </span>
  );
}

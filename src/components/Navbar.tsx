import { ChevronLeft, ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';

/** Dark, glossy screen bar: action, title and action. */
export function Navbar({
  start,
  title,
  logo,
  end,
}: {
  start?: ReactNode;
  title: string;
  logo?: boolean;
  end?: ReactNode;
}) {
  return (
    <div className="navbar">
      {start ?? <span />}
      <h2 data-logo={logo || undefined}>{title}</h2>
      {end ?? <span />}
    </div>
  );
}

/** Button with an arrow tip on the left, for going back. */
export function ArrowButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={className ? `arrow-button ${className}` : 'arrow-button'}
      onClick={onClick}
      disabled={disabled}
    >
      <ChevronLeft aria-hidden="true" strokeWidth={3} />
      {children}
    </button>
  );
}

/** Cart button in the bar, with the unit count. */
export function CartButton({
  count,
  label,
  className,
  tour,
  onClick,
}: {
  count: number;
  label: string;
  className?: string;
  tour?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`dark-button cart-button${className ? ` ${className}` : ''}`}
      data-tour={tour}
      aria-label={label}
      onClick={onClick}
    >
      <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
      {count > 0 && <span className="count">{count}</span>}
    </button>
  );
}

/** The Garzón's pending Llamados, in the bar. */
export function PendingCalls({ children }: { children: ReactNode }) {
  return (
    <span className="dark-button pending" role="status">
      {children}
    </span>
  );
}

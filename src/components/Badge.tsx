import type { ReactNode } from 'react';
import type { CallKind, OrderStatus } from '../domain';

export type BadgeVariant = OrderStatus | CallKind | 'count';

/**
 * Small pill: the status of a Pedido, the kind of a Llamado, or a count.
 * A count keeps the `count` class: the cart and the sidebar position it.
 */
export function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={variant === 'count' ? 'count' : 'badge'}
      data-variant={variant}
    >
      {children}
    </span>
  );
}

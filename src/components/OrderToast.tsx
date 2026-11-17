import {
  createToaster,
  Toast,
  ToastAction,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from '@ui-sdk/react/toast';
import { Check, CircleAlert, Send, Utensils } from 'lucide-react';
import type { ReactNode } from 'react';
import type { OrderStatus } from '../domain';

export type ToastKind = OrderStatus | 'error';

const icons = {
  enviado: Send,
  confirmado: Check,
  servido: Utensils,
  error: CircleAlert,
};

/** Queue of notices to the Comensal about their Pedido's status (not Llamados: those go to the Garzón). */
export const orderToaster = createToaster({ duration: 4000 });

export function showOrderToast(
  kind: ToastKind,
  [title, description]: readonly [string, string],
  action?: { label: string; onAction: () => void },
) {
  orderToaster(title, {
    description,
    action,
    type: kind === 'error' ? 'error' : 'info',
    data: { kind },
  });
}

/** Face of the notice: an icon per status, the text and, optionally, an action. */
export function ToastFace({
  kind,
  title,
  description,
  action,
}: {
  kind: ToastKind;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
}) {
  const Icon = icons[kind];
  return (
    <>
      <span className="toast-icon" data-kind={kind} aria-hidden="true">
        <Icon strokeWidth={3} />
      </span>
      <span className="toast-text">
        {title}
        {description}
      </span>
      {action}
    </>
  );
}

/**
 * Stack of notices at the bottom end of the screen. UI SDK stacks them,
 * expands the stack while the pointer or focus is in it, and dismisses a
 * notice with a swipe, Escape or its timer; the CSS only skins that.
 */
export function OrderToastRegion() {
  return (
    <ToastRegion
      toaster={orderToaster}
      side="bottom"
      align="end"
      className="toast-region"
    >
      {(toast) => (
        <Toast className="toast toast-card">
          <ToastFace
            kind={
              (toast.data as { kind: ToastKind } | undefined)?.kind ?? 'enviado'
            }
            title={<ToastTitle className="toast-title" />}
            description={<ToastDescription className="toast-description" />}
            action={<ToastAction className="light-button toast-action" />}
          />
        </Toast>
      )}
    </ToastRegion>
  );
}

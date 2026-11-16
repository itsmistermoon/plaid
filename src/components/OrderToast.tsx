import {
  createToaster,
  Toast,
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

/** Cola de avisos al comensal sobre el estado de su pedido (no son llamados: esos van al garzón). */
export const orderToaster = createToaster({ duration: 4000 });

export function showOrderToast(
  kind: ToastKind,
  title: string,
  description: string,
) {
  orderToaster(title, {
    description,
    type: kind === 'error' ? 'error' : 'info',
    data: { kind },
  });
}

/** Cara del aviso: banda oscura con un ícono por estado. */
export function ToastFace({
  kind,
  title,
  description,
}: {
  kind: ToastKind;
  title: ReactNode;
  description: ReactNode;
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
    </>
  );
}

/** Región fija abajo al centro donde aparecen los avisos. */
export function OrderToastRegion() {
  return (
    <ToastRegion
      toaster={orderToaster}
      side="bottom"
      align="center"
      className="toast-region"
    >
      {(toast) => (
        <Toast className="toast">
          <ToastFace
            kind={
              (toast.data as { kind: ToastKind } | undefined)?.kind ?? 'enviado'
            }
            title={<ToastTitle className="toast-title" />}
            description={<ToastDescription className="toast-description" />}
          />
        </Toast>
      )}
    </ToastRegion>
  );
}

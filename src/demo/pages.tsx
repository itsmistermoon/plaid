import { BookOpen, Clock, ReceiptText, ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';
import type { useT } from '../i18n';
import type { TourStep } from '../tour';
import { Carrito } from './pages/Carrito';
import { Carta } from './pages/Carta';
import { Cuenta } from './pages/Cuenta';
import { Estado } from './pages/Estado';

export type Page = 'carta' | 'carrito' | 'estado' | 'cuenta';
export type Go = (page: Page) => void;
type T = ReturnType<typeof useT>;

interface PageEntry {
  page: Page;
  /** Título en la barra de la tablet. */
  title: (t: T) => string;
  /** Rótulo en el menú lateral o la barra inferior. */
  label: (t: T) => string;
  icon: ReactNode;
  /** Aparece en la barra inferior del teléfono. */
  tab: boolean;
  tour?: TourStep;
  /** Sin pedidos enviados la página no tiene qué mostrar. */
  needsOrders?: boolean;
  render: (props: {
    go: Go;
    openDish: Parameters<typeof Carta>[0]['onOpen'];
  }) => ReactNode;
}

/** Las páginas del comensal, en el orden del menú. */
export const pages: PageEntry[] = [
  {
    page: 'carta',
    title: () => 'Restaurant El Clan',
    label: (t) => t('menu'),
    icon: <BookOpen />,
    tab: true,
    render: ({ openDish }) => <Carta onOpen={openDish} />,
  },
  {
    page: 'carrito',
    title: (t) => t('yourOrder'),
    label: (t) => t('order'),
    icon: <ShoppingCart />,
    tab: true,
    tour: 'enviar',
    render: ({ go }) => <Carrito go={go} />,
  },
  {
    page: 'estado',
    title: (t) => t('status'),
    label: (t) => t('status'),
    icon: <Clock />,
    tab: true,
    needsOrders: true,
    render: ({ go }) => <Estado go={go} />,
  },
  {
    page: 'cuenta',
    title: (t) => t('yourBill'),
    label: (t) => t('bill'),
    icon: <ReceiptText />,
    tab: false,
    tour: 'cuenta',
    render: () => <Cuenta />,
  },
];

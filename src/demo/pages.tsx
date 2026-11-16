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
  /** Title in the tablet bar. */
  title: (t: T) => string;
  /** Label in the side menu or the bottom bar. */
  label: (t: T) => string;
  icon: ReactNode;
  /** Appears in the phone's bottom bar. */
  tab: boolean;
  tour?: TourStep;
  /** With no sent Pedidos the page has nothing to show. */
  needsOrders?: boolean;
  render: (props: {
    go: Go;
    openDish: Parameters<typeof Carta>[0]['onOpen'];
  }) => ReactNode;
}

/** The Comensal's pages, in menu order. */
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

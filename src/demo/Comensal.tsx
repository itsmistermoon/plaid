import { ConciergeBell, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useStore } from 'zustand';
import { ArrowButton, Navbar } from '../components/Navbar';
import { findVisitorTable, visitorTable } from '../domain';
import { useT } from '../i18n';
import type { Dish } from '../menu';
import { type Page, pages } from './pages';
import { Detalle } from './pages/Detalle';
import { store } from './store';

export function Comensal({ onHome }: { onHome: () => void }) {
  const { cart, tables, callWaiter } = useStore(store);
  const t = useT();
  const mesa = findVisitorTable(tables);
  const [page, setPage] = useState<Page>('carta');
  const [detail, setDetail] = useState<Dish | null>(null);
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const current = pages.find((item) => item.page === page) ?? pages[0];
  const go = (next: Page) => {
    setPage(next);
    setDetail(null);
  };
  const title = detail ? detail.name : current.title(t);
  return (
    <div className="screen" data-surface="comensal">
      <Navbar
        start={
          <ArrowButton
            className={detail ? undefined : 'desktop-only'}
            onClick={() => (detail ? setDetail(null) : onHome())}
          >
            {detail ? t('menu') : t('back')}
          </ArrowButton>
        }
        title={title}
        logo={title === 'El Clan'}
        end={
          <button
            type="button"
            className="dark-button cart-button desktop-only"
            data-tour="enviar"
            aria-label={t('viewOrder')(count)}
            onClick={() => go('carrito')}
          >
            <ShoppingCart aria-hidden="true" strokeWidth={2.5} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
        }
      />
      <div className="screen-body">
        <nav className="sidebar tabbar" aria-label={t('diner')}>
          <div className="sidebar-guest">
            <span className="avatar" aria-hidden="true">
              {visitorTable}
            </span>
            {t('table7')}
          </div>
          {pages.map((item) => (
            <button
              key={item.page}
              type="button"
              className="sidebar-item"
              data-tab={item.tab || undefined}
              data-tour={item.tour}
              aria-current={page === item.page && !detail ? 'page' : undefined}
              disabled={item.needsOrders && !mesa.orders.length}
              onClick={() => go(item.page)}
            >
              {item.icon}
              {item.label(t)}
              {item.page === 'carrito' && count > 0 && (
                <span className="count">{count}</span>
              )}
            </button>
          ))}
          <button
            type="button"
            className="sidebar-item"
            disabled={mesa.calls.includes('garzón')}
            onClick={callWaiter}
          >
            <ConciergeBell />
            {mesa.calls.includes('garzón')
              ? t('waiterComing')
              : t('waiterShort')}
          </button>
          <p className="sidebar-logo">
            El Clan<small>{t('withIclub')}</small>
          </p>
        </nav>
        <div className="board">
          {detail ? (
            <Detalle
              key={detail.id}
              dish={detail}
              onDone={() => setDetail(null)}
            />
          ) : (
            current.render({ go, openDish: setDetail })
          )}
        </div>
      </div>
    </div>
  );
}

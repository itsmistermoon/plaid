import { ConciergeBell } from 'lucide-react';
import { useState } from 'react';
import { useStore } from 'zustand';
import { ArrowButton, CartButton, Navbar } from '../components/Navbar';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import { findVisitorTable, visitorTable } from '../domain';
import { useT } from '../i18n';
import type { Dish } from '../menu';
import { type Page, pages } from './pages';
import { Detalle } from './pages/Detalle';
import { store } from './store';
import { useMedia } from './useMedia';

export function Comensal({ onHome }: { onHome: () => void }) {
  const { cart, tables, callWaiter } = useStore(store);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
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
        logo={title === 'Restaurant El Clan'}
        end={
          <CartButton
            className="desktop-only"
            tour="enviar"
            count={count}
            label={t('viewOrder')(count)}
            onClick={() => go('carrito')}
          />
        }
      />
      <div className="screen-body">
        <Sidebar label={t('diner')} table={visitorTable} tabbar={phone}>
          {pages.map((item) => (
            <SidebarItem
              key={item.page}
              icon={item.icon}
              label={item.label(t)}
              tab={item.tab}
              tour={item.tour}
              current={page === item.page && !detail}
              disabled={item.needsOrders && !mesa.orders.length}
              count={item.page === 'carrito' ? count : undefined}
              onClick={() => go(item.page)}
            />
          ))}
          <SidebarItem
            icon={<ConciergeBell />}
            label={
              mesa.calls.includes('garzón')
                ? t('waiterComing')
                : t('waiterShort')
            }
            disabled={mesa.calls.includes('garzón')}
            onClick={callWaiter}
          />
        </Sidebar>
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

import type { ReactNode } from 'react';
import { useT } from '../i18n';

/**
 * The Comensal's side menu: table on top, items and logo below. `tabbar` is
 * the phone's bottom bar, which only shows the items marked `tab`.
 */
export function Sidebar({
  label,
  table,
  tabbar,
  children,
}: {
  label: string;
  table: number;
  tabbar?: boolean;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <nav className={tabbar ? 'sidebar tabbar' : 'sidebar'} aria-label={label}>
      <div className="sidebar-guest">
        <span className="avatar" aria-hidden="true">
          {table}
        </span>
        {t('tableN')(table)}
      </div>
      {children}
      <p className="sidebar-logo">
        Restaurant El Clan<small>{t('withIclub')}</small>
      </p>
    </nav>
  );
}

/** A side menu item: icon, label and optional count. */
export function SidebarItem({
  icon,
  label,
  current,
  disabled,
  count,
  tab,
  tour,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  current?: boolean;
  disabled?: boolean;
  count?: number;
  /** Appears in the phone's bottom bar. */
  tab?: boolean;
  tour?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="sidebar-item"
      data-tab={tab || undefined}
      data-tour={tour}
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
      {!!count && <span className="count">{count}</span>}
    </button>
  );
}

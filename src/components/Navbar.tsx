import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

/** Barra oscura y brillante de la pantalla: acción, título y acción. */
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

/** Botón con punta de flecha a la izquierda, para volver. */
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

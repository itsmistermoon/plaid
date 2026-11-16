import type { ReactNode } from 'react';

/** Cinta de tela que cuelga desde el borde superior del panel, con cola de golondrina. */
export function Ribbon({ children }: { children: ReactNode }) {
  return (
    <h3 className="ribbon">
      <span className="ribbon-cloth">
        <svg
          className="ribbon-stitch"
          viewBox="0 0 100 26"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points="0,20 50,7 100,20" />
        </svg>
        {children}
      </span>
    </h3>
  );
}

import type { ReactNode } from 'react';

/** Cinta de tela que cuelga desde el borde superior del panel, con cola de golondrina. */
export function Ribbon({ children }: { children: ReactNode }) {
  return (
    <h3 className="ribbon">
      <span className="ribbon-cloth">
        {/* La costura sigue los lados y la cola, nunca el borde superior:
            los lados van de arriba a las puntas y la V, en un svg anidado de
            13 px de alto, sube desde las puntas hasta el centro. */}
        <svg className="ribbon-stitch" aria-hidden="true">
          <line x1="0" y1="0" x2="0" y2="100%" />
          <line x1="100%" y1="0" x2="100%" y2="100%" />
          <svg
            aria-hidden="true"
            y="100%"
            width="100%"
            height="13"
            viewBox="0 0 100 13"
            preserveAspectRatio="none"
            overflow="visible"
          >
            <polyline points="0,0 50,-13 100,0" />
          </svg>
        </svg>
        {children}
      </span>
    </h3>
  );
}

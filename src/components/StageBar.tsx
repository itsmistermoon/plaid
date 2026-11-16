import type { ReactNode } from 'react';
import { useMedia } from '../demo/useMedia';

/**
 * Barra de controles del demo y la galería. En teléfono lleva `data-phone`:
 * los controles pasan a sus medidas compactas.
 */
export function StageBar({ children }: { children: ReactNode }) {
  const phone = useMedia('(max-width: 760px)');
  return (
    <header className="stage-bar" data-phone={phone || undefined}>
      {children}
    </header>
  );
}

import type { ReactNode } from 'react';
import { useMedia } from '../demo/useMedia';

/**
 * Control bar of the demo and the gallery. On phones it carries `data-phone`:
 * the controls switch to their compact sizes.
 */
export function StageBar({ children }: { children: ReactNode }) {
  const phone = useMedia('(max-width: 760px)');
  return (
    <header className="stage-bar" data-phone={phone || undefined}>
      {children}
    </header>
  );
}

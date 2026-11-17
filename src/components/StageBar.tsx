import type { ReactNode } from 'react';
import { useMedia } from '../demo/useMedia';

/** Title, tagline and short description under the control bar of the demo and the gallery. */
export function StageIntro({
  title,
  tagline,
  description,
}: {
  title: string;
  tagline: string;
  description: ReactNode;
}) {
  return (
    <div className="stage-intro">
      <h1>
        {title} <small>{tagline}</small>
      </h1>
      <p>{description}</p>
    </div>
  );
}

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

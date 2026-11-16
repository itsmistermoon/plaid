import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@ui-sdk/react/scroll-area';
import type { ReactNode } from 'react';

/** Zona con scroll nativo y la barra delgada del kit. */
export function Scroller({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <ScrollArea className="scroller" type="always">
      <ScrollAreaViewport
        className="scroller-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <ScrollAreaContent>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar className="scroller-bar">
        <ScrollAreaThumb className="scroller-thumb" />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}

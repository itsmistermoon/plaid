import type { ReactNode } from 'react';

/** Cloth ribbon hanging from the panel's top edge, with a swallowtail. */
export function Ribbon({ children }: { children: ReactNode }) {
  return (
    <h3 className="ribbon">
      <span className="ribbon-cloth">
        {/* The stitching follows the sides and the tail, never the top edge:
            the sides run from the top to the points and the V, in a nested
            13 px-tall svg that rises from the points to the center. */}
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

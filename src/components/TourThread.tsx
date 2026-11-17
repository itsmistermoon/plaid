import { useEffect, useState } from 'react';
import type { tourSteps } from '../tour';

interface Thread {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

const GAP = 4;

/** What the step points at. A target inside a segmented selector points at the whole selector. */
function targets(step: (typeof tourSteps)[number]): Element[] {
  const found = document.querySelectorAll(
    `.app [data-tour~="${step}"]:not([aria-pressed="true"])`,
  );
  const set = new Set<Element>();
  for (const element of found) set.add(element.closest('.selector') ?? element);
  return [...set];
}

function measure(element: Element): Thread | null {
  const box = element.getBoundingClientRect();
  if (box.width === 0 || box.height === 0) return null;
  const radius = Number.parseFloat(getComputedStyle(element).borderRadius) || 0;
  return {
    x: box.left - GAP,
    y: box.top - GAP,
    width: box.width + GAP * 2,
    height: box.height + GAP * 2,
    radius: radius + GAP,
  };
}

/**
 * The tour's highlight: a running thread (a dashed stitch that travels along
 * the border) around whatever the current step points at. It is an overlay,
 * so it is not clipped by the pieces it surrounds, and it follows them while
 * the layout moves.
 */
export function TourThread({ step }: { step: (typeof tourSteps)[number] }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  useEffect(() => {
    let frame = 0;
    let last = '';
    const follow = () => {
      const next = targets(step)
        .map(measure)
        .filter((thread): thread is Thread => thread !== null);
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setThreads(next);
      }
      frame = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(frame);
  }, [step]);
  return (
    <svg className="tour-threads" aria-hidden="true">
      {threads.map((thread) => (
        <rect
          key={`${thread.x}:${thread.y}`}
          className="tour-thread"
          x={thread.x}
          y={thread.y}
          width={thread.width}
          height={thread.height}
          rx={thread.radius}
        />
      ))}
    </svg>
  );
}

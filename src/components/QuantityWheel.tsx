import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { tick } from '../lib/tick';
import {
  crossed,
  flingTarget,
  give,
  settleStep,
  toothOffset,
} from '../lib/wheel';

// Tambor vertical y dientes en el borde, mezcla del select wheel y la
// page-wheel de spec-01 (Shu Ding, MIT), con piel propia.
const row = 30;
const stepDeg = 24;
const radius = row / ((stepDeg * Math.PI) / 180);
const pitch = 4;
const teeth = Array.from(
  { length: Math.ceil((Math.PI * radius) / pitch) + 2 },
  (_, i) => i,
);

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Ruleta de cantidad: un tambor que hace clic en cada número.
 *
 * NumberInput de UI SDK es la fuente de verdad (spinbutton, teclado y flechas
 * que repiten al mantenerlas). El tambor solo dibuja: las entradas mueven un
 * objetivo y un único loop lo alcanza con resorte, sonando y vibrando cada
 * vez que un número cruza el centro.
 */
export function QuantityWheel({
  value,
  onChange,
  label,
  min = 1,
  max = 20,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const [center, setCenter] = useState(value);
  const windowEl = useRef<HTMLSpanElement>(null);
  const motion = useRef({
    pos: value,
    vel: 0,
    target: value,
    center: value,
    frame: 0,
    last: 0,
  });
  const drag = useRef<{
    y: number;
    target: number;
    samples: [number, number][];
    moved: boolean;
  } | null>(null);
  const latest = useRef({ value, onChange, min, max });
  latest.current = { value, onChange, min, max };

  const clamp = (p: number) => Math.min(max, Math.max(min, p));
  const commit = (next: number) => {
    const { value, onChange } = latest.current;
    if (next !== value) onChange(next);
  };

  const teethEls = useRef<HTMLElement[] | null>(null);
  const paint = () => {
    const el = windowEl.current;
    if (!el) return;
    teethEls.current ??= [...el.querySelectorAll<HTMLElement>('[data-tooth]')];
    const { pos } = motion.current;
    // Los dientes rodean la curva del tambor: se apiñan hacia los bordes.
    const half = teeth.length / 2;
    for (const tooth of teethEls.current) {
      const angle =
        toothOffset(Number(tooth.dataset.tooth) - half, pos, row, pitch) /
        radius;
      const visible = Math.abs(angle) < Math.PI / 2;
      tooth.style.transform = visible
        ? `translateY(${(radius * Math.sin(angle)).toFixed(2)}px) scaleY(${Math.cos(angle).toFixed(3)})`
        : 'scaleY(0)';
      tooth.style.opacity = visible
        ? (0.25 + 0.75 * Math.cos(angle)).toFixed(2)
        : '0';
    }
    for (const face of el.querySelectorAll<HTMLElement>('[data-n]')) {
      const d = Number(face.dataset.n) - pos;
      const angle = Math.max(-90, Math.min(90, d * stepDeg));
      const rad = (angle * Math.PI) / 180;
      face.style.transform = `translateY(${(radius * Math.sin(rad)).toFixed(2)}px) translateZ(${(radius * (Math.cos(rad) - 1)).toFixed(2)}px) rotateX(${(-angle).toFixed(2)}deg)`;
      face.style.opacity = Math.max(0, 1 - Math.abs(d) * 0.3).toFixed(2);
    }
  };

  // El único loop: lleva el tambor al objetivo y suena en cada detente.
  const run = () => {
    const m = motion.current;
    if (m.frame) return;
    m.last = performance.now();
    const frame = (now: number) => {
      const dt = Math.max(0, now - m.last);
      m.last = now;
      if (drag.current) {
        m.pos = m.target;
        m.vel = 0;
      } else if (reducedMotion()) {
        m.pos = m.target;
        m.vel = 0;
      } else {
        Object.assign(m, settleStep(m, m.target, dt));
      }
      paint();
      if (crossed(m.center, m.pos)) {
        tick();
        m.center = Math.round(m.pos);
        setCenter(m.center);
      }
      if (m.pos === m.target && m.vel === 0 && !drag.current) {
        m.frame = 0;
        return;
      }
      m.frame = requestAnimationFrame(frame);
    };
    m.frame = requestAnimationFrame(frame);
  };

  const aim = (target: number) => {
    motion.current.target = target;
    run();
  };

  useLayoutEffect(paint);

  // Solo un cambio de valor desde fuera (flechas, teclado, tipeo) lo mueve.
  useEffect(() => {
    if (!drag.current && motion.current.target !== value) aim(value);
  }, [value]);

  // La rueda del mouse mueve el objetivo y se asienta al detenerse. El
  // listener de React es pasivo, así que se agrega aquí para frenar el scroll.
  useEffect(() => {
    const el = windowEl.current;
    if (!el || disabled) return;
    let settle = 0;
    const onWheel = (event: WheelEvent) => {
      if (!event.deltaY) return;
      event.preventDefault();
      const m = motion.current;
      const { min, max } = latest.current;
      m.target = give(m.target + event.deltaY / row / 1.5, min, max);
      run();
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        const { min, max } = latest.current;
        const p = Math.min(
          max,
          Math.max(min, Math.round(motion.current.target)),
        );
        aim(p);
        commit(p);
      }, 120);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(settle);
    };
  }, [disabled]);

  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);

  const goTo = (next: number) => {
    const p = clamp(next);
    aim(p);
    commit(p);
  };

  const numbers = [];
  for (let n = Math.max(min, center - 4); n <= Math.min(max, center + 4); n++)
    numbers.push(n);

  return (
    <NumberInput
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      onValueChange={(next) => onChange(next ?? min)}
    >
      <NumberInputGroup className="wheel">
        <span
          ref={windowEl}
          className="wheel-window"
          onPointerDown={(event) => {
            if (disabled || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = {
              y: event.clientY,
              target: motion.current.target,
              samples: [],
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            const d = drag.current;
            if (!d) return;
            const dy = event.clientY - d.y;
            if (!d.moved && Math.abs(dy) < 3) return;
            if (!d.moved) event.currentTarget.dataset.dragging = '';
            d.moved = true;
            // Arrastrar hacia abajo trae los números menores, como un picker.
            const target = give(d.target - dy / row, min, max);
            d.samples = [...d.samples.slice(-4), [performance.now(), target]];
            aim(target);
          }}
          onPointerUp={(event) => {
            const d = drag.current;
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            if (!d) return;
            if (!d.moved) {
              // Un toque arriba o abajo del centro sube o baja uno.
              const box = event.currentTarget.getBoundingClientRect();
              const offset = event.clientY - box.top - box.height / 2;
              if (Math.abs(offset) > row / 2)
                goTo(Math.round(motion.current.target) + (offset < 0 ? -1 : 1));
              else run();
              return;
            }
            const [a, b] = [d.samples[0], d.samples.at(-1)];
            const velocity =
              a && b && b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
            goTo(flingTarget(motion.current.target, velocity, min, max));
          }}
          onPointerCancel={(event) => {
            drag.current = null;
            delete event.currentTarget.dataset.dragging;
            goTo(Math.round(motion.current.target));
          }}
        >
          {['left', 'right'].map((edge) => (
            <span
              key={edge}
              className="wheel-teeth"
              data-edge={edge}
              aria-hidden="true"
            >
              {teeth.map((i) => (
                <i key={i} data-tooth={i} />
              ))}
            </span>
          ))}
          <span className="wheel-drum" aria-hidden="true">
            {numbers.map((n) => (
              <span
                key={n}
                data-n={n}
                className="wheel-face"
                data-current={n === center || undefined}
              >
                {n}
              </span>
            ))}
          </span>
          <NumberInputControl
            className="wheel-value"
            aria-label={label}
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
          />
        </span>
        <span className="wheel-arrows">
          <NumberInputIncrement aria-label="Agregar una unidad">
            <ChevronUp aria-hidden="true" />
          </NumberInputIncrement>
          <NumberInputDecrement aria-label="Quitar una unidad">
            <ChevronDown aria-hidden="true" />
          </NumberInputDecrement>
        </span>
      </NumberInputGroup>
    </NumberInput>
  );
}

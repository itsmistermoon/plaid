import { ArrowLeftRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useT } from '../i18n';

/**
 * Elección binaria en teléfono: muestra el valor actual y al tocarla pasa al otro.
 * La etiqueta accesible nombra ambos valores.
 */
export function SelectorToggle({
  className,
  label,
  current,
  next,
  onClick,
  ...rest
}: {
  className: string;
  label: string;
  current: string;
  next: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  'data-tour'?: string;
}) {
  const t = useT();
  return (
    <button
      type="button"
      className={`dark-button selector-toggle ${className}`}
      aria-label={t('switchTo')(label, current, next)}
      onClick={onClick}
      {...rest}
    >
      <span>{current}</span>
      <ArrowLeftRight aria-hidden="true" />
    </button>
  );
}

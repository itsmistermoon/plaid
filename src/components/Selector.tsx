import type { ReactNode } from 'react';

/**
 * Segmented group of the demo bar: one option selected at a time. An option
 * with a face (an icon, a date) shows it in place of its label, which stays
 * its accessible name.
 */
export function Selector<V extends string>({
  className,
  legend,
  options,
  value,
  onChange,
}: {
  className: string;
  legend: string;
  options: { value: V; label: string; face?: ReactNode; tour?: string }[];
  value: V;
  onChange: (value: V, event: Event) => void;
}) {
  return (
    <fieldset className={`selector ${className}`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          aria-label={option.face ? option.label : undefined}
          data-tour={option.tour}
          onClick={(event) => onChange(option.value, event.nativeEvent)}
        >
          {option.face || option.label}
        </button>
      ))}
    </fieldset>
  );
}

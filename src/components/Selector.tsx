/** Grupo segmentado de la barra del demo: una opción marcada a la vez. */
export function Selector<V extends string>({
  className,
  legend,
  options,
  value,
  onChange,
}: {
  className: string;
  legend: string;
  options: { value: V; label: string; tour?: string }[];
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
          data-tour={option.tour}
          onClick={(event) => onChange(option.value, event.nativeEvent)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

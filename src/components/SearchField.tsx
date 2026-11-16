import { Input, InputClear, InputGroup } from '@ui-sdk/react/input';
import { Search, X } from 'lucide-react';

/** Campo de búsqueda redondeado con lupa y botón para borrar. */
export function SearchField({
  label,
  value,
  onChange,
  disabled,
  invalid,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <InputGroup className="search" data-invalid={invalid || undefined}>
      <Search aria-hidden="true" className="search-icon" />
      <Input
        type="search"
        aria-label={label}
        aria-invalid={invalid || undefined}
        placeholder="Buscar"
        value={value}
        disabled={disabled}
        onValueChange={(next) => onChange?.(next)}
      />
      <InputClear aria-label="Borrar búsqueda" className="search-clear">
        <X aria-hidden="true" strokeWidth={3} />
      </InputClear>
    </InputGroup>
  );
}

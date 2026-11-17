import { Input, InputClear, InputGroup } from '@ui-sdk/react/input';
import { Search, X } from 'lucide-react';
import { useT } from '../i18n';

/** Rounded search field with a magnifier and a clear button. */
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
  const t = useT();
  return (
    <InputGroup className="search" data-invalid={invalid || undefined}>
      <Search aria-hidden="true" className="search-icon" />
      <Input
        type="search"
        aria-label={label}
        aria-invalid={invalid || undefined}
        placeholder={t('search')}
        value={value}
        disabled={disabled}
        onValueChange={(next) => onChange?.(next)}
      />
      <InputClear aria-label={t('clearSearch')} className="search-clear">
        <X aria-hidden="true" strokeWidth={3} />
      </InputClear>
    </InputGroup>
  );
}

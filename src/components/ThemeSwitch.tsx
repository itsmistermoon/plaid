import { usePreference } from '@ui-sdk/react/preferences';
import { theme } from '../theme';

const options = [
  { value: 'original', label: 'Original' },
  { value: 'moderno', label: 'Moderno' },
] as const;

/** Switch entre la piel original (2012) y la moderna. */
export function ThemeSwitch() {
  const { value } = usePreference(theme);
  return (
    <fieldset className="selector">
      <legend className="sr-only">Tema</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={(event) =>
            theme.set(option.value, {
              reason: 'press',
              event: event.nativeEvent,
            })
          }
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

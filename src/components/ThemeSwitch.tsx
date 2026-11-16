import { usePreference } from '@ui-sdk/react/preferences';
import { useT } from '../i18n';
import { theme } from '../theme';

const options = ['original', 'moderno'] as const;

/** Switch entre la piel original (2012) y la moderna. */
export function ThemeSwitch() {
  const { value } = usePreference(theme);
  const t = useT();
  return (
    <fieldset className="selector theme-switch">
      <legend className="sr-only">{t('themeSwitch')}</legend>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={(event) =>
            theme.set(option, {
              reason: 'press',
              event: event.nativeEvent,
            })
          }
        >
          {t('themes')[option]}
        </button>
      ))}
    </fieldset>
  );
}

import type { ColorSchemeValue } from '@ui-sdk/core';
import { usePreference } from '@ui-sdk/react/preferences';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useMedia } from '../demo/useMedia';
import { useT } from '../i18n';
import { colorScheme, theme } from '../theme';

const options = [
  'system',
  'light',
  'dark',
] as const satisfies readonly ColorSchemeValue[];
const icons = { system: Monitor, light: Sun, dark: Moon };

/**
 * Light or dark for the Slate theme (system, light, dark). The Plaid theme
 * is always dark, so there the control stays in place but disabled. On phones,
 * a single icon button that cycles through the three choices.
 */
export function SchemeSwitch() {
  const { value } = usePreference(colorScheme);
  const { value: skin } = usePreference(theme);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const names = t('schemes');
  const disabled = skin !== 'slate';
  const title = disabled ? t('schemeSlateOnly') : undefined;
  const choose = (option: ColorSchemeValue, event: Event) =>
    colorScheme.set(option, { reason: 'press', event });
  if (phone) {
    const next = options[(options.indexOf(value) + 1) % options.length];
    const Icon = icons[value];
    return (
      <button
        type="button"
        className="dark-button scheme-switch"
        aria-label={t('switchTo')(t('schemeSwitch'), names[value], names[next])}
        title={title}
        disabled={disabled}
        onClick={(event) => choose(next, event.nativeEvent)}
      >
        <Icon aria-hidden="true" />
      </button>
    );
  }
  return (
    <fieldset
      className="selector scheme-switch"
      disabled={disabled}
      title={title}
    >
      <legend className="sr-only">{t('schemeSwitch')}</legend>
      {options.map((option) => {
        const Icon = icons[option];
        return (
          <button
            key={option}
            type="button"
            aria-label={names[option]}
            title={title ?? names[option]}
            aria-pressed={value === option}
            onClick={(event) => choose(option, event.nativeEvent)}
          >
            <Icon aria-hidden="true" />
          </button>
        );
      })}
    </fieldset>
  );
}

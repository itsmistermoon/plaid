import type { ColorSchemeValue } from '@ui-sdk/core';
import { usePreference } from '@ui-sdk/react/preferences';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useMedia } from '../demo/useMedia';
import { useT } from '../i18n';
import { colorScheme, theme } from '../theme';
import { Tip } from './Tip';

const options = [
  'system',
  'light',
  'dark',
] as const satisfies readonly ColorSchemeValue[];
const icons = { system: Monitor, light: Sun, dark: Moon };

/**
 * Light or dark for the Slate theme (system, light, dark). The Plaid theme
 * is always dark, so there the control stays in place but disabled
 * (`aria-disabled`, so its hint can still explain why). On phones, a single
 * icon button that cycles through the three choices.
 */
export function SchemeSwitch() {
  const { value } = usePreference(colorScheme);
  const { value: skin } = usePreference(theme);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const names = t('schemes');
  const disabled = skin !== 'slate';
  const choose = (option: ColorSchemeValue, event: Event) => {
    if (!disabled) colorScheme.set(option, { reason: 'press', event });
  };
  if (phone) {
    const next = options[(options.indexOf(value) + 1) % options.length];
    const Icon = icons[value];
    return (
      <Tip
        hint={disabled ? t('schemeSlateOnly') : t('schemeSwitch')}
        render={
          <button
            type="button"
            className="dark-button scheme-switch"
            aria-label={t('switchTo')(
              t('schemeSwitch'),
              names[value],
              names[next],
            )}
            aria-disabled={disabled || undefined}
            onClick={(event) => choose(next, event.nativeEvent)}
          />
        }
      >
        <Icon aria-hidden="true" />
      </Tip>
    );
  }
  return (
    <fieldset
      className="selector scheme-switch"
      aria-disabled={disabled || undefined}
    >
      <legend className="sr-only">{t('schemeSwitch')}</legend>
      {options.map((option) => {
        const Icon = icons[option];
        return (
          <Tip
            key={option}
            hint={disabled ? t('schemeSlateOnly') : names[option]}
            naming={!disabled}
            render={
              <button
                type="button"
                aria-label={names[option]}
                aria-pressed={value === option}
                aria-disabled={disabled || undefined}
                onClick={(event) => choose(option, event.nativeEvent)}
              />
            }
          >
            <Icon aria-hidden="true" />
          </Tip>
        );
      })}
    </fieldset>
  );
}

import { usePreference } from '@ui-sdk/react/preferences';
import { useMedia } from '../demo/useMedia';
import { useT } from '../i18n';
import { theme } from '../theme';
import { Selector } from './Selector';
import { SelectorToggle } from './SelectorToggle';

const options = ['plaid', 'slate'] as const;

/** Switch between the Plaid (2012) skin and the Slate one. On phones, a single toggle button. */
export function ThemeSwitch() {
  const { value } = usePreference(theme);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const choose = (option: (typeof options)[number], event: Event) =>
    theme.set(option, { reason: 'press', event });
  if (phone) {
    const next = value === 'plaid' ? 'slate' : 'plaid';
    return (
      <SelectorToggle
        className="theme-switch"
        label={t('themeSwitch')}
        current={t('themes')[value === 'plaid' ? 'plaid' : 'slate']}
        next={t('themes')[next]}
        onClick={(event) => choose(next, event.nativeEvent)}
      />
    );
  }
  return (
    <Selector
      className="theme-switch"
      legend={t('themeSwitch')}
      value={value === 'plaid' ? 'plaid' : 'slate'}
      options={options.map((option) => ({
        value: option,
        label: t('themes')[option],
      }))}
      onChange={choose}
    />
  );
}

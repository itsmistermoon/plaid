import { usePreference } from '@ui-sdk/react/preferences';
import { useMedia } from '../demo/useMedia';
import { useT } from '../i18n';
import { theme } from '../theme';
import { Selector } from './Selector';
import { SelectorToggle } from './SelectorToggle';

const options = ['original', 'moderno'] as const;

/** Switch between the original (2012) skin and the modern one. On phones, a single toggle button. */
export function ThemeSwitch() {
  const { value } = usePreference(theme);
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const choose = (option: (typeof options)[number], event: Event) =>
    theme.set(option, { reason: 'press', event });
  if (phone) {
    const next = value === 'original' ? 'moderno' : 'original';
    return (
      <SelectorToggle
        className="theme-switch"
        label={t('themeSwitch')}
        current={t('themes')[value === 'original' ? 'original' : 'moderno']}
        next={t('themes')[next]}
        onClick={(event) => choose(next, event.nativeEvent)}
      />
    );
  }
  return (
    <Selector
      className="theme-switch"
      legend={t('themeSwitch')}
      value={value === 'original' ? 'original' : 'moderno'}
      options={options.map((option) => ({
        value: option,
        label: t('themes')[option],
      }))}
      onChange={choose}
    />
  );
}

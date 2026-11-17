import { useT } from '../i18n';
import { type Tab, tabs } from '../menu';

/** Category tabs pinned above the board; the shadow appears on scroll. */
export function CategoryTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (tab: Tab) => void;
}) {
  const t = useT();
  return (
    <div className="tabs-bar">
      <div
        className="segmented"
        role="tablist"
        aria-label={t('categoriesLabel')}
      >
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={value === item}
            onClick={() => onChange(item)}
          >
            {t('categories')[item]}
          </button>
        ))}
      </div>
    </div>
  );
}

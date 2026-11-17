import { useT } from '../i18n';

const behanceUrl =
  'https://www.behance.net/gallery/43812871/iClub-Interactive-menu-for-restaurants-on-tablets';

/** Footer shared by the demo and the gallery: links to the original design, the code and the case study. */
export function Footer() {
  const t = useT();
  const links = [
    [t('footerOriginal'), behanceUrl],
    [t('footerCode'), 'https://github.com/itsmistermoon/plaid-ui-kit'],
    [t('footerX'), 'https://x.com/itsmistermoon'],
    [t('footerCase'), t('footerCaseUrl')],
  ];
  return (
    <footer className="site-footer">
      <nav aria-label={t('footerLabel')}>
        {links.map(([label, href]) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

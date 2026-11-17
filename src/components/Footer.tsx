import { Fragment } from 'react';
import { useT } from '../i18n';

const behanceUrl =
  'https://www.behance.net/gallery/43812871/iClub-Interactive-menu-for-restaurants-on-tablets';

const xUrl = 'https://x.com/itsmistermoon';

function Separator() {
  return <span aria-hidden="true">·</span>;
}

/** Footer shared by the demo and the gallery: links to the original design, the code and the case study. */
export function Footer() {
  const t = useT();
  const links = [
    [t('footerOriginal'), behanceUrl],
    [t('footerCase'), t('footerCaseUrl')],
    ['GitHub', 'https://github.com/itsmistermoon/plaid-ui-kit'],
  ];
  return (
    <footer className="site-footer">
      <nav aria-label={t('footerLabel')}>
        {links.map(([label, href]) => (
          <Fragment key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
            <Separator />
          </Fragment>
        ))}
        <span>
          {t('footerBy')}{' '}
          <a href={xUrl} target="_blank" rel="noopener noreferrer">
            @itsmistermoon
          </a>
        </span>
      </nav>
    </footer>
  );
}

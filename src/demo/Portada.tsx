import { Scanner } from '../components/Scanner';
import { useT } from '../i18n';

export function Portada({ onEnter }: { onEnter: () => void }) {
  const t = useT();
  return (
    <div className="screen portada" data-surface="comensal">
      <h2 className="sr-only">{t('welcome')}</h2>
      <Scanner />
      <p className="portada-text">{t('scanQr')}</p>
      <button
        type="button"
        className="light-button"
        data-tour="elegir"
        onClick={onEnter}
      >
        {t('sitDown')}
      </button>
    </div>
  );
}

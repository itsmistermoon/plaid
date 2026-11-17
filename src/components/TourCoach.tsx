import { Pointer } from 'lucide-react';
import { useEffect } from 'react';
import { useT } from '../i18n';
import { type Tour, tourSteps } from '../tour';

/**
 * The tour's help layer, a reinterpretation of iClub's: a handwritten note
 * with a pointing hand. It does not cover the demo; what it points at is
 * marked with `data-tour` on each screen.
 */
export function TourCoach({
  tour,
  onSkip,
  onEnd,
}: {
  tour: Tour;
  onSkip: () => void;
  onEnd: () => void;
}) {
  const t = useT();
  const finished = tour.step >= tourSteps.length;
  const close = finished ? onEnd : onSkip;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);
  const [title, body] = t('tourSteps')[tourSteps[tour.step] ?? 'listo'];
  return (
    <section
      className="tour"
      aria-label={t('tour')}
      data-finished={finished || undefined}
    >
      <Pointer className="tour-hand" aria-hidden="true" strokeWidth={2.5} />
      <div className="tour-text" aria-live="polite">
        <p className="tour-count">
          {finished
            ? t('tour')
            : t('tourStepOf')(tour.step + 1, tourSteps.length)}
        </p>
        <h2 key={tour.step}>{title}</h2>
        <p>{body}</p>
      </div>
      <ol className="tour-dots" aria-hidden="true">
        {tourSteps.map((step, index) => (
          <li key={step} data-done={index < tour.step || undefined} />
        ))}
      </ol>
      <button type="button" className="tour-close" onClick={close}>
        {finished ? t('tourEnd') : t('tourSkip')}
        <small>{t('tourSkipHint')}</small>
      </button>
    </section>
  );
}

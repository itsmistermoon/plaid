import { CircleHelp } from 'lucide-react';
import { useStore } from 'zustand';
import { useT } from '../i18n';
import { store } from './store';

/** Bar button that starts, skips or resumes the guided tour. */
export function TourButton() {
  const { tour, startTour, skipTour } = useStore(store);
  const touring = tour && !tour.skipped;
  const t = useT();
  return (
    <button
      type="button"
      className="dark-button tour-button"
      aria-pressed={!!touring}
      aria-label={tour?.skipped ? t('tourResume') : t('tour')}
      onClick={touring ? skipTour : startTour}
    >
      <CircleHelp aria-hidden="true" />
      <span className="reset-label">
        {tour?.skipped ? t('tourResume') : t('tourStart')}
      </span>
    </button>
  );
}

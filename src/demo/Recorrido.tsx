import { CircleHelp } from 'lucide-react';
import { useStore } from 'zustand';
import { Tip } from '../components/Tip';
import { useT } from '../i18n';
import { useMedia } from './useMedia';
import { store } from './store';

/** Bar button that starts, skips or resumes the guided tour. */
export function TourButton() {
  const { tour, startTour, skipTour } = useStore(store);
  const touring = tour && !tour.skipped;
  const t = useT();
  const phone = useMedia('(max-width: 760px)');
  const label = tour?.skipped ? t('tourResume') : t('tour');
  return (
    <Tip
      hint={label}
      naming
      disabled={!phone}
      render={
        <button
          type="button"
          className="dark-button tour-button"
          aria-pressed={!!touring}
          aria-label={label}
          onClick={touring ? skipTour : startTour}
        />
      }
    >
      <CircleHelp aria-hidden="true" />
      <span className="reset-label">
        {tour?.skipped ? t('tourResume') : t('tourStart')}
      </span>
    </Tip>
  );
}

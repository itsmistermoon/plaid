import { LayoutGrid, RotateCcw } from 'lucide-react';
import { type CSSProperties, useState } from 'react';
import { Link } from 'wouter';
import { useStore } from 'zustand';
import { LangSwitch } from '../components/LangSwitch';
import { SchemeSwitch } from '../components/SchemeSwitch';
import { Selector } from '../components/Selector';
import { SelectorToggle } from '../components/SelectorToggle';
import { StageBar, StageIntro } from '../components/StageBar';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { Tip } from '../components/Tip';
import { TourCoach } from '../components/TourCoach';
import { TourThread } from '../components/TourThread';
import { views } from '../domain';
import { pathFor, useLang, useT } from '../i18n';
import { tartanUrl } from '../tartan';
import { tourSteps } from '../tour';
import { Cocina } from './Cocina';
import { Comensal } from './Comensal';
import { Garzon } from './Garzon';
import { Portada } from './Portada';
import { TourButton } from './Recorrido';
import { store } from './store';
import { useMedia } from './useMedia';
import { useSimulator } from './useSimulator';

export function Demo() {
  const { view, setView, reset, tour, skipTour, endTour } = useStore(store);
  const touring = tour && !tour.skipped ? tour : null;
  const t = useT();
  const lang = useLang();
  const phone = useMedia('(max-width: 760px)');
  const [revision, setRevision] = useState(0);
  const [entered, setEntered] = useState(false);
  useSimulator();
  const roles = {
    comensal: t('diner'),
    garzon: t('waiter'),
    cocina: t('kitchen'),
  };
  // On phones the role is one button that cycles through the three.
  const nextView = views[(views.indexOf(view) + 1) % views.length];
  return (
    <main
      className="app"
      style={{ '--clan-tartan': tartanUrl() } as CSSProperties}
      data-view={view}
      data-tour-step={touring ? tourSteps[touring.step] : undefined}
    >
      <StageBar>
        <ThemeSwitch />
        <SchemeSwitch />
        <LangSwitch />
        {phone ? (
          <SelectorToggle
            className="role-switch"
            label={t('device')}
            current={roles[view]}
            next={roles[nextView]}
            data-tour={view === 'comensal' ? 'sala servir cobrar' : 'cuenta'}
            onClick={() => setView(nextView)}
          />
        ) : (
          <Selector
            className="role-switch"
            legend={t('device')}
            value={view}
            options={[
              { value: 'comensal', label: roles.comensal, tour: 'cuenta' },
              {
                value: 'garzon',
                label: roles.garzon,
                tour: 'sala servir cobrar',
              },
              { value: 'cocina', label: roles.cocina },
            ]}
            onChange={setView}
          />
        )}
        <TourButton />
        <Tip
          hint={t('uiKit')}
          naming
          disabled={!phone}
          render={
            <Link
              href={pathFor('components', lang)}
              className="light-button kit-link"
              aria-label={t('uiKit')}
            />
          }
        >
          <LayoutGrid aria-hidden="true" />
          <span className="reset-label">{t('uiKit')}</span>
        </Tip>
        <Tip
          hint={t('resetDemo')}
          naming
          disabled={!phone}
          render={
            <button
              type="button"
              className="dark-button reset-button"
              aria-label={t('resetDemo')}
              onClick={() => {
                reset();
                setEntered(false);
                setRevision((value) => value + 1);
              }}
            />
          }
        >
          <RotateCcw aria-hidden="true" />
          <span className="reset-label">{t('resetDemo')}</span>
        </Tip>
      </StageBar>
      <StageIntro
        title={t('stageTitle')}
        tagline={t('stageSubtitle')}
        description={t('stageIntro')}
      />
      <div className="tablet">
        <span className="tablet-camera" aria-hidden="true" />
        <div className="tablet-glass">
          {view === 'garzon' ? (
            <Garzon key={revision} />
          ) : view === 'cocina' ? (
            <Cocina />
          ) : entered ? (
            <Comensal key={revision} onHome={() => setEntered(false)} />
          ) : (
            <Portada onEnter={() => setEntered(true)} />
          )}
        </div>
      </div>
      {touring && tourSteps[touring.step] && (
        <TourThread step={tourSteps[touring.step]} />
      )}
      {touring && (
        <TourCoach tour={touring} onSkip={skipTour} onEnd={endTour} />
      )}
    </main>
  );
}

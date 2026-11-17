import { toggleNotePreset } from '../domain';
import { useT } from '../i18n';

/** Usual kitchen requests under the post-it: each one writes itself into the note. */
export function NotePresets({
  note,
  onChange,
  disabled,
}: {
  note: string;
  onChange: (note: string) => void;
  disabled?: boolean;
}) {
  const t = useT();
  return (
    <fieldset className="selector note-presets" disabled={disabled}>
      <legend className="sr-only">{t('notePresetsLegend')}</legend>
      {t('notePresets').map((preset) => (
        <button
          key={preset}
          type="button"
          aria-pressed={notePhrases(note).includes(preset)}
          onClick={() => onChange(toggleNotePreset(note, preset))}
        >
          {preset}
        </button>
      ))}
    </fieldset>
  );
}

const notePhrases = (note: string) =>
  note.split(',').map((phrase) => phrase.trim());

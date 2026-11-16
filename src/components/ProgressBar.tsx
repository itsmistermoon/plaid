import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@ui-sdk/react/progress';

/** Barra de progreso del kit: canal hundido con relleno verde brillante. */
export function ProgressBar({
  label,
  value,
}: {
  label: string;
  /** `null` cuando el avance es desconocido. */
  value: number | null;
}) {
  return (
    <Progress className="progress" value={value}>
      <span className="progress-head">
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue />
      </span>
      <ProgressTrack className="progress-track">
        <ProgressIndicator className="progress-fill" />
      </ProgressTrack>
    </Progress>
  );
}

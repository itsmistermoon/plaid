import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@ui-sdk/react/progress';

/** The kit's progress bar: sunken channel with a bright green fill. */
export function ProgressBar({
  label,
  value,
}: {
  label: string;
  /** `null` when progress is unknown. */
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

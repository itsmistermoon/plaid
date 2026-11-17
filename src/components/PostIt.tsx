/** Yellow sticky note with a pin: the note for the kitchen. */
export function PostIt({
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="post-it">
      <span className="sr-only">{label}</span>
      <textarea
        value={value}
        maxLength={120}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!onChange}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}

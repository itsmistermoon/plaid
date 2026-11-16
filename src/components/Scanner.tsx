/** The cover's QR scanner: aluminum casing, laser window and three LEDs. */
export function Scanner() {
  return (
    <div className="scanner" aria-hidden="true">
      <span className="scanner-window">
        <span className="scanner-laser" />
      </span>
      <span className="scanner-leds">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

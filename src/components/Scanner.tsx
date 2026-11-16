/** Lector QR de la portada: carcasa de aluminio, ventana con láser y tres LED. */
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

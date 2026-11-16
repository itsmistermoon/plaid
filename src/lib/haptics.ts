// La vibración de un detente.
// Adaptado de lib/haptics.ts de spec-01 (Shu Ding, MIT).

// Safari no tiene Vibration API, pero iOS 18 vibra al alternar un
// <input type="checkbox" switch> a través de su label, incluso desde script.
let label: HTMLLabelElement | null = null;
function tapSwitch() {
  if (!label) {
    label = document.createElement('label');
    label.inert = true;
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText =
      'position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0.01;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.append(input);
    document.body.append(label);
  }
  label.click();
}

/** Un golpecito háptico, donde el dispositivo lo permite. */
export function haptic() {
  if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
  else if ('switch' in HTMLInputElement.prototype) {
    // Fuera de un gesto iOS no vibra; se deja quieto.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    tapSwitch();
  }
}

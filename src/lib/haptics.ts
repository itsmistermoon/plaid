// The vibration of a detent.
// Adapted from lib/haptics.ts in spec-01 (Shu Ding, MIT).

// Safari has no Vibration API, but iOS 18 vibrates when toggling an
// <input type="checkbox" switch> through its label, even from script.
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

/** A haptic tap, where the device allows it. */
export function haptic() {
  if (typeof navigator.vibrate === 'function') navigator.vibrate(8);
  else if ('switch' in HTMLInputElement.prototype) {
    // Outside a gesture iOS does not vibrate; leave it alone.
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    tapSwitch();
  }
}

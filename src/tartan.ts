/**
 * The Clan tartan of Restaurant El Clan: the single source of truth for the
 * pattern. The gallery, the favicon and the Open Graph image are all
 * generated from this sett.
 *
 * A tartan is described by its threadcount ("sett"): the order and width, in
 * threads, of each colored stripe. The sett is symmetric: it is written from
 * one pivot to the other and mirrored, and the pivot stripes are not repeated.
 * The same sett is used for the warp (vertical threads) and the weft
 * (horizontal threads); woven in a 2/2 twill, each crossing shows the warp
 * thread half of the time and the weft thread the other half, and that is what
 * makes the check.
 */

export type TartanColor = 'G' | 'K' | 'W' | 'Y';

/** Colors of the sett, from the brand palette. */
export const tartanColors: Record<TartanColor, string> = {
  /** The lettering green (`--brand` of the Plaid theme). */
  G: '#8fc23f',
  /** The dark slate of the stage (`--stage`). */
  K: '#2b3437',
  /** Cream, the plate and the receipt paper. */
  W: '#efe6c8',
  /** A thin gold accent thread (the waiter call). */
  Y: '#f0c453',
};

/** A half-sett from pivot to pivot: each stripe's color and width in threads. */
export type Sett = readonly (readonly [TartanColor, number])[];

/** The Clan's half-sett: K/8 G32 K6 G6 K24 W4 K24 Y/2. */
export const sett: Sett = [
  ['K', 8],
  ['G', 32],
  ['K', 6],
  ['G', 6],
  ['K', 24],
  ['W', 4],
  ['K', 24],
  ['Y', 2],
];

/** A threadcount written as weavers do, with the pivots marked by "/". */
export const threadcountOf = (design: Sett) =>
  design
    .map(([color, count], i) =>
      i === 0 || i === design.length - 1
        ? `${color}/${count}`
        : `${color}${count}`,
    )
    .join(' ');

/** The full repeat: the half-sett, then mirrored without repeating the pivots. */
export const fullSettOf = (design: Sett) => [
  ...design,
  ...design.slice(1, -1).reverse(),
];

/** Threads in one full repeat of a sett. */
export const settSizeOf = (design: Sett) =>
  fullSettOf(design).reduce((sum, [, count]) => sum + count, 0);

export const threadcount = threadcountOf(sett);
export const fullSett = fullSettOf(sett);
export const settSize = settSizeOf(sett);

export type TartanLayer = 'warp' | 'weft' | 'check';

function stripes(direction: 'warp' | 'weft', design: Sett) {
  const size = settSizeOf(design);
  let at = 0;
  return fullSettOf(design)
    .map(([color, count]) => {
      const rect =
        direction === 'warp'
          ? `<rect x="${at}" width="${count}" height="${size}" fill="${tartanColors[color]}"/>`
          : `<rect y="${at}" width="${size}" height="${count}" fill="${tartanColors[color]}"/>`;
      at += count;
      return rect;
    })
    .join('');
}

/**
 * One repeat of a tartan as an SVG document, one unit per thread. "warp" and
 * "weft" draw a single direction, "check" weaves both: the weft shows only
 * where the 2/2 twill passes it over the warp, in diagonal steps. Without a
 * design it is the Clan tartan.
 */
export function tartanSvg(
  layer: TartanLayer = 'check',
  size?: number,
  design: Sett = sett,
) {
  const threads = settSizeOf(design);
  const twill =
    '<pattern id="t" width="4" height="4" patternUnits="userSpaceOnUse">' +
    '<path d="M0 0h2v1H0zM1 1h2v1H1zM2 2h2v1H2zM3 3h1v1H3zM0 3h1v1H0z" fill="#fff"/>' +
    '</pattern><mask id="m"><rect width="100%" height="100%" fill="url(#t)"/></mask>';
  const body =
    layer === 'warp'
      ? stripes('warp', design)
      : layer === 'weft'
        ? stripes('weft', design)
        : `<defs>${twill}</defs>${stripes('warp', design)}<g mask="url(#m)">${stripes('weft', design)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size ?? threads}" height="${size ?? threads}" viewBox="0 0 ${threads} ${threads}" shape-rendering="crispEdges"><title>Clan tartan</title>${body}</svg>`;
}

/** A tartan as a `url()` ready for CSS backgrounds. */
export function tartanUrl(layer: TartanLayer = 'check', design: Sett = sett) {
  return `url("data:image/svg+xml,${encodeURIComponent(tartanSvg(layer, undefined, design))}")`;
}

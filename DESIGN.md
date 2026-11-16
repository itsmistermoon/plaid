# DESIGN.md

Design rules for plaid (a demo of Restaurant El Clan, a reconstruction of iClub). Every rule comes from a correction by the project owner; the comment keeps the date.

## Surfaces

- **In the original theme, every element is rebuilt with custom CSS/SVG, taking its shape, materials and proportions from the original. Bitmaps are never traced and PSD images are never pasted in.**
  Why: the goal is to show how a skeuomorphic interface would work today, not a pixel-by-pixel copy.
  <!-- 2026-11-15 -->
- **When a piece of the original looks crude, it is redesigned as a high-quality physical object instead of being copied. Being recognizable as the original matters more than fidelity.**
  Why: the piece should feel different and "special", not carry over the crudeness of the original.
  <!-- 2026-11-16 -->
- **The original's signature pieces (QR scanner, tablecloth, seals, receipt) keep their anatomy: the same parts, in the same position and with the same proportions.**
  Why: they are iClub's visual signature.
  <!-- 2026-11-16 -->
- **The title ribbon is a cloth hanging from the top edge of the panel, with no fold and no back side. It ends in a swallowtail with two points, never overflows the layout, and uses the saturated accent green, never a pale version.**
  Why: the effect of cloth folding in from behind did not read as convincing; only the part that sits on top remains.
  <!-- 2026-11-16 -->
- **The title ribbon uses the tablecloth green (`--plaid-green`), never a separate green.**
  Why: the ribbon and the tablecloth are the same cloth, so they must match.
  <!-- 2026-11-16 -->
- **The gingham tablecloth is larger than the table: it extends past its corners and is clipped.**
  Why: that is how the original looks.
  <!-- 2026-11-15 -->
- **The receipt paper has an intact top edge, with no teeth or perforation. Teeth appear only on the bottom edge.**
  Why: the paper comes out of the slot, so there is no cut at the top.
  <!-- 2026-11-16 -->
- **In the original theme, the paper always emerges from inside a slot: the slot mouth sits above the paper's edge and is wider than it, with an inner shadow where the paper enters.**
  Why: if the paper does not come out of the slot, the skeuomorphic illusion is lost.
  <!-- 2026-11-16 -->
- **The modern theme does not simulate physical objects: no slots, printers or paper. The receipt is a clean card.**
  Why: the modern theme does not simulate printed paper.
  <!-- 2026-11-16 -->
- **The modern theme is flat, shadcn-style, with the tablecloth green as its accent. Only the skin changes; structure, sizes and positions are the same in both themes.**
  Why: it lets the two themes be compared side by side.
  <!-- 2026-11-15 -->

## Color

- **Comensal and Garzón use the same structure: the same top bar, the same sidebar width and background, the same buttons and badges. Color always comes from per-theme variables, never from a value hardcoded in a single view.**
  Why: they must look like a single app.
  <!-- 2026-11-16 -->
- **In the original theme there is one green: the lettering green (`--brand`). `--plaid-green` equals it, and the ribbon, the tablecloth with its stripes and shades, and every active face (segmented, selector, switch, step, progress, toast) are shades of it made with `color-mix` (or the `--brand-*` tokens), never separate hex greens.**
  Why: the lettering, ribbon and tablecloth read as three different greens; the lettering green rules.
  <!-- 2026-11-16 -->
- **The phone selector toggle uses the inactive segment's surface (`--segment-face`), not the dark button's.**
  Why: next to a segmented control it looked darker than the inactive segment.
  <!-- 2026-11-16 -->
- **The navigation bars (top bar, sidebar and phone tab bar) use the same dark material; the accent green only marks the active item.**
  Why: the bright green tab bar competed with the content and did not look like part of the same app.
  <!-- 2026-11-16 -->

- **In the modern theme, surfaces use the slate scale (gray with a cool tint), never neutral or warm grays that read as beige.**
  Why: warm grays on backgrounds, tabs and panels give away a generic AI-made interface.
  <!-- 2026-11-16 -->

- **On the waiter's floor the tablecloth itself tells the table's state: a free table's cloth is faded and desaturated, an occupied one shows its full weave, and each open call weaves a thread of its color (`--thread-pedido` blue, `--thread-garzon` orange, `--thread-pago` red) into the warp and weft, in addition to its seal.**
  Why: the plaid is the kit's signature, so it should carry meaning, not only decoration.
  <!-- 2026-11-16 -->
- **Restaurant El Clan has its own tartan, defined once in `src/tartan.ts` by its threadcount (`K/8 G32 K6 G6 K24 W4 K24 Y/2`: green, slate, cream and a thin gold thread). The gallery accent, the "Tartan" section, the favicon and the Open Graph image are generated from it (`pnpm tartan:assets`); it is never redrawn by hand.**
  Why: one sett, one source of truth, like a registered tartan.
  <!-- 2026-11-16 -->
- **Textile token names are used only where the metaphor is honest: `--warp` and `--weft` for the tablecloth stripes, `--selvedge` for the cloth's hem, `--stitch` / `--stitch-dash` for sewn dashes (ribbon, modern hem) and `--thread-*` for call threads. Other tokens keep their plain names.**
  Why: the kit is named after the tablecloth; the names explain the pattern code without renaming everything.
  <!-- 2026-11-16 -->

## Typography

- **Typefaces: Courier Prime for the receipt, Outfit 700 for titles, Kaushan Script for the logo and Inter for the interface. No others are added.**
  Why: they were chosen by the project owner.
  <!-- 2026-11-15 -->
- **Icons come from `lucide-react`; custom icons are never drawn. Seals use `strokeWidth` 3. Extras uses `BadgePlus`.**
  Why: hand-drawn icons looked bad.
  <!-- 2026-11-15 -->

## Spacing & layout

- **No changing figure may move the layout: use `tabular-nums` and fixed-width columns. Controls have the same size and position in both themes and languages, with the width computed for the longest text between ES and EN.**
  Why: when things move, the interface feels messy.
  <!-- 2026-11-16 -->
- **Controls (buttons, search, selectors, segmented controls, checkbox, switch, stepper, sidebar and tab bar items) measure exactly the same in both themes, on desktop and phone: height, fixed width and padding come from shared variables (`--button-h`, `--field-h`, `--check-size`…) that no theme redefines. The modern theme only changes the skin; its outlines and insets are drawn with shadows, border colors or `background-clip`, never with different borders, margins or padding. The modern receipt is the only exception: it is a card without a printer, with a different typeface, and may measure differently.**
  Why: this way the two themes can be compared side by side without anything changing size.
  <!-- 2026-11-16 -->
- **Sticky bars, such as tabs and headers, have an opaque background and the content scrolls underneath them.**
  Why: if the content shows through, the interface looks broken.
  <!-- 2026-11-16 -->

## Motion

- **No decorative entrance animations are added. Only what responds to an action is animated, such as the click of the wheel.**
  Why: the paper-printing animation added nothing.
  <!-- 2026-11-16 -->

## Interaction

- **On every screen whose content can grow, the primary action goes at the top right and always stays visible. It never goes at the end of the content.**
  Why: with a long receipt the button ended up out of view.
  <!-- 2026-11-16 -->
- **The most important figure on a screen (for example, the order or bill total) is always visible next to the primary action, even if it is repeated elsewhere and breaks the physical metaphor.**
  Why: it is the most important information and must be seen immediately.
  <!-- 2026-11-16 -->
- **Quantity controls give physical feedback at every step (detent, sound, vibration). Their direction matches the arrow: up increases, and larger numbers sit on top.**
  Why: the wheel has to behave like a real object.
  <!-- 2026-11-16 -->

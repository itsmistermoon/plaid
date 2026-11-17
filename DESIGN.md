# DESIGN.md

Design rules for plaid (a demo of Restaurant El Clan, a reconstruction of iClub). Every rule comes from a correction by the project owner; the comment keeps the date.

## Surfaces

- **In the Plaid theme, every element is rebuilt with custom CSS/SVG, taking its shape, materials and proportions from the original. Bitmaps are never traced and PSD images are never pasted in.**
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
- **In the Plaid theme, the paper always emerges from inside a slot: the slot mouth sits above the paper's edge and is wider than it, with an inner shadow where the paper enters.**
  Why: if the paper does not come out of the slot, the skeuomorphic illusion is lost.
  <!-- 2026-11-16 -->
- **The Slate theme does not simulate physical objects: no slots, printers or paper. The receipt is a clean card.**
  Why: the Slate theme does not simulate printed paper.
  <!-- 2026-11-16 -->
- **The Slate theme is flat, shadcn-style, with the tablecloth green as its accent. Only the skin changes; structure, sizes and positions are the same in both themes.**
  Why: it lets the two themes be compared side by side.
  <!-- 2026-11-15 -->

## Color

- **Comensal and Garzón use the same structure: the same top bar, the same sidebar width and background, the same buttons and badges. Color always comes from per-theme variables, never from a value hardcoded in a single view.**
  Why: they must look like a single app.
  <!-- 2026-11-16 -->
- **In the Plaid theme there is one green: the lettering green (`--brand`). `--plaid-green` equals it, and the ribbon, the tablecloth with its stripes and shades, and every active face (segmented, selector, switch, step, progress, toast) are shades of it made with `color-mix` (or the `--brand-*` tokens), never separate hex greens.**
  Why: the lettering, ribbon and tablecloth read as three different greens; the lettering green rules.
  <!-- 2026-11-16 -->
- **The phone selector toggle uses the inactive segment's surface (`--segment-face`), not the dark button's.**
  Why: next to a segmented control it looked darker than the inactive segment.
  <!-- 2026-11-16 -->
- **In the Slate theme there is one green: `--accent`. Hover, soft background, tablecloth tints, notice border and ink, and glows are shades of it made with `color-mix` (`--accent-*` tokens), never separate hex greens.**
  Why: same rule as the Plaid theme; the greens must not drift apart.
  <!-- 2026-11-16 -->
- **The navigation bars (top bar, sidebar and phone tab bar) use the same dark material; the accent green only marks the active item.**
  Why: the bright green tab bar competed with the content and did not look like part of the same app.
  <!-- 2026-11-16 -->

- **In the Slate theme, surfaces use the slate scale (gray with a cool tint), never neutral or warm grays that read as beige.**
  Why: warm grays on backgrounds, tabs and panels give away a generic AI-made interface.
  <!-- 2026-11-16 -->

- **On the waiter's floor the tablecloth itself tells the table's state: a free table's cloth is faded and desaturated, an occupied one shows its full weave, and each open call weaves a thread of its color (`--thread-pedido` blue, `--thread-garzon` violet, `--thread-pago` red) into the warp and weft, in addition to its seal.**
  Why: the plaid is the kit's signature, so it should carry meaning, not only decoration.
  <!-- 2026-11-16 -->
- **The waiter call is violet (`--thread-garzon`, and the seal's `--seal-garzon-*`) in every piece: seal, cloth thread, badges, toasts and gallery legends. Gold belongs to the tartan's thin thread only; no call uses orange or gold.**
  Why: the orange call read as the tartan's gold thread; the gold stays, the call changes.
  <!-- 2026-11-16 -->
- **In the Slate theme, the call threads woven into the tablecloth are quiet: thinner and translucent (`--cloth-call-width`, `--cloth-call-opacity`), still readable next to the seal.**
  Why: at full strength they overpowered the flat cards.
  <!-- 2026-11-16 -->
- **Restaurant El Clan has its own tartan, defined once in `src/tartan.ts` by its threadcount (`K/8 G32 K6 G6 K24 W4 K24 Y/2`: green, slate, cream and a thin gold thread). The gallery accent, the "Tartan" section, the favicon and the Open Graph image are generated from it (`pnpm tartan:assets`); it is never redrawn by hand.**
  Why: one sett, one source of truth, like a registered tartan.
  <!-- 2026-11-16 -->
- **Textile token names are used only where the metaphor is honest: `--warp` and `--weft` for the tablecloth stripes, `--selvedge` for the cloth's hem, `--stitch` / `--stitch-dash` for sewn dashes (ribbon, Slate hem) and `--thread-*` for call threads. Other tokens keep their plain names.**
  Why: the kit is named after the tablecloth; the names explain the pattern code without renaming everything.
  <!-- 2026-11-16 -->
- **Each gallery group has its own thread (`--thread-pedido` for controls, `--selvedge` for containers and navigation, `--thread-garzon` for restaurant pieces, `--brand` for the tartan), woven as a small stripe at the left of its panel headers. Nothing else changes in the header: no dashed line at the bottom, no stitched panel borders. In the Slate theme the weave is subtler.**
  Why: the groups read as threads of one cloth without adding noise; stitched borders were rejected.
  <!-- 2026-11-16 -->
- **Lists are divided by a running stitch (`--list-stitch`), not a solid line. Dividers that are not lists keep their line.**
  Why: the stitch is the sewn detail of the kit, and it only makes sense where items follow one another.
  <!-- 2026-11-16 -->
- **In the Slate theme, cards carry the minimal plaid: crossed 1px lines of the accent green at 10% and 7% (`--plaid-lines`). It is used on content cards only, never on receipts, controls or every element, and text keeps its contrast.**
  Why: it translates the gingham to the flat theme without turning it into decoration.
  <!-- 2026-11-16 -->

- **The Slate theme has a light and a dark scheme, chosen with UI SDK's `createColorScheme` (`data-color-scheme`: system, light, dark; default system). Every Slate color token is a `light-dark()` pair resolved by `color-scheme`; rules never branch on the scheme. The dark scheme uses the slate scale (#0f172a / #1e293b / #334155 surfaces, #f1f5f9 / #a3b1c6 text), a lighter accent green with dark ink on it (`--on-accent`), and keeps WCAG AA contrast for text. The Plaid theme is always dark and ignores the scheme.**
  Why: one token set for both schemes keeps the greens and threads in one place and lets the demo follow the system.
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
- **Controls (buttons, search, selectors, segmented controls, checkbox, switch, stepper, sidebar and tab bar items) measure exactly the same in both themes, on desktop and phone: height, fixed width and padding come from shared variables (`--button-h`, `--field-h`, `--check-size`…) that no theme redefines. The Slate theme only changes the skin; its outlines and insets are drawn with shadows, border colors or `background-clip`, never with different borders, margins or padding. The Slate receipt is the only exception: it is a card without a printer, with a different typeface, and may measure differently.**
  Why: this way the two themes can be compared side by side without anything changing size.
  <!-- 2026-11-16 -->
- **The scheme control (system, light, dark) sits in the demo bar and the gallery bar right after the theme switch, with a fixed width: three icon segments on desktop and one icon toggle that cycles on phones. It is always present and keeps its place; in the Plaid theme it is disabled. The layout tests cover it and the dark Slate skin.**
  Why: no control may move or resize when switching theme, language or scheme.
  <!-- 2026-11-16 -->
- **Sticky bars, such as tabs and headers, have an opaque background and the content scrolls underneath them.**
  Why: if the content shows through, the interface looks broken.
  <!-- 2026-11-16 -->

- **The gallery's control bar (theme, scheme, language, demo link) stays pinned at the top while scrolling, in its own place, so the skin can be switched anywhere. Its background is opaque and bleeds past the page's sides.**
  Why: the pieces are compared across skins, and scrolling back up to switch broke that.
  <!-- 2026-11-16 -->
- **A control that sits alone in a gallery panel keeps its fixed width (the bar's `--role-w`); it never shrinks to its content.**
  Why: the segmented control was squeezed and its labels overflowed.
  <!-- 2026-11-16 -->
- **The standalone receipt stepper is shown in context, as a receipt line on a full strip of the receipt's own paper (a plain card in the Slate theme), never as small white squares on the stage.**
  Why: the loose white squares looked wrong against the dark stage.
  <!-- 2026-11-16 -->

## Motion

- **No decorative entrance animations are added. Only what responds to an action is animated, such as the click of the wheel.**
  Why: the paper-printing animation added nothing.
  <!-- 2026-11-16 -->

## Interaction

- **Toasts are UI SDK's `ToastRegion`, skinned like a Sonner stack: bottom end of the screen, the newest in front and older ones peeking scaled down behind it, the stack opening on hover or focus, swipe to dismiss, and an optional action such as Undo (a `light-button`). Only what responds to an action animates, and reduced motion keeps just the fade.**
  Why: the old toasts were a plain column with no stacking, so they read as less polished than the reference.
  <!-- 2026-11-16 -->

- **The guided tour highlights its target with a running thread: a dashed stitch that travels along the border (`TourThread`), never a pulsing ring. With `prefers-reduced-motion` the thread stays still.**
  Why: it follows the textile language of the kit, and the overlay is not clipped by the pieces it surrounds.
  <!-- 2026-11-16 -->

- **On every screen whose content can grow, the primary action goes at the top right and always stays visible. It never goes at the end of the content.**
  Why: with a long receipt the button ended up out of view.
  <!-- 2026-11-16 -->
- **The most important figure on a screen (for example, the order or bill total) is always visible next to the primary action, even if it is repeated elsewhere and breaks the physical metaphor.**
  Why: it is the most important information and must be seen immediately.
  <!-- 2026-11-16 -->
- **Quantity controls give physical feedback at every step (detent, sound, vibration). Their direction matches the arrow: up increases, and larger numbers sit on top.**
  Why: the wheel has to behave like a real object.
  <!-- 2026-11-16 -->

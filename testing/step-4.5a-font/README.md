# Step 4.5a: Plus Jakarta Sans font integration (test record)

Captured 21 Nov 2026. Theme B only. Accepted by the owner.

## What changed in the app
- `index.html`: one preload link for `/fonts/PlusJakartaSans-Variable.ttf`.
- `src/theme/tokens.css`: one `@font-face` rule for Plus Jakarta Sans (weights 200–800, `font-display: block`).
- `public/fonts/PlusJakartaSans[wght].ttf` renamed to `public/fonts/PlusJakartaSans-Variable.ttf`. The `[wght]` name made the preload link and the CSS address differ, so the font was downloaded twice.

Nothing else changed: no layout, styling, colours, navigation, cart logic or data.

## Folders
| Folder | What it is |
|---|---|
| `before-font/` | React B before the change (system fallback font). Dev server. This is the "before" baseline for Steps 4.5b and 4.5c. |
| `after-font-dev/` | After the change, dev server (`npm run dev`). |
| `after-font-build/` | After the change, production build (`npm run build`, then `vite preview`). |

Each folder holds 12 screenshots and a `result.json` of measurements. Screenshots are 390 × 844 CSS px at 2× (780 × 1688 image px), taken in headless Chrome:
01 Ready, 02 Home, 03–05 Menu All / Vegetarian / Non-vegetarian, 06 Veggie Supreme item, 07 Added-to-cart panel, 08 Mango Lassi item, 09 Cart (Set 1 T3 items), 10 Checkout, 11 Order confirmed, 12 empty Cart after "Back to home".

`before-font/result.json` has no `fontRequestCount` field. That counter was added to the capture script after the before run; there was no font to download then.

## Results
| Check | Before | After (dev and build) |
|---|---|---|
| `npm run lint` | No errors or warnings | No errors or warnings |
| `npm run build` | Passed | Passed |
| Font registered and loaded | None registered | Plus Jakarta Sans, 200–800, "loaded" |
| Width of a test phrase at 40 px, weight 800 | 461.84 px (fallback font) | 457.53 px (Plus Jakarta Sans) |
| Font downloads | 0 | 1 |
| Requests outside localhost | 0 | 0 |
| Task-card top positions (px), Menu – All | 1556 / 1690 / 2336 / 2604 | identical |
| Task-card top positions (px), Menu – Vegetarian | 752 / 1398 / 1666 | identical |
| Task-card top positions (px), Menu – Non-vegetarian | 1154 / 1428 / 1696 | identical |
| T3 Set 1 cart and order total Rs. 1,360 | Passed | Passed |

Task-card order: Veggie Supreme Pizza, Chicken Fajita Pizza, Mango Lassi, Mint Lemonade (each filter shows only the cards it includes). For reference, Figma B gives 1650 / 1784 / 2432 / 2700, 846 / 1494 / 1762 and 1248 / 1530 / 1798. Steps 4.5b and 4.5c will close that gap.

## Notes
- `document.fonts.check()` returned true both before and after. Browsers return true when no matching font is registered at all, so it isn't proof by itself. The registered-and-loaded status and the width comparison are the evidence.
- Visible effect: some lines wrap at different points (for example, the Veggie Supreme description), and the hyphen looks wider in this typeface. The text itself is unchanged.
- Not tested: airplane mode on the study iPhone in Safari (owner's manual check).

# Step 4.5b: shared components aligned to Figma Prototype B (test record)

Captured 21 Nov 2026. Theme B only. The reference values are in `reference/step-4.5b-measurements.md`.

## Files changed

| File | Change |
|---|---|
| `src/components/FoodImage.jsx`, `.css` | Emoji → Figma glyph SVG (44 × 44) on #F1ECE5 tile; new `tile` size (106 × 80) |
| `src/components/Rating.jsx`, `.css` (**new**) | 16 px accent star SVG + 4 gap + 16 Medium ink number |
| `src/components/FoodCard.jsx`, `.css` | Name → tag (meals only) → price left / rating right; gap 6; line heights 24 |
| `src/components/DietTag.jsx`, `.css` | 16 Medium pill for meals; plain "Drink" text for drinks |
| `src/components/Chip.css` | 16 px; selected: no border, 44 tall, SemiBold; unselected: 1 px border, 46 tall, Medium |
| `src/components/SearchField.jsx`, `.css` | Decorative search icon; placeholder 16 Regular; `flex-shrink: 0` (see Findings) |
| `src/components/NavBar.jsx`, `.css` | 24 px icon (active/inactive SVG) above a 16 px label |
| `src/components/CategoryTile.jsx`, `.css` | Image tile + label underneath; no border |
| `src/components/TopBar.jsx`, `.css` | 24 Bold title, back-icon SVG, padding 0 24, optional `showBack` (default on) |
| `src/components/CartRow.jsx`, `.css` | Name with "Qty 1" underneath, price right, 60 tall |
| `src/components/Summary.css` | Label/amount weights; Total amount 24 Bold |
| `src/components/AddedPanel.jsx`, `.css` | Header row with 40 px accent badge and white check; measured spacing |
| `src/components/Button.css` | Checked; already matched, not changed |

No screen files, data, state, navigation, cart logic, themes or config changed. Assets used: `src/assets/b/*.svg`.

## Folders

- `before/` and `after/`: 13 screenshots each (390 × 844 at 2×, headless Chrome) plus `result.json` (geometry, text styles, button lists, task-card positions, regression results).
- `geometry-and-style-comparison.txt`: React after 4.5b compared with the Figma values.

The `before/result.json` geometry was captured with an earlier probe that grouped elements, so only `after/` geometry is compared with Figma. The before screenshots, button lists, positions and regression results aren't affected.

## Results

| Check | Result |
|---|---|
| `npm run lint` | Passed, no errors or warnings |
| `npm run build` | Passed |
| Component geometry vs Figma (59 measurements) | **59 / 59 within 1 px** (see the comparison file) |
| Text size / weight / colour vs report (all component texts) | All match |
| Regression checks | **27 / 27 before, 27 / 27 after** |
| Buttons per screen (count) | Identical on all 10 screens |
| Console errors / requests outside localhost | 0 / 0 |

The regression checks cover:
- both T3 flows in both item orders (Rs. 1,360 / Rs. 1,480 in cart, checkout and order confirmed);
- the T1/T2 answers can be added, with the correct status line;
- adding the same item twice keeps 1 item;
- the backdrop closes the panel and stays on the item screen;
- all diet-filter transitions, including the approved asymmetry;
- the Rice Bowls empty message under Non-vegetarian;
- the Drinks chip scrolls the list; the Pizza tile opens the Menu scrolled;
- Back only on item screens and Checkout; featured cards and search not tappable;
- Back from an item returns to the Menu; Home and Cart tabs work.

**Button names:** only the menu cards' accessible names changed, because the emoji, the "★" character and the drink cards' "Drink" pill are no longer part of the card text. Counts and order are unchanged.

## Findings

1. **16 px text baselines sit 1 px higher than in Figma** while the boxes match exactly (card name/price, nav label, tile label, cart row, search placeholder). 24 px and 20 px text match exactly. This is a difference in how Chrome and Figma place text vertically, not a layout difference. Left as is.
2. **Chip widths are up to 0.95 px narrower than Figma.** Figma rounds text widths up; the browser uses exact widths.
3. **Search field (fixed here).** Before 4.5b it rendered about 20 px tall instead of 48, because Home's scrolling column let it shrink. `flex-shrink: 0` in `SearchField.css` keeps the measured 48 px. Home content below the search field is about 22 px lower as a result, closer to Figma; the remaining Home spacing is a 4.5c item.
4. **Task cards moved down 4 px** (All 1560 / 1694 / 2340 / 2608; Vegetarian 756 / 1402 / 1670; Non-vegetarian 1158 / 1432 / 1700). The 46 px chips make React's current fixed header 4 px taller. 4.5c moves the chips into the list, as in Figma.
5. **App frame narrowing (fixed in a follow-up, see below).** `body` is a flexbox and `#root` had no width, so `#root` shrank to fit its content, and the frame (`width: 100%` of `#root`) was narrower than 390 px when content was narrow. Measured: Ready 333 px, Cart and Checkout 287 px (332 px before 4.5b), other screens 390 px. This bug was there before 4.5b.

## Follow-up: `#root` width fix (owner-approved, 21 Nov 2026)

**Change:** one rule in `src/index.css`: `#root { width: 100%; }`. No other file or style changed. `body` and `.app-frame` are untouched; the frame keeps `max-width: 390px` and `margin: 0 auto`.

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Frame width at 390 × 844, all 8 screens (Ready, Home, Menu, item, panel, Cart, Checkout, Order confirmed) | **390 px on every screen** (Ready was 333, Cart and Checkout 287) |
| Desktop 1280 × 900 | Frame still 390 px, centred (445 px each side): desktop layout unchanged |
| Page wider than the viewport | No (document width 390 on every screen) |
| Regression | **27 / 27** |
| Component geometry vs Figma | **59 / 59**, identical to the 4.5b result |
| Button lists / task-card positions | Identical to the 4.5b result |
| Console errors / requests outside localhost | 0 / 0 |

Files: `after-width-fix/` (13 screenshots + `result.json`), `frame-width-after-width-fix.txt`, `geometry-and-style-comparison-after-width-fix.txt`.

The two Menu chips listed as extending past the frame in `frame-width-after-width-fix.txt` (Rice Bowls, Drinks) sit inside the chip row's own horizontal scroll; the page itself is 390 px wide. Step 4.5c moves the chips into the list as two rows, as in Figma.

## Not tested

- The study iPhone in Safari (owner's manual check).
- Filled-Cart and Checkout item layouts against Figma: those Figma layers are hidden, so they're left for 4.5c.

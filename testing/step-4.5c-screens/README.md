# Step 4.5c: Theme B screen layouts aligned to Figma Prototype B (test record)

Captured 21 Nov 2026. Theme B only. The reference values are in `reference/step-4.5b-measurements.md`.

## Rules applied (owner decisions, 21 Nov 2026)

- **Option A: no 44 px status-bar band.** Figma frames reserve an empty 44 px area at the top. The app uses the real Safari page instead, so every top-anchored position is **Figma y − 44**.
- **Bottom-pinned elements** keep Figma's distance from the frame bottom, applied to the real viewport bottom:

  | Element | Distance from the bottom |
  |---|---|
  | Nav bar | flush (0) |
  | Add to cart, Place order, Back to home | 40 |
  | Ready's Start | 48 |
  | Cart's Checkout button | 92 |

  **PROVISIONAL** until the study iPhone is measured with `testing/viewport-check/`.
- **No guessed safe-area or viewport values** are used anywhere.
- **Ready** stays top-anchored.
- **Hidden Figma layers** (filled Cart rows, Checkout rows, Order-confirmed rows): their positions are **PROVISIONAL**, derived from Figma's 16 px spacing, until prototype-player screenshots confirm them.
- **Parity:** the same rules will apply to Theme A in Step 5.

## Files changed

| File | Change |
|---|---|
| `src/screens/Ready.css` | Wordmark top 256, message top 300 (12 apart); Start pinned 48 from the bottom |
| `src/screens/Home.css` | Padding 16 / 24 / 100; line heights 32; tile grid 16 between rows / 12 between columns |
| `src/screens/Menu.jsx`, `Menu.css` | Header = `TopBar` ("Menu", no Back) + diet filters, 114 tall, no border. **Category chips moved into the list** (2 rows). Section spacing as Figma; `scroll-margin-top` 158 → 0; empty message 16 Regular muted. Filter logic and handlers unchanged. |
| `src/screens/ItemDetail.jsx`, `ItemDetail.css` | Left-aligned layout with 16 px gaps; tag + `Rating` row; Add to cart pinned 40 from the bottom. Handlers unchanged. |
| `src/screens/Cart.jsx`, `Cart.css` | `TopBar` ("Cart", no Back); empty message top-left. Checkout button in a footer above the nav bar (same button and action, still only when the cart has items). Rows/summary gap 16 (provisional). |
| `src/screens/Checkout.jsx`, `Checkout.css` | One column, 16 apart. Cards now hold their own label and value; text unchanged and still from `rules.js`. "Order summary" 16 SemiBold. Place order pinned 40 from the bottom. |
| `src/screens/OrderConfirmed.jsx`, `OrderConfirmed.css` | 80 px accent badge with `icon-check.svg`; 16 px spacing; rows left-aligned; Back to home pinned 40 from the bottom. `backToHome` unchanged. |

**Not touched:**
- components (only used: `TopBar` with `showBack={false}`, `Rating`, `icon-check.svg`);
- `src/data`, `src/state`, `App.jsx`, `main.jsx`;
- `index.html`, `index.css`, themes;
- Figma, `CLAUDE.md` and the Claude Docs.

## Folders and files

- `before/`: screenshots and `result.json` before 4.5c (after 4.5b and the width fix), 390 × 844.
- `after-390x844/`, `after-390x664/`: screenshots and `result.json` after 4.5c. 664 is a stand-in for a shorter Safari viewport, **not** a measured iPhone value.
- `landing-390x844.json`, `landing-390x664.json`: where each section heading lands after a chip or tile tap.
- `frame-width.txt`: frame and page width on every screen at both heights.

## Results

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Regression (both task sets in both orders; T1/T2 answers; adding the same item twice; Back to home reset; all diet-filter moves; Rice Bowls empty message; Back only on item screens and Checkout; featured cards and search not tappable; tabs) | **27 / 27 at 844 and 27 / 27 at 664** (before: 27 / 27) |
| Task cards vs Figma − 44 (All 1606 / 1740 / 2388 / 2656; Vegetarian 802 / 1450 / 1718; Non-vegetarian 1204 / 1486 / 1754) | **All 10 exact (0 px)** at both heights |
| Heading lands directly under the header (5 chips × 3 filter states + 5 Home tiles) | **20 / 20 at 844, 20 / 20 at 664** (before 4.5c: Drinks landed 176 px below the header) |
| Buttons per screen | Identical to before (count, names, order) on all 10 screens |
| Frame width | 390 on all 8 screens at both heights; page never wider than 390 |
| Console errors / requests outside localhost | 0 / 0 |

**Screen positions at 390 × 844 (each target is Figma − 44):**

| Screen | Measured positions |
|---|---|
| Ready | wordmark 256, message 300, Start 48 from the bottom |
| Home | wordmark 16, search 72, Categories 144, tiles 188 / 316 at x 24 / 142 / 260, Featured 452, cards 496 / 630 / 764 |
| Menu | header 114; title baseline 38; filters 56; chip rows 120 / 174; headings 244 / 836 / 1428 / 1886 / 2344; empty message 1394 |
| Item (meal) | image 72, name 308, row 356, price 406, description 454; rating right edge 366 |
| Item (drink) | row 24 tall, price 396, description 444 |
| Cart | title x 24 (no Back); empty message 72; Checkout button y 700 (92 from the bottom) |
| Checkout | title x 76; "Order summary" 72; with one item: cards 188 / 290, summary 392 (Figma reference layout); card labels at x 41 |
| Order confirmed | badge (155, 44), check (175, 64), heading 140, message 188, rows 252, summary 328 with one item |

All bottom-pinned buttons were at their target distance at both 844 and 664. On the shorter viewport the content scrolls above them without overlapping.

## Provisional (hidden in Figma)

| Screen, with the 2 task items | Position |
|---|---|
| Cart | rows from y 72, summary 16 below them |
| Checkout | cards 248 / 350, summary 452 |
| Order confirmed | summary 388 |

To be checked against prototype-player screenshots (Cart, Checkout, Order confirmed with Veggie Supreme Pizza + Mango Lassi) before 4.5c is closed.

## Found and fixed during 4.5c

- **Order confirmed:** this screen centres its text, so the cart rows inherited it and "Qty 1" sat centred under the item name. Fixed in `OrderConfirmed.css` (`text-align: left` on the rows), matching Figma's left-aligned cart row.

## Not tested / still open

- **The study iPhone in Safari.** The real viewport height and bottom distances are still to be measured with `testing/viewport-check/`.
- **Filled Cart, Checkout and Order confirmed** against Figma (provisional, see above).

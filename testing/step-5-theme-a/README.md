# Step 5, Phase 5a: Theme A (confirmed details only), test record

Captured 21 Nov 2026. Theme A is shown with `?theme=A`, which only works under `npm run dev`. The default, and every production build, is Theme B.

## Sources

| Tag | Source |
|---|---|
| COMP | Figma A component code saved during the Figma inspection (A / FoodCard, DietTag, FoodImage, Chip, Button, SearchField, NavBar, CartRow, CategoryTile, TopBar, PromoBanner, Decor) |
| META | Saved Figma A layout data. Positions use Option A (Figma y − 44; Menu list y − 158). |
| SVG | 24 A SVG assets exported by Figma, copied byte-for-byte to `src/assets/a/` (originals kept in the scratchpad) |

Two text styles were checked rather than assumed:
- **Wordmark:** 28 px ExtraBold uppercase is the only style that reproduces Figma's text box (159 px).
- **Section headings (Home and Menu):** 20 px ExtraBold uppercase with 0.6 px letter spacing fits all seven Figma text boxes. The colour #6C3FC5 was sampled from the saved Figma A Menu screenshot.
- **Not measured:** "Buddy" in violet follows CLAUDE.md section 3; its colour wasn't measured.

## What was implemented

| Area | Files |
|---|---|
| Theme switch (dev-only `?theme=A`, default B) | `src/state/ThemeContext.jsx` (new), `src/App.jsx`, `src/main.jsx` |
| A colours and all A styling, every rule scoped to `[data-theme="A"]` | `src/theme/theme-a.css` (new) |
| Decorations: dots, blob, sticker, stripes, confetti, card sticker | `src/components/Decor.jsx`, `Decor.css` (new) |
| Promotions: hero, strip, ticker (Figma wording, general only) | `src/components/Promo.jsx`, `Promo.css` (new) |
| A icon sources (food tiles, star, nav, search, back) and the card corner sticker | `FoodImage.jsx`, `Rating.jsx`, `NavBar.jsx`, `SearchField.jsx`, `TopBar.jsx`, `FoodCard.jsx` |
| A component styling: FoodCard, DietTag (meals), Chip, Button (not on Ready), SearchField, NavBar, CartRow, CategoryTile, TopBar, Rating | `theme-a.css` |
| Home: layout, hero, decorations | `src/screens/Home.jsx`, `theme-a.css` |
| Menu: layout, ticker, strip, per-filter section spacing, decorations | `src/screens/Menu.jsx` (`data-filter` / `data-category` attributes, Decor/Promo placements), `theme-a.css` |

Unchanged:
- data, cart/nav state logic, event handlers;
- `theme-b.css`, `tokens.css`, `index.css`, `index.html`, Ready;
- Figma, CLAUDE.md and the research documents.

## Results

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Regression (27 checks), Theme B | 27 / 27 at 844 and 664 |
| Regression (27 checks), Theme A | 27 / 27 at 844 and 664 |
| Heading lands under the header (5 chips × 3 filters + 5 Home tiles) | 20 / 20 in both themes at both heights |
| Same visible text in A and B (aria-hidden decoration and promo text excluded), 12 screens | Identical on all 12, both heights |
| Same buttons (count, names, order) in A and B, 12 screens | Identical on all 12, both heights |
| Decorations: interactive / animated | 0 / 0 (all `aria-hidden`, `pointer-events: none`, static) |
| Visible decoration over another control (clipped to the scroll area) | None |
| Taps intercepted by a decoration (`elementFromPoint` at every button centre) | None |
| Frame and page width | 390 on every screen, both themes, both heights |
| Theme B unchanged since 4.5c | All 13 B screenshots byte-identical to the 4.5c result; positions, buttons, geometry and check results identical |
| Ready, A vs B | Screenshots byte-identical at both heights |
| Text contrast (all new A text pairs) | All ≥ 4.5:1 (lowest 4.86:1, white on #C8451C, as in B) |

**A positions vs Figma A − 44:**
- Home: wordmark 16, search 60, hero 120, Categories 228, tiles 270 / 394 (x 16 / 142 / 268), Featured 518, cards 558 / 682 / 806 — exact.
- Menu: ticker 120, chip rows 156 / 210, strip 264, headings 312 / 848 / 1447 / 1859 / 2358 — exact.

**Task cards, A vs B** (Veggie Supreme, Chicken Fajita, Mango Lassi, Mint Lemonade):

| State | A (exact Figma A − 44) | A − B |
|---|---|---|
| All | 1611 / 1735 / 2398 / 2646 | +5 / −5 / +10 / −10 |
| Vegetarian | 804 / 1460 / 1708 | +2 / +10 / −10 |
| Non-vegetarian | 1204 / 1496 / 1744 | 0 / +10 / −10 |

Every difference is within ±10 px and identical to Figma's own A − B differences.

## Files in this folder

- `phase-5a-theme-B-390x844/`, `phase-5a-theme-A-390x844/`, `phase-5a-theme-B-390x664/`, `phase-5a-theme-A-390x664/`: 13 screenshots each plus `result.json`. 664 is a stand-in for a shorter Safari viewport, **not** a measured iPhone value.
- `checks/`: A/B parity and decoration-safety results (`parity-*.json`) and the heading-landing results (`landing-*.json`).

The Phase 5a "not implemented" list was resolved in Phase 5b, except where noted below.

---

# Phase 5b: remaining Theme A details (21 Nov 2026)

Specification: `reference/step-5b-theme-a-measurements.md`, measured from the owner's export `reference/BiteBuddy-Figma-Reference-A.png` plus the saved Figma A layout data. Owner decisions (21 Nov 2026):
1. Fixed strips and bottom decorations go in the scrolling content at Figma y − 44, behind text, never over buttons.
2. Rice Bowls heading ink, Drinks heading violet (**inference**).
3. Menu "Confetti 2" 12° clockwise (**inference**).
4. Subtotal / Delivery amounts Medium; Total amount ExtraBold.

## What was implemented

| Area | Change | Files |
|---|---|---|
| Phase 5a corrections | Section headings alternate (Featured meals, Wraps, Rice Bowls ink; others violet). The item-screen rating keeps B's accent star and Medium number. | `theme-a.css`, `Rating.jsx` (`variant="detail"`), `ItemDetail.jsx` |
| Item screen | Info card (366 × 214, white, 2 px violet, radius 16) behind the text; large image tile (category tint, 2 px border, radius 20, measured corner dots, B glyph); name ExtraBold ink; price ExtraBold violet; decorations; promo strip | `Decor.jsx/.css` (`infoCard`), `FoodImage.jsx`, `theme-a.css`, `ItemDetail.jsx`, `Promo.jsx` (optional `style`) |
| Checkout | "ORDER SUMMARY" uppercase 20 ExtraBold violet; cards with 2 px violet border, radius 16; summary card; Total label ExtraBold ink, Total amount ExtraBold violet; decorations; strip | `theme-a.css`, `Checkout.jsx` |
| Order confirmed | Heading ExtraBold ink; summary card; decorations; strip (badge and check already identical to B) | `theme-a.css`, `OrderConfirmed.jsx` |
| Cart (empty) | Decorations and strip (text already as B) | `Cart.jsx` |
| Added-to-cart panel | Sheet 2 px violet border (top and sides), inset 26, 317 visible; heading uppercase ExtraBold violet; dots and sticker | `theme-a.css`, `AddedPanel.jsx` |
| Rotated confetti | Home 8° and Menu Confetti 1 10° clockwise (measured); Menu Confetti 2 12° clockwise (inference); centred in Figma's bounding boxes | `Decor.jsx` (`rotate`, `box`), `Home.jsx`, `Menu.jsx` |
| Title bars in A | Transparent, so the decorations behind them show, as in Figma A | `theme-a.css` |

Unchanged:
- Theme B, data, state, handlers, navigation, Ready;
- Figma, CLAUDE.md and the research documents.

## Results

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Regression (27 checks) | **27 / 27** in Theme A and Theme B, at 390 × 844 and 390 × 664 |
| Heading landing (5 chips × 3 filters + 5 tiles) | **20 / 20** in both themes, both heights |
| Same visible text and buttons in A and B (12 screens) | Identical on all 12, both heights |
| Decoration painted above a control (stacking-order check at every overlap) | **None**, both heights |
| Taps intercepted by a decoration | **None** |
| Decorations interactive / animated | 0 / 0 |
| Frame and page width | 390 on every screen, both themes, both heights |
| Theme B unchanged | All 26 B screenshots (both heights) byte-identical to the end of Phase 5a / 4.5c |
| Ready, A vs B | Byte-identical, both heights |
| Task cards | Unchanged from Phase 5a: A exactly Figma A − 44, within ±10 px of B |

## Figma comparison

`phase-5b-figma-comparison/` has 11 images. Each shows the Figma A frame (from the reference PNG, rows 44–844, the Option A view) beside React A (390 × 844, top 800 px), for Ready, Home, Menu (All, Vegetarian, Non-vegetarian), item M10, item D01, the panel, Cart (empty), Checkout and Order confirmed.

Expected differences:
- **Bottom buttons sit lower in React:** they're pinned 40 px above the real viewport bottom (Option A), and this comparison shows only the top 800 px of an 844 px viewport.
- **Checkout and Order confirmed show the two order rows in React:** those Figma layers are hidden, so the positions below them are **provisional**.
- **The panel status shows real values in React** ("1 item · Rs. 950"); Figma shows its placeholder.

## Folders

- `phase-5b-theme-{A,B}-390x{844,664}/`: 13 screenshots each plus `result.json`.
- `checks/phase-5b/`: parity, decoration-safety and landing results.

## Still provisional / not verified

1. **Filled Cart, Checkout and Order confirmed states** (hidden Figma layers), in both themes. The Cart summary in A stays as in B.
2. **Inferences** (owner-approved, not visible in the export): Rice Bowls heading ink, Drinks heading violet, Menu Confetti 2 at 12° clockwise.
3. **Rotated confetti placement:** both visible fits preferred a 3–4 px shift left of Figma's bounding-box centre. The bounding-box centre is used.
4. **"No non-vegetarian items" message in A:** below every frame edge; kept as in B.
5. **Not tested:** the study iPhone in Safari (viewport still to be measured with `testing/viewport-check/`).

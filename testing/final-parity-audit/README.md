# Final Theme B cross-check and A/B parity audit

Audited 21 Nov 2026. **Read-only: no application file was changed.** No genuine Theme B discrepancy was found, so no corrections are proposed.

## Reference used

The owner asked for `reference/BiteBuddy-Figma-Reference-B.pdf`. **That file doesn't exist.** The Prototype B vector PDF is saved as `reference/BiteBuddy-Figma-Reference.pdf`: the owner's export of Figma page 01, Prototype B only. It was used for every text and box value, along with:
- `reference/BiteBuddy-Figma-Reference-B.png`, for the visual side-by-sides;
- `reference/step-4.5b-measurements.md` and the Step 4.5c results.

No reference file was renamed.

Option A rules (owner decision) applied throughout:
- top-anchored content is expected at Figma y − 44;
- bottom-pinned elements (bottom buttons, nav bar, the added-to-cart panel) are expected at Figma's distance from the frame bottom, measured from the real viewport bottom.

## 1. Text audit: every visible text line in the Figma B frames

Frames:
- Ready, Home, Menu (All, Vegetarian, Non-vegetarian);
- item M01 (meal) and D02 (drink), chosen because no Menu overflow is drawn over those frames in the PDF;
- Cart (empty), Checkout, Order confirmed, the panel.

Checkout and Order confirmed were opened with one item, because Figma's layout reserves one row of space.

| Result | Count |
|---|---|
| Lines matching Figma B (x and baseline within 1.5 px; size, weight and colour exact) | **147 / 157** |
| Remaining 10, all explained below (none is a B mismatch) | 10 |

The 10 explained:

| Line(s) | Finding | Classification |
|---|---|---|
| "BiteBuddy" (Ready, Home) | The wordmark is split into two text nodes ("Bite" + "Buddy"). Measured directly: Ready x 132.9, baseline 282 (Figma 132.5, 326 − 44); Home x 24, baseline 42 (Figma 24, 86 − 44). | Audit artefact; **matches** |
| "Vegetarian" tag at Figma baseline 801 (Menu – All) | In Figma this tag is under the nav bar; its sampled colour picked up the nav icon's accent. | Audit artefact |
| "Rs. 0" ×4 (Checkout, Order) | Figma placeholders; React shows real totals. Compared by right edge and baseline: positions match. | **Expected** (real cart data) |
| "Cart: 0 items · Rs. 0" (panel) | Figma placeholder; React shows "Cart: 1 item · Rs. 950". Position matches. | **Expected** (real cart data) |
| "Total" label, +3 px (Checkout, Order) | The text box sits exactly as in Figma (4 px down in the 32 px row, 24 px tall). Glyph boxes confirm: "Total" is 4 px lower in its row than "Subtotal" in its row, exactly as in Figma (23 vs 19). The +3 came from the baseline probe. | Audit artefact; **matches** |

## 2. Box audit: main shapes against Figma B

**32 / 33 within 1 px, colours exact.** Checked:
- Ready's Start button;
- Home: search field, category tile image, Pizza tile, featured card, nav bar;
- Menu: diet chips (unselected 118 × 46 / 156 × 46; selected 117 × 44, and the next chip's 1 px shift), category chips, first card, card image, tag pill;
- item screen: image tile, tag pill, Back button, Add to cart;
- Cart: empty message;
- Checkout: address and payment cards, summary, Place order;
- Order confirmed: badge, summary, Back to home;
- panel: sheet, badge, item row, both buttons.

The one flag is the Menu header: 114 px at y 0 instead of Figma's 158 px. That's the approved Option A removal of the 44 px status-bar band, so it's **expected**.

## 3. Visual side-by-sides (`figma-b-vs-react-b/`)

11 images, each showing the Figma B frame (from the B PNG, rows 44–844) beside React B (390 × 844, top 800 px): Ready, Home, Menu (All, Vegetarian, Non-vegetarian), item M10, item D01, the panel, Cart (empty), Checkout, Order confirmed. No visual mismatch was found: icons, glyphs, borders, fills, radii and typography agree.

## 4. Expected differences (not mismatches)

| Difference | Cause |
|---|---|
| All top-anchored content 44 px higher; Menu header 114 instead of 158 | Option A: no simulated status-bar band |
| Bottom buttons, nav bar and panel lower in the 844 px comparison | Pinned to the real viewport bottom (Option A); the comparison shows only the top 800 px of an 844 px viewport |
| Order rows on Checkout and Order confirmed; real totals; real panel status | Real cart data; Figma uses hidden layers and placeholders |
| Panel shows the dimmed item screen behind it | Figma's overlay frames have only a backdrop |

## 5. Behaviour: A and B identical

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Regression (27 checks), Theme B | 27 / 27 at 390 × 844 and 390 × 664 |
| Regression (27 checks), Theme A | 27 / 27 at 390 × 844 and 390 × 664 |
| Heading landing (5 chips × 3 filters + 5 Home tiles) | 20 / 20 in both themes, both heights |
| Same visible text in A and B (12 screens) | Identical on all 12, both heights |
| Same buttons in A and B (count, names, order) | Identical on all 12, both heights |
| Decoration painted above a control / taps intercepted / animations | None / none / 0 |
| Frame and page width | 390 on every screen, both themes, both heights |
| Theme B unchanged since Phase 5b | All 26 screenshots byte-identical |
| Ready, A vs B | Byte-identical at both heights |
| Task cards | B exactly Figma B − 44; A exactly Figma A − 44; A − B within ±10 px (same as Figma) |

The first Theme A and Theme B runs at 664 stopped early because of a page-load timing problem in the capture script (not the app). Both were re-run individually and passed.

## 6. Still unverified

1. **Filled Cart, Checkout and Order confirmed layouts** (rows and summary placement). They're hidden layers in Figma and stay provisional in both themes until prototype-player screenshots are supplied.
2. **Bottom-pinned distances on the real study iPhone.** Safari's viewport still needs measuring with `testing/viewport-check/`.
3. **Small, known rendering differences:**
   - 16 px text baselines sit about 1 px higher than Figma (Chrome vs Figma text metrics; boxes match);
   - chip widths are up to 0.95 px narrower (Figma rounds text widths up).
4. **Coverage:** the text audit covered the visible 844 px of each frame. Lower Menu sections and task-card positions were verified in Step 4.5c. Item screens were audited on M01 and D02 here, and on M10 and D01 in 4.5c; all 20 share one layout.
5. **Theme A inferences** (unchanged): Rice Bowls heading ink, Drinks heading violet, Menu Confetti 2 at 12° clockwise.

## Files

- `capture-theme-{A,B}-390x{844,664}/`: screenshots and `result.json` from the final regression run.
- `figma-b-vs-react-b/`: visual side-by-sides.
- `data/`: Figma B text expectations, the text and box audit results, the A/B parity results and the heading-landing results.

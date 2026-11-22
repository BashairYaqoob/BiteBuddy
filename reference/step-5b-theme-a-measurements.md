# Step 5b: Figma Prototype A measurements (Theme A)

Prepared 21 Nov 2026 for Step 5, Phase 5b. Read-only analysis; nothing in Figma was changed.

## Sources

| Tag | Source | Reliability |
|---|---|---|
| **PNG** | `reference/BiteBuddy-Figma-Reference-A.png`: the owner's export of Figma page 02 (all 32 A frames plus the "A / Components" section), 5594 × 4644 at 1 px per Figma unit. Frames are clipped at 844 px, so content below a frame's edge is not visible. | Exact colours; geometry ±0.5–1 px (1× raster) |
| **META** | Figma A layout data saved during the Figma inspection (layer positions and sizes; auto-width text-box widths) | Exact |
| **COMP** | Figma A component code saved during the inspection | Exact |
| **B-PNG** | `reference/BiteBuddy-Figma-Reference-B.png` (page 01 export), used for pixel comparison | Exact colours |
| **INFERENCE** | Owner-approved inference from a consistent pattern; not directly visible | Recorded as inference |

Methods (no guessing):
- **Colours:** sampled from PNG pixels.
- **Weights:** from META auto-width text boxes (the box equals the rendered width; checked against Plus Jakarta Sans at each weight), or by matching ink width in the PNG against the real font rendered in Chrome.
- **Corner radii:** fitted by rendering candidate radii and comparing pixels.
- **Icons:** compared pixel-for-pixel with B-PNG.
- **Confetti direction:** decided by rendering both rotations and comparing with the PNG.

Positions use Option A (owner decision): top-anchored y = Figma frame y − 44. For scrolling content, y is relative to the scroll content's top.

## Corrections to Phase 5a

| Item | Phase 5a | Confirmed | Evidence |
|---|---|---|---|
| Section heading colours | All violet | **Alternate**: Categories, Burgers, Pizza violet #6C3FC5; Featured meals and Wraps ink #1F1B16. The colour pairs with the heading decoration (stripes → violet, sticker → ink). | PNG |
| Item-screen rating | A mustard star, Bold | **B's accent star #C8451C, number Medium** (box 25 px, same as B) | PNG + META |

## Confirmed

### Item screen

| Element | Value | Evidence |
|---|---|---|
| Info card | Decorative panel 366 × 214 at frame (12, 340) = content y 240; white; 2 px #6C3FC5 border; radius 16. Behind name, tag, price and description. | META + PNG (radius fit 16, runner-up 17) |
| Large image tile (A / FoodImage – Detail) | 342 × 220; category colour at 22% over white (pizza #F8D6E2, exact); 2 px border in the category colour; radius 20. B's 44 px glyph (#B7ADA0) centred. | PNG (radius fit 20) |
| Large tile colours | Burger mustard #F2B705, Wrap teal #0F8B8D, Pizza pink #E0457B, Bowl violet #6C3FC5, Drink mustard #F2B705 | PNG (Components section) |
| Large tile corner dots (centre, radius; ±0.5 px) | pink (19, 19) r 5 · teal (318, 22) r 4 · violet (21.5, 197.5) r 3.5 · mustard (320.5, 196.5) r 4.5 | PNG (colour-blob centroids); radii match the small tile's dots |
| Name | 24 ExtraBold ink | ink width 257 = 800 (700 = 255) |
| Price | 24 ExtraBold #6C3FC5 | META box 89 (B 88) + ink |
| Diet tag | A tag; tint #EDE8F8 | PNG |
| "Drink" label, description | Same as B (16 Medium muted / 16 Regular muted) | META box 40; ink width |
| Rating | B accent star; number 16 Medium ink | PNG + META box 25 |
| Decorations | Sticker (176, 62) → (176, 18) fixed; Blob (318, 52) → (318, 8) fixed; Stripes (318, 460) → content (318, 360) | META + PNG |
| Bottom strip and decorations | Strip (24, 578) → content (24, 478); Dots (326, 646) → content (326, 546); Confetti, unrotated (24, 650) → content (24, 550) | META + PNG; placement per owner decision 1 |

### Cart (empty)

| Element | Value |
|---|---|
| Title bar | A TopBar, "Cart", no Back |
| Empty message | Same as B (16 Regular muted; ink width = 400) |
| Decorations | Sticker (147, 62) → (147, 18) fixed; Blob (318, 52) → (318, 8) fixed; Strip (24, 640) → content (24, 540) |

### Checkout

| Element | Value | Evidence |
|---|---|---|
| "ORDER SUMMARY" | uppercase 20 ExtraBold #6C3FC5, line 24 | META box 180 = UPPER 20/800; PNG colour |
| Address and payment cards | 342 × 88; white; 2 px #6C3FC5; radius 16; label (16 Regular muted) at +18; value (16 SemiBold ink) at +46 | META + PNG (radius 16; value ink width = 600; label box 126 = B) |
| Summary card | 342 × 132; white; 2 px #6C3FC5; radius 16; rows inset 18 (2 border + 16 padding) | META + PNG |
| Summary text | Subtotal / Delivery fee labels 16 Regular muted (boxes = B); "Total" label 16 ExtraBold ink (box 39, ink 38 = 800); Total amount #6C3FC5 | META + PNG |
| Decorations | Sticker (211, 62) → (211, 18) fixed; Blob (318, 52) → (318, 8) fixed; Strip (24, 660) → content (24, 560) | META + PNG |

### Order confirmed

| Element | Value | Evidence |
|---|---|---|
| Badge and check | **Pixel-identical to B**: 80 px #C8451C circle, white `icon-check.svg` | B-PNG comparison: 0 of 6400 / 0 of 1600 pixels differ |
| Heading | "Order confirmed" 24 ExtraBold ink, not uppercase | META box 198 + ink 195 = 800 |
| Message | Same as B | ink width = 400 |
| Summary card | As Checkout | PNG |
| Decorations (scroll content; Order has no title bar) | Blob (318, 40) → (318, −4); Dots (286, 104) → (286, 60); Confetti, unrotated (56, 112) → (56, 68); Strip (24, 600) → (24, 556); Dots (326, 660) → (326, 616); Confetti, unrotated (24, 664) → (24, 620) | META + PNG |

### Added-to-cart panel

| Element | Value | Evidence |
|---|---|---|
| Sheet | White; 2 px #6C3FC5 border on top and sides (the bottom edge is outside the frame); top radius 24; content inset 26 (2 + 24); 317 px visible (Figma 321, with 4 px below the frame edge) | META + PNG (radius 24) |
| Badge and check | Pixel-identical to B (40 px #C8451C, white check) | B-PNG: 0 of 1640 / 0 of 600 pixels differ |
| Heading | "ADDED TO CART" uppercase 20 ExtraBold #6C3FC5 | META box 161 = UPPER 20/800; PNG colour |
| Status | 14 Regular muted (same as B) | META box 127; ink = 400 |
| Decorations (sheet-relative) | Dots (318, 26), Sticker (244, 36) | META + PNG |

### Rotated confetti (bounding boxes from META; rotation about the centre)

| Instance | Bounding box | Rotation | Evidence |
|---|---|---|---|
| Home "Confetti top" | 66.72 × 32.67 at (300, 92) | **8° clockwise** | Size from bbox arithmetic; direction by pixel test (clockwise 71 vs anticlockwise 24 matching pixels) |
| Menu "Confetti 1" | 67.20 × 34.75 (All 946.8, Vegetarian 686.4, Non-vegetarian 696; x 300) | **10° clockwise** | Size from bbox arithmetic; direction by pixel test (100 vs 40) |

Both visible fits preferred a 3–4 px shift left of the bounding-box centre (within raster precision, but systematic). The implementation uses the META bounding-box centre.

## Inferences (owner-approved, not directly visible)

| Item | Value | Basis |
|---|---|---|
| Rice Bowls heading colour | ink #1F1B16 | Pattern holds in all 5 visible headings (stripes → violet, sticker → ink); Rice Bowls has the sticker. Below every frame edge. |
| Drinks heading colour | violet #6C3FC5 | Same pattern; Drinks has stripes. Below every frame edge. |
| Menu "Confetti 2" rotation | 12° clockwise | Size from bbox arithmetic (67.59 × 36.78); direction follows the two measured instances. Never visible in the export. |

## Owner decisions

1. Fixed promo strips and bottom decorations are placed in the scrolling content at Figma y − 44, behind text. They must never overlap, obscure or intercept buttons. Button accessibility takes priority on shorter viewports.
2. Subtotal and Delivery fee amounts: Medium (Regular and Medium could not be told apart). Total amount: ExtraBold (META box 60; ink width differed by 1 px).

## Still unresolved

- The "No non-vegetarian items in this category." message in A is below every frame edge. It is kept as in B.
- Filled Cart, Checkout and Order confirmed states are hidden Figma layers and stay **provisional** until prototype-player screenshots are available. The Cart summary in A is a hidden layer and stays as in B.

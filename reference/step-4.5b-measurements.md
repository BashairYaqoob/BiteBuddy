# Step 4.5b: Figma Prototype B measurements

Prepared 21 Nov 2026 for Step 4.5 (aligning React Theme B with Figma Prototype B). Read-only analysis; nothing in Figma was changed.

## Sources and confidence

| Tag | Source | How reliable |
|---|---|---|
| **PDF** | `reference/BiteBuddy-Figma-Reference.pdf`: the owner's vector export of Figma page 01 (Prototype B only, all 32 frames, 3400 × 4644 canvas) | Exact. Positions, sizes, colours and text runs are read from the vector data. |
| **PDF+font** | Text weight: each line's exact width in the PDF compared with Plus Jakarta Sans rendered at weights 400–800 in Chrome | Exact for whole lines (best match within 0.07 px; next weight ≥ 0.38 px away) |
| **META** | Figma layout data read through the Figma connector on 21 Nov 2026 (frame and layer positions and sizes) | Exact for layer boxes |
| **COMP** | Figma component code read through the Figma connector (FoodCard, DietTag, FoodImage, NavBar, CategoryTile, TopBar) | Exact |
| **DERIVED** | Calculated from the values above (for example a padding worked out from two positions) | Arithmetic only. Each one says what it was derived from. |
| **UNVERIFIED** | Not visible in any source | Listed in the last section. Not to be implemented from guesses. |

Coordinates are in px inside a 390 × 844 frame, measured from the frame's top-left. "Baseline" is the text baseline y. Line heights come from META text-box heights: 16 px text = 24, 24 px text = 32, 20 px = 25, 14 px = 18.

**Borders.** Every border is a **1 px inside stroke** (the 1.5 px secondary button too). In CSS terms that's `border` with `box-sizing: border-box`. DERIVED from the PDF, which draws each stroke as a band twice the width centred on the box edge, and from content offsets: card content starts at +13 (1 border + 12 padding); unselected chip text at +17 (1 + 16), selected at +16 (no border).

## Colours (PDF)

| Use | Hex |
|---|---|
| Screen background, Menu header | #FAF8F5 |
| Ink text, back icon | #1F1B16 |
| Muted text, inactive nav, search icon, tag text | #6B645C |
| Borders, dividers | #E9E4DD |
| Surfaces (cards, chips, search, tags, nav bar, sheet) | #FFFFFF |
| Image tiles | #F1ECE5 |
| Food glyphs | #B7ADA0 |
| Accent: primary buttons, selected chip, active nav, star, check badges, "Buddy" | #C8451C |
| Panel backdrop | #000000 at 40% opacity (the only transparency value in the PDF) |

## Typography (PDF+font)

Font: Plus Jakarta Sans. Letter spacing 0 everywhere (widths match the font exactly with no extra spacing).

| Text | Size | Weight | Colour |
|---|---|---|---|
| Wordmark "BiteBuddy" (Ready, Home) | 24 | Bold | "Bite" #1F1B16, "Buddy" #C8451C |
| Screen titles: Menu, Cart, Checkout, **Details**, Order confirmed | 24 | Bold | ink |
| Section headings: Categories, Featured meals, Burgers … Drinks | 24 | Bold | ink |
| Item-screen name | 24 | Bold | ink |
| Item-screen price | **24** | **Bold** | ink |
| Summary **Total amount** | **24** | **Bold** | ink |
| Summary "Total" label | 16 | SemiBold | ink |
| Summary Subtotal / Delivery fee labels | 16 | Regular | muted |
| Summary Subtotal / Delivery fee amounts | 16 | Medium | ink |
| Card name, card price | 16 | SemiBold | ink |
| Rating number (cards and item screen) | 16 | Medium | ink |
| Diet tag text (meals), "Drink" label (item screens) | 16 | Medium | muted |
| Item description, Cart empty message, Order-confirmed message, Ready message | 16 | Regular | muted |
| Chip label, unselected | 16 | Medium | ink |
| Chip label, selected | 16 | SemiBold | #FFFFFF |
| Category tile label | 16 | Medium | ink |
| Search placeholder | 16 | Regular | muted |
| Nav label, active | 16 | SemiBold | accent |
| Nav label, inactive | 16 | Medium | muted |
| Button label, primary | 16 | SemiBold | #FFFFFF |
| Button label, secondary | 16 | SemiBold | ink |
| Checkout "Order summary" | 16 | SemiBold | ink |
| Checkout card label ("Delivery address", "Payment") | 16 | Regular | muted |
| Checkout card value ("Sample delivery address", "Cash on delivery") | 16 | SemiBold | ink |
| Cart row name / price | 16 | SemiBold | ink |
| Cart row "Qty 1" | 16 | Regular | muted |
| Panel heading "Added to cart" | 20 | Bold | ink |
| Panel status line | 14 | Regular | muted |

The checklist's 16 px "Details" title and "16 SemiBold Total" are **not** what the built frames show. The frames win.

## Components

| Component | Measured values | Source |
|---|---|---|
| **FoodCard** | 342 × 122 (min), white, radius 18, 1 px border, padding 12 (content at +13), gap 12. Image tile 96 × 96 #F1ECE5 radius 16 at (+13, +13). Info column x +121, gap 6: name (baseline +32) → diet tag pill (top +43) → row with price left and rating right (baseline +102). Rating right edge = card inner right edge. **Drink cards: no label row** (name baseline +32, price/rating baseline +62). | PDF, COMP |
| **DietTag (meals)** | Pill 34 tall, white, radius 16, 1 px border, padding 4/10 (text at +11), 16 Medium muted | PDF, COMP |
| **"Drink" label (item screens only)** | Plain text, 16 Medium muted, no pill, row 24 tall | PDF, META |
| **Rating** | 16 px star icon (#C8451C), gap 4, number 16 Medium ink | PDF, COMP |
| **FoodImage** | #F1ECE5 tile, radius 16. Glyph box 44 × 44 centred, glyph #B7ADA0, **same 44 px size on cards (96 × 96), Home tiles (106 × 80) and item screens (342 × 220)** | PDF, COMP |
| **Chip, unselected** | White, 1 px border, radius 22, **118 × 46** (Vegetarian), text at +17 | PDF |
| **Chip, selected** | Accent fill, **no border**, **117 × 44**, text at +16. Following chip shifts 1 px left (Non-veg at x 149 instead of 150 when Vegetarian is selected). | PDF |
| **Chip widths (unselected)** | Vegetarian 118, Non-vegetarian 156, Burgers 95, Wraps 83, Pizza 73, Rice Bowls 117, Drinks 82; gap 8 | PDF, META |
| **Button** | 342 × 52, radius 14. Primary accent. Secondary white with 1.5 px inside border #E9E4DD. | PDF |
| **SearchField** | 342 × 48, white, radius 14, 1 px border. Search icon 24 × 24 at (+17, +12) (box x 41 when the field is at x 24). Placeholder at x +53 (icon + gap 12). | PDF |
| **CategoryTile** | Column: image tile 106 × 80 (#F1ECE5, radius 16, glyph 44 centred) → gap 8 → label 16 Medium ink centred (line 24). Total 112. **No border, no background.** | PDF, COMP |
| **TopBar** | 390 × 56 at y 44, padding 0 24, gap 8. Back: 44 × 44 hit area at x 24, 24 px icon centred (box x 34, y 60). Title 24 Bold, baseline 82: x 76 with Back, x 24 without. | PDF, META, COMP |
| **NavBar** | 390 × 76 at y 768, white, 1 px top border inside. Three equal tabs. Icon 24 × 24 above label (gap 2), content centred: icon box y 781.5, label baseline 826.5. Icon boxes at x 53 / 183 / 313. | PDF, COMP |
| **CartRow** (seen in the panel) | 342 × 60 including a 1 px bottom border. Left column: name (16 SemiBold) and "Qty 1" (16 Regular muted), gap 2, centred vertically. Price (16 SemiBold) right, centred. | PDF (DERIVED: centring from baselines 639.5 / 665.5 / 652.5 in a 616–676 row) |
| **Summary** | Rows gap 8. Subtotal and Delivery fee rows 24 tall; Total row 32 tall (label sits 4 px down, amount 24 Bold). | PDF, META |

## Screens (positions; the PDF agrees with META everywhere both exist)

| Screen | Positions |
|---|---|
| **Ready** | Wordmark centred, baseline 326 (box y 300); message centred, baseline 363; **Start at y 744** (every other bottom button is at 752) |
| **Home** | Wordmark x 24, baseline 86 (box y 60). Search (24, 116). "Categories" baseline 214 (y 188). Tiles at x 24 / 142 / 260, y 232 and 360; labels baselines 339 / 467. "Featured meals" baseline 522 (y 496). Cards at y 540 / 674 / 808. Nav y 768. |
| **Menu (fixed header)** | 0–158, #FAF8F5, **no bottom border**. Title "Menu" x 24, baseline 82, **no Back**. Diet filters at y 100, x 24 and 150. |
| **Menu (scrolling list)** | **Category chips scroll with the list**: row 1 at y 164 (Burgers x 24, Wraps x 127, Pizza x 218), row 2 at y 218 (Rice Bowls x 24, Drinks x 149). First section heading y 288 (baseline 314). First card y 332. Card step 134 (122 + 12). Section gap 24. Bottom padding 100. |
| **Menu, task cards** | Veggie Supreme / Chicken Fajita / Mango Lassi / Mint Lemonade. All: 1650 / 1784 / 2432 / 2700. Vegetarian: 846 / – / 1494 / 1762. Non-vegetarian: – / 1248 / 1530 / 1798. |
| **Item (meal)** | TopBar with Back. Image tile (24, 116) 342 × 220. Name baseline 378 (y 352). Tag/rating row y 400, 34 tall (tag left; rating right-aligned to x 366). Price baseline 476 (y 450). Description from y 498 (baseline 517), 342 wide, left-aligned. Add to cart y 752. |
| **Item (drink)** | Same, but the row is 24 tall with plain "Drink": row baseline 419, price baseline 466 (y 440), description baseline 507 (y 488) |
| **Cart (empty)** | TopBar "Cart", **no Back**, title x 24. Empty message x 24, baseline 135 / 159 (y 116), left-aligned, wraps at 342. Nav, Cart tab active. |
| **Checkout** | TopBar with Back. "Order summary" baseline 135 (y 116). Address card (24, 232) and payment card (24, 334): 342 × 86, white, radius 14, 1 px border, label at (+17, baseline +36), value at (+17, baseline +64). Summary from y 436. Place order y 752. |
| **Order confirmed** | No TopBar. Badge 80 × 80 at (155, 88), accent, white check 40 × 40 at (175, 108). Heading centred, baseline 210 (y 184). Message centred, baselines 251 / 275 (y 232). Rows from y 296. Summary from y 372. Back to home y 752. |
| **Added-to-cart panel** | Backdrop 40% black. Sheet y 527, 390 × 317, white, top radius 24, padding 24 / 24 / 32. Header row y 551: badge 40 × 40 accent (check 24 at +8), gap 12, heading (baseline 572) over status (baseline 593). Item row y 616. View cart y 696; Back to menu y 760. |

## Icons extracted to `src/assets/b/`

Every icon is copied exactly from the PDF's vector paths, moved into its own icon box, with the original colours and fill rules. Nothing is redrawn. The PDF stores Figma's strokes as filled outlines, so these SVGs are filled shapes; they look the same at any size.

Check: each SVG was rendered at 8× and compared pixel by pixel with Figma's own vectors (pixels differing by more than 50%):

| File | Size | Colour | Compared with | Differing pixels |
|---|---|---|---|---|
| glyph-burger.svg | 44 | #B7ADA0 | Figma B burger glyph; Figma glyph inside A's tile | 4 of 35,927; 7 of 35,960 |
| glyph-wrap.svg | 44 | #B7ADA0 | Figma glyph inside A's tile | 0 of 13,372 |
| glyph-pizza.svg | 44 | #B7ADA0 | Figma glyph inside A's tile | 1 of 19,768 |
| glyph-bowl.svg | 44 | #B7ADA0 | Figma glyph inside A's tile | 9 of 16,582 |
| glyph-drink.svg | 44 | #B7ADA0 | Figma glyph inside A's tile | 0 of 16,391 |
| icon-search.svg | 24 | #6B645C | Figma A search icon (shape only; A is pink) | 0 of 6,200 |
| icon-back.svg | 24 | #1F1B16 | Figma B back icon | 0 of 2,767 |
| icon-star.svg | 16 | #C8451C | Figma B star icon | 0 of 4,046 |
| nav-home-active.svg / -inactive.svg | 24 | #C8451C / #6B645C | Figma B nav icons | 0 of 9,232 |
| nav-menu-active.svg / -inactive.svg | 24 | #C8451C / #6B645C | Figma B nav icons | 0 of 8,034 |
| nav-cart-active.svg / -inactive.svg | 24 | #C8451C / #6B645C | Figma B nav icons | 0 of 8,500 |
| icon-check.svg | 40 | #FFFFFF | **No Figma original available** | Not compared. The panel's 24 px check matches it exactly at 0.6× scale. |

## React Theme B today (after the Step 4.5a font change)

Task-card tops: All 1556 / 1690 / 2336 / 2604; Vegetarian 752 / 1398 / 1666; Non-vegetarian 1154 / 1428 / 1696. These are 94 px above Figma, because React keeps the chips in the fixed header. That's a Step 4.5c item. Screenshots: `testing/step-4.5a-font/`.

## Still unverified (not visible in any source)

1. **Filled Cart.** The Cart's item rows, summary and Checkout button are hidden layers, so they aren't in the PDF. META places the Checkout button at y 700. DERIVED: with the empty message hidden, Figma's auto layout would start the rows at y 116 (scroll padding 16), with the summary 16 below the last row. Cart-row and summary *styles* are assumed to be the same components seen in the panel and Checkout.
2. **Checkout with real items.** Item rows are hidden in the export. DERIVED: rows start at y 156 (heading + 16) and the cards move down by 60 per row.
3. **Real totals.** All summaries in the export show the variables' default "Rs. 0". Formats are already in the data rules.
4. **Check icon.** Taken from Figma's `icon/check` box but not compared with a Figma original.
5. **Weights of very short texts** (for example "Home", 1–3 digits) can't be told apart by width. Where it matters, the measured component code decides (NavBar inactive = Medium).
6. **Prototype A** isn't in this PDF. Step 5 needs page 02 exported the same way.

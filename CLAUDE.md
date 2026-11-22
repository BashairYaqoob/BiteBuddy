# CLAUDE.md: BiteBuddy AHCI study (React implementation)

Read this whole file before doing any work in this repository. It is the handoff from the Figma phase of the project. Everything here was taken from the project's methodology plan, shared menu sheet, Prototype A construction plan, the Figma file and the recorded verification and audit results. Anything not confirmed is marked **[VERIFY]**. Do not fill those gaps by guessing.

---

## 0. Rules for every Claude Code session

1. Read this file first, every session.
2. Before any major step, explain what you plan to change and why, then wait for the go-ahead.
3. Make small, understandable changes. One feature or screen at a time.
4. Do not delete, rename or restructure files unless that is needed and explained first.
5. Do not install any dependency without saying what it is, why it is needed, and what the alternative without it would be. Wait for approval.
6. Do not commit, push, create branches or change branches without explicit permission.
7. Never modify the Figma file or the project documents (Methodology Plan, Shared Menu Sheet, Construction Plan). They are the reference, not part of this repo.
8. Never change menu data, prices, ratings, descriptions, diet tags, item order or task answers (section 4).
9. Never make Prototype A and Prototype B behave differently (section 6).
10. Report what was done, what was tested and what is still unresolved, honestly. Say "not tested" when something was not tested.
11. The owner (Bashair) also uses ChatGPT for explanations. Keep explanations plain and name files and commands exactly, so they can be checked elsewhere.

---

## 1. Project overview

### What BiteBuddy is
BiteBuddy is a **fictional mobile food-ordering app** built for an Applied Human-Computer Interaction (AHCI) course research project at FAST NUCES Karachi. Project title: **"How Interface Design Shapes Attention and Decision-Making"**. Instructor: Ms. Summaiya Zahid. The owner is completing the work alone (the group is nominally three people).

The app has a fixed menu of 14 meals and 6 drinks, a Home screen, a categorised Menu with diet filters, item detail screens, a cart, checkout and an order-confirmed screen. Ordering is simulated; nothing is sent anywhere.

### Purpose of the study
To compare a **high-visual-complexity** version (Prototype A) and a **low-visual-complexity** version (Prototype B) of the same mobile food-ordering interface, with **identical content and functionality**, and measure the effect on task performance, attention-related interaction behaviour, perceived workload and preference among university students.

### Research gap (from the Methodology Plan)
Across the five papers reviewed (HCEye, Sarvi, Cheng, Bentley, Alhamadi), none compares a visually complex and a visually simple version of the same mobile food-ordering screens with identical content, using multi-step tasks and low-cost behavioural measures alongside perceived workload and preference. The study does **not** claim no such study exists anywhere, does **not** measure gaze, and does **not** claim results from about 12 students generalise beyond them.

### Research questions and expected directions

| RQ | Question | Measured by | Expected direction (hypothesis, not a result) |
|---|---|---|---|
| RQ1 | Do participants show more off-target interaction and more missed target information on the high-complexity design? | Wrong-turn taps, scroll-pasts, time to first relevant tap | More on A than B |
| RQ2 | Does the design change how accurately and how quickly people pick the correct item? | Success rate, decision errors, task time on T1 and T2 | Lower accuracy and slower on A |
| RQ3 | Which design supports faster, more accurate completion of the whole ordering flow? | Task time, success, errors on T3 and across tasks | Faster and fewer errors on B |
| RQ4 | Which design do people find harder, and which do they prefer? | Raw NASA-TLX, busyness rating, overall preference | Higher workload on A; B preferred |

**[VERIFY]** The formal hypotheses are labelled H1–H4 in the owner's proposal. Their exact wording is not in the available documents; the expected directions above are mapped from the Methodology Plan. Get the exact H1–H4 text from the owner before using it anywhere.

"Attention-related" always means a **behavioural proxy**, never gaze.

---

## 2. Experimental methodology

### Design
- **Within-subjects:** every participant uses both prototypes.
- **Independent variable:** visual complexity, two levels: A (high), B (low).
- **Dependent variables:** task time, success, errors (decision errors and wrong turns), interaction behaviour (taps against shortest path, backtracks, scroll-pasts, time to first relevant tap), perceived workload (Raw NASA-TLX), visual busyness rating, preference.
- **Held constant:** food items, prices, ratings, descriptions, diet tags, item order, functionality, screens, shortest tap path for every task, device, task wording, transitions and timing, minimum text and tap-target sizes.
  - **Changed (owner, 22 Nov 2026):** in the React Prototype A, **item order, category navigation (category chips, Home category tiles, section headings), the shortest tap path and the 4.5:1 contrast floor are no longer held constant.** A is now a deliberately poor design with a mixed, uncategorised menu (section 3, "React Prototype A redesign"). Food items, prices, ratings, descriptions, diet tags, task wording, screens, cart, checkout, navigation handlers, transitions, time caps and logging are still identical. **[VERIFY]** The Methodology Plan (outside this repo) has not been updated to match; the owner must do that.
- Participants see neutral names only: **"Design 1"** and **"Design 2"**. Never show "A", "B", "complex" or "simple" to participants, in the UI, page titles, URLs they can see or file names on screen.

### Participants
- Target **12 university students** (3 per counterbalancing condition). If only 10–11, balance as closely as possible; if more, go to 16 (4 per condition), not 13–15. Twelve is a practical size, not from a power calculation.
- Inclusion: current university student aged 18+; owns and regularly uses a smartphone; has used a food-delivery app at least once; normal or corrected vision and no self-reported colour-vision difficulty.
- Exclusion: team members and anyone who has seen the prototypes.
- Convenience sampling (classmates and campus students, 25-minute sign-up slots).
- Ethics: short consent form; participant codes P01, P02, …; collect only age band, optional gender and food-app habits; screen-only recording with consent; delete recordings after analysis.

### Task sets
Three tasks per prototype, always in the order T1, T2, T3. **Each task starts at Home with an empty cart.** The moderator reads the wording aloud and shows it on a card. Exact wording and answers are in section 4.

### Counterbalancing (four conditions, assigned in rotation)

| Condition | First block | Second block | Participants (of 12) |
|---|---|---|---|
| C1 | Prototype A with Set 1 | Prototype B with Set 2 | P01, P05, P09 |
| C2 | Prototype A with Set 2 | Prototype B with Set 1 | P02, P06, P10 |
| C3 | Prototype B with Set 1 | Prototype A with Set 2 | P03, P07, P11 |
| C4 | Prototype B with Set 2 | Prototype A with Set 1 | P04, P08, P12 |

The first block's prototype is called "Design 1", the second "Design 2".

### Session procedure (about 25 minutes)
1. Prepare: check condition, same phone, do-not-disturb, start screen recording, reset the prototype.
2. Welcome and consent (2 min), neutral description.
3. Background questions (1 min).
4. Practice (2 min) on a tiny separate prototype with unrelated content (for example a drinks list). **[VERIFY]** Not built yet in Figma or React.
5. Block 1 (about 6 min): T1, T2, T3 from the assigned set on Design 1. Moderator observes silently.
6. Questionnaire 1 (2 min): Raw NASA-TLX + busyness rating.
7. Break (1 min), reset, swap prototype.
8. Block 2 (about 6 min): other prototype, other set.
9. Questionnaire 2 (2 min).
10. Final questions (2 min): preference, one-sentence reason, "what, if anything, made it hard to find what you needed?"
11. Debrief.

Pilot with 1–2 people not counted in the 12. If the two sets' median times differ clearly (rule of thumb: more than 15 s), prices may be adjusted **before** testing only. Never after testing starts.

### Measurements and definitions (from the Methodology Plan)
- **t0:** the moment the Home screen first appears after the participant taps **Start** on the neutral Ready screen. The Ready screen is identical in A and B. The moderator reads the task before the Ready screen is opened.
- **Task completion time:** seconds from t0 to the task's end event.
  - T1 and T2 end when the participant adds an item to the cart.
  - T3 ends when the Order confirmed screen appears.
- **Time caps:** 120 s for T1 and T2, 180 s for T3. At the cap: stop, record failure, record the capped time and flag it as censored.
- **Success:**
  - T1/T2: success only if the item added is the single correct one. A different item is a decision error and a failure.
  - T3: success only if exactly the named meal and drink, one of each, were ordered.
- **Errors:** decision error = wrong item added to the cart. Wrong turn = opening a screen or item not on a path to the goal, then going back.
- **Interaction behaviour:** taps against the shortest path; backtracks; scroll-pasts (the target was on screen and the participant scrolled away without selecting it); time to first relevant tap.
- **Tap:** a touch that lands and lifts without moving. Scrolls and swipes are not taps. A tap on a non-interactive area is a **dead tap**: log it, but it is never a relevant tap.
- **Relevant tap (valid-first-step list, fixed for both prototypes):**
  - T1: the matching diet filter, a category tab, or a meal card of the named diet.
  - T2: the Burgers (Set 1) or Wraps (Set 2) category, or a chicken burger or chicken wrap card.
  - T3: the Pizza category, or the named pizza card.
- **Note (22 Nov 2026):** Theme A has no category chips or tiles, so in A only the filter and card entries of these lists can occur. The lists themselves (`src/data/relevantTaps.js`) are unchanged.
- Irrelevant taps before the first relevant tap are logged, do not stop the clock, and feed wrong-turn and decision counts.
- **Perceived workload:** Raw NASA-TLX, six scales (mental, physical, temporal, performance, effort, frustration), each 0–20, once per prototype after its three tasks. Raw TLX = mean of the six. Performance runs good (0) to poor (20) and is **not** reversed. Report per-person B minus A.
- **Visual busyness:** one rating 1 (very calm) to 7 (very busy) per prototype. Doubles as a manipulation check.
- **Preference:** after both blocks: Design 1, Design 2 or no difference, plus one sentence why.
- **Analysis:** per-person B minus A differences, medians and ranges, per-person charts, counts of participants better on B, first-block vs second-block comparison, optional exploratory Wilcoxon signed-rank test. Report patterns, never strong claims.

The Methodology Plan's primary capture method is **screen recording of the phone, coded frame by frame**, with a stopwatch as backup. Any in-app logging built in React is a **supplementary behavioural record**, not a replacement, unless the owner decides otherwise. **Decided (owner, 21 Nov 2026): confirmed, logging stays supplementary.**

### Known limitations (state these in the report)
- Small convenience sample (~12 students).
- "High complexity" bundles many changes (colour, density, hierarchy, decoration); no single factor can be isolated.
- Learning and order effects (handled by parallel sets, counterbalancing, practice, block comparison).
- Task sets are not equally hard. In Set 1 T1, the cheapest meal overall (Spicy Chicken Wrap, Rs. 610) is not vegetarian, so the diet check is needed to reach Chana Pulao Bowl (Rs. 630). In Set 2 T1, the correct item (Spicy Chicken Wrap) is also the cheapest meal overall. The gap to the next cheapest is Rs. 20 (Set 1) vs Rs. 30 (Set 2), and the answers sit in different categories. Counterbalancing spreads this across A and B but does not remove it.
- No gaze data. Scroll-pasts and first-tap time only suggest what was noticed.
- A prototype is not a real app (timing and scrolling differ).
- Single coder for errors and scroll-pasts (re-check ~20% of recordings).
- Expectation effects (neutral names, neutral briefing, preference asked last).
- Raw NASA-TLX with few people.
- **Added 22 Nov 2026 (React Prototype A redesign):** A vs B is no longer a pure visual-complexity contrast. A also removes categories and shows items in a different (mixed) order, so information organisation is confounded with visual complexity. Some A task text is below 4.5:1 contrast (lowest measured 2.27:1). A's task cards sit 200–450 px further down the Menu than B's. A's category-based "relevant first taps" cannot occur in A, so `firstRelevantTapMs` differs between A and B by construction. A has non-interactive look-alike buttons, so dead taps are expected to be higher in A by design.

---

## 3. Figma prototype documentation

### File
- Figma file: **"BiteBuddy – AHCI Prototypes (Copy)"**, an editable Drafts copy: `https://www.figma.com/design/iKTMZMBchGyKML91E9yEWN/`
- Pages:
  - `01 - Prototype B` (low complexity, the approved functional reference)
  - `02 - Prototype A` (high complexity, plus an "A / Components" section)
  - `03 - Components` (shared components used by B, and by A / Ready's Start button)
- Read-only for this project. Do not edit it.

### Device and frames
- Every screen is **390 × 844 px**, iPhone 14, portrait.
- Each prototype has **32 frames**: Ready, Home, Menu – All, Menu – Vegetarian, Menu – Non-vegetarian, 20 item detail screens, Cart, Checkout, Order confirmed, and 4 "Added to cart" overlay panels.
- One flow per prototype: **"Task 3 - Meal and drink order (Task Sets 1 and 2)"**, starting at **Home**.
- Transitions: navigate and panel open use **dissolve, ease-out, 200 ms**. Scroll-to uses **animated scroll, ease-out, 300 ms**. No other motion anywhere.

### Screens and their purposes

| Screen | Purpose and content (identical in A and B) |
|---|---|
| Ready | Neutral moderator screen. Wordmark "BiteBuddy", message "Wait for the moderator, then tap Start.", a **Start** button. In Figma, Start has **no interaction** (the flow starts at Home). |
| Home | Wordmark, search field (placeholder "Search meals and drinks", **non-functional**), "Categories" with 5 tiles (Burgers, Wraps, Pizza, Rice Bowls, Drinks), "Featured meals" with 3 cards: Vegetable Biryani, Chicken Caesar Wrap, Cheese Margherita Pizza (in that order). Featured cards are **not interactive**. Bottom nav: Home, Menu, Cart. |
| Menu – All | Fixed header (title "Menu" and two diet filters: Vegetarian, Non-vegetarian), 5 category chips, 5 sections (Burgers, Wraps, Pizza, Rice Bowls, Drinks) with 20 cards in menu-sheet order, bottom nav. |
| Menu – Vegetarian | Same layout with Vegetarian selected. Shows vegetarian meals only, plus all 6 drinks (drinks have no diet tag). |
| Menu – Non-vegetarian | Same layout with Non-vegetarian selected. Shows non-vegetarian meals only, plus all drinks. Rice Bowls section shows "No non-vegetarian items in this category." |
| Item detail (×20) | Top bar with Back and title "Details", image placeholder, name, diet tag (meals) or "Drink" label (drinks), rating, price, description, "Add to cart" button. No nav bar. |
| Cart | Title "Cart". Empty state: "Your cart is empty. Browse the menu to add items." Otherwise: one row per added item (name, "Qty 1", price), summary (Subtotal, Delivery fee Rs. 150, Total), "Checkout" button, bottom nav. |
| Checkout | Back, title "Checkout", "Order summary" item rows, "Delivery address" card ("Sample delivery address", fixed), "Payment" card ("Cash on delivery", the only option), summary, "Place order" button. No nav bar. |
| Order confirmed | Check circle, heading "Order confirmed", message "Thank you. Your order has been placed and will arrive soon.", item rows, summary, "Back to home" button. No nav bar. |
| Added-to-cart panel (×4 in Figma) | Bottom sheet over a dimmed backdrop: check circle, "Added to cart", live status line ("Cart: N items · Rs. X"), the added item's row, "View cart" (primary) and "Back to menu" (secondary). |

### Navigation and interactions (Prototype B; A is identical)
Totals in each prototype: **72 interactive layers, 118 top-level actions + 24 inside conditionals.** Action types: 44 navigate, 20 scroll-to, 5 back, 61 set-variable (37 top-level + 24 in conditionals), 4 conditional, 4 open-panel, 4 close-panel.

- **Home:** each category tile → Menu – All, then scroll to that section. Menu tab → Menu – All. Cart tab → Cart.
- **Menu screens (all three):** each category chip → scroll to that section. Home tab → Home. Menu tab → Menu – All. Cart tab → Cart.
- **Diet filters (exactly as built in B; see the note below):**
  - On Menu – All: Vegetarian → Menu – Vegetarian; Non-vegetarian → Menu – Non-vegetarian.
  - On Menu – Vegetarian: Vegetarian (tap again) → Menu – All; Non-vegetarian → **Menu – All**.
  - On Menu – Non-vegetarian: Non-vegetarian (tap again) → Menu – All; Vegetarian → Menu – Vegetarian.
- **Item screens:** Back → previous screen. Add to cart → sets cart state, then opens that item's panel.
- **Panel:** tapping the backdrop closes the panel (stays on the item screen). View cart → Cart. Back to menu → **Menu – All** (filters reset).
- **Cart:** Checkout → Checkout. Home and Menu tabs.
- **Checkout:** Back → previous screen. Place order → Order confirmed.
- **Order confirmed:** Back to home → Home **and resets the whole cart** (all 25 variables to defaults).
- **Scroll-to offset:** on Menu screens the target section heading lands just below the fixed header. In Figma this is a Y offset of **−158 px** (the fixed header height), set by hand on all 20 scroll-to actions in each prototype.

**Decided (owner, 21 Nov 2026): diet filter asymmetry.** On Menu – Vegetarian, tapping "Non-vegetarian" goes to Menu – All, but on Menu – Non-vegetarian, tapping "Vegetarian" goes to Menu – Vegetarian. This is how B was built and approved, and A copies it exactly. React replicates this exactly, identical in both conditions.

### Figma scope limits that React must not copy blindly
The Figma flow only wires **Task 3**. In both A and B:
- Only the four Task 3 item cards are tappable: Veggie Supreme Pizza (M10), Chicken Fajita Pizza (M11), Mango Lassi (D01), Mint Lemonade (D03), on each menu screen where they appear.
- The other 16 item detail screens exist but have **no Back and no Add to cart interaction**, and their menu cards are not tappable.
- Home featured cards are not tappable. Search is not functional.
- The cart logic is hard-coded for the two Task 3 pairs (see below).

T1 and T2 need **every meal** to be openable and addable (participants can add a wrong item, which must be visible and counted). The Methodology Plan requires: "Every meal and drink needs a working card, detail screen and Add button in both prototypes, with the same taps and the same result." So React must implement **all 20 items fully and identically in both conditions**. This completes the planned functionality; it is not a new A/B difference. **Decided (owner, 21 Nov 2026): confirmed.**

### Cart variables in Figma (for reference; React should compute, not hard-code)
Each prototype has its own collection with the same 25 variables: "BiteBuddy B / Cart state" and "BiteBuddy A / Cart state".

| Variable | Type | Default |
|---|---|---|
| `in_M01` … `in_M14`, `in_D01` … `in_D06` | Boolean | false |
| `has_items` | Boolean | false |
| `cart_empty` | Boolean | true |
| `subtotal_text` | String | "Rs. 0" |
| `total_text` | String | "Rs. 0" |
| `cart_status_text` | String | "Cart: 0 items · Rs. 0" |

Bindings: cart rows' visibility is bound to `in_*`. The empty message is bound to `cart_empty`. The summary and the Checkout button are bound to `has_items`. Summary values are bound to the text variables. The panel status line is bound to `cart_status_text`. There are 73 bindings per prototype: 25 on Cart, 22 on Checkout, 22 on Order confirmed and 4 panel status lines.

Add to cart (task items only), for example Veggie Supreme Pizza: set `in_M10 = true`, `has_items = true`, `cart_empty = false`, then:
- if `in_D01`: subtotal "Rs. 1,210", total "Rs. 1,360", status "Cart: 2 items · Rs. 1,210"
- else: subtotal "Rs. 950", total "Rs. 1,100", status "Cart: 1 item · Rs. 950"

The other three items follow the same pattern with their partner:
- Mango Lassi alone: Rs. 260 / Rs. 410
- Chicken Fajita Pizza alone: Rs. 1,090 / Rs. 1,240 (total computed as 1,090 + 150; the Figma string was not read back)
- Mint Lemonade alone: Rs. 240 / Rs. 390
- Fajita + Mint: Rs. 1,330 / Rs. 1,480

Known Figma artefacts, **not** to be reproduced:
- Mixing items from both sets shows a partial count, because the conditions only check the partner item.
- The player's Restart button may not reset variables (reloading does).

In React, compute count, subtotal and total from cart contents.

### Shared visual tokens (Prototype B, low complexity)
Font: **Plus Jakarta Sans** (both prototypes).

| Token | Value |
|---|---|
| color/accent | #C8451C |
| color/accent-soft | #FCEBE4 |
| color/ink | #1F1B16 |
| color/muted | #6B645C |
| color/border | #E9E4DD |
| color/surface | #FFFFFF |
| color/bg | #FAF8F5 |
| color/placeholder | #F1ECE5 |
| color/glyph | #B7ADA0 |
| color/on-accent | #FFFFFF |

**B typography:**
- Headings and titles: 24 Bold.
- Body: 16 (Regular for descriptions and muted text, Medium for labels and ratings, SemiBold for names, prices and buttons).
- Item screen name and price: 24 Bold.
- Panel heading "Added to cart": 20 Bold. Panel status line: 14 Regular.
- Wordmark "BiteBuddy": 24 Bold, "Bite" in ink and "Buddy" in accent.
- Active nav label: SemiBold accent. Inactive nav labels: Medium muted.

**B layout and components (from page 03 and the B screens):**
- Screen side padding 24 px; gap between sections 24 px.
- Home scroll padding: 60 top, 24 sides, 100 bottom.
- Menu fixed header: 390 × 158 (status-bar space 44, top bar 56, diet filters).
- Menu scroll padding: 164 top, 24 sides, 100 bottom. Section internal gap 12.
- FoodCard: 342 × 122, radius 18, padding 12, gap 12, surface fill, 1 px border.
- FoodImage: 96 × 96, radius 16, placeholder fill, category glyph (Burger, Wrap, Pizza, Bowl, Drink). No photos in either prototype.
- DietTag: height 34, radius 16, padding 4/10, surface fill, 1 px border.
- Chip (category chips and diet filters): padding 10/16, radius 22, about 44–46 px tall. Selected: accent fill with on-accent text. Unselected: surface fill with 1 px border.
- Button: 342 × 52, radius 14. Primary: accent fill. Secondary: surface fill with 1.5 px border.
- SearchField: 342 × 48, radius 14, 1 px border.
- NavBar: 390 × 76 with Home, Menu and Cart tabs.
- TopBar: 390 × 56, Back hit area 44 × 44.
- CartRow: 342 × 60, padding 14 vertical, divider border.
- CategoryTile: 106 × 112.
- Item screen: top bar at y 44, content from y 100 (gap 16, image 342 × 220), Add to cart fixed at y 752.
- Panel sheet: starts at y 527, height 317, top radius 24, padding 24/24/32, gap 20. Backdrop: black at 40% opacity.
- Prices: "Rs. 720", comma thousands ("Rs. 1,090"), no decimals. Ratings: one decimal ("4.0"), shown with a star.

### Prototype A (high complexity): what changes
> **Superseded in React (owner, 22 Nov 2026).** This subsection describes the Figma Prototype A, which is still the Figma reference but is **no longer** what the React Theme A looks like. For the React A, read "React Prototype A redesign" below. Decisions 3, 9 and the "Task-item vertical positions" table no longer hold in React.

Approved decisions (21 Nov 2026), applied in Figma:
1. Separate A cart state, same 25 variables and logic.
2. Single-column menu with denser cards.
3. Task-related text ≥ 14 px; decorative text ≥ 12 px; all contrast ≥ 4.5:1.
4. No badges beyond the diet tag; nothing reveals or implies price, rating, diet or task relevance.
5. Promotions static, non-interactive, general wording only; never name, depict or hint at an item, price, discount or delivery offer.
6. Plus Jakarta Sans only; complexity through weights, sizes, uppercase and colour.
7. A components kept separate from shared components.
8. Ready screen identical to B.
9. Task-item scroll positions kept as close to B as practical.
10. Primary action colour #C8451C in both.

**A tokens** = B's 10 tokens, except `color/bg = #FFF4E6`, plus four decorative accents:
- `color/decor-mustard` #F2B705
- `color/decor-teal` #0F8B8D
- `color/decor-violet` #6C3FC5
- `color/decor-pink` #E0457B

A / Ready uses B's background #FAF8F5 as a fixed value, so it stays identical to B.

**Contrast note:** #C8451C text on #FFF4E6 is 4.47:1 (fails), so A never uses accent-coloured text on the A background. Mustard, teal and pink are decorative fills only. Violet is used for headings and prices (≥ 6:1 on white or cream).

**A treatment as built:**

| Area | Prototype B | Prototype A |
|---|---|---|
| Background | Flat #FAF8F5 | #FFF4E6 with static decorations (dots, confetti, stripes, blobs, stickers) behind content |
| Spacing | 24 px padding, 24 px section gap | 16 px padding, 8 px gaps (with extra space below some sections to hold task-item positions) |
| Menu cards | 342 × 122, radius 18, 1 px border | 358 × 116, radius 14, padding 8, 2 px violet (#6C3FC5) border, multi-colour image tile with corner dots |
| Section headings | 24 Bold, ink | 20 ExtraBold, uppercase, violet |
| Prices on cards | 16 SemiBold, ink | 16 ExtraBold, violet |
| Item names on cards | 16 SemiBold | 16 ExtraBold |
| Wordmark | 24 Bold | 28 ExtraBold uppercase, "Buddy" in violet |
| Promotions | None | Home hero banner (342 × 96: "Fresh picks every day" 20 ExtraBold, "Cooked with care, served with a smile" 14 Medium); Menu ticker band (390 × 28: "Hello hungry ✦ Hello hungry ✦ Hello hungry", 12 Bold); promo strip (342 × 40: "Good food · Good mood · Good food", 14 ExtraBold). All static, non-interactive, displayed uppercase. |
| Item screens | Plain layout | White info card (2 px violet border, radius 16) behind name, tag, rating, price and description; name and price ExtraBold (price violet); larger image tile with corner dots; promo strip and decorations in empty space |
| Cart / Checkout / Order confirmed | Plain summary | Summary in white card with 2 px violet border and radius 16; total ExtraBold violet; Checkout "Order summary" 20 ExtraBold uppercase violet; violet-bordered address and payment cards; decorations |
| Panels | Plain sheet | 2 px violet sheet border, "Added to cart" uppercase ExtraBold violet, decorative dots and sticker |
| Badges | Diet tag only | Diet tag only |
| Motion | None | None |

A component set (page 02, "A / Components"):
- A / FoodImage (96 × 96) and A / FoodImage – Detail (342 × 220)
- A / DietTag (108 × 34)
- A / Chip
- A / Button (342 × 52)
- A / SearchField (342 × 48)
- A / FoodCard (342 × 116 in the component; cards are 358 wide on the Menu screens)
- A / NavBar (390 × 76)
- A / CartRow (342 × 60; shows "Qty 1" displayed uppercase)
- A / CategoryTile (106 × 112)
- A / TopBar (390 × 56)
- A / PromoBanner (Hero, Strip, Ticker)
- A / Decor (Dots, Confetti, Stripes, Blob, Sticker)

"A / Badge" was deliberately not built.

**Task-item vertical positions** (px from screen top to card top, before scrolling). A is within ±10 px of B everywhere:

| Screen | Veggie Supreme (B / A) | Chicken Fajita (B / A) | Mango Lassi (B / A) | Mint Lemonade (B / A) |
|---|---|---|---|---|
| Menu – All | 1650 / 1655 | 1784 / 1779 | 2432 / 2442 | 2700 / 2690 |
| Menu – Vegetarian | 846 / 848 | not shown | 1494 / 1504 | 1762 / 1752 |
| Menu – Non-vegetarian | not shown | 1248 / 1248 | 1530 / 1540 | 1798 / 1788 |

### React Prototype A redesign (owner decisions, 22 Nov 2026)
The React Theme A was redesigned to be **deliberately visually distracting and poorly designed**, violating HCI principles on purpose. It no longer matches the Figma Prototype A. The previous, Figma-matched A stylesheet is in git history: `git show ab83a8f:src/theme/theme-a.css`.

**Owner decisions (asked and answered 22 Nov 2026):**
1. **Categories removed and items mixed, in A only.** No category chips, no Home category tiles, no section headings, no "No non-vegetarian items in this category." message. One mixed list in a fixed order (`src/data/layoutA.js`, `A_MENU_ORDER`), identical for every participant, never random. B keeps the frozen sheet order. Menu data itself (`src/data/menu.js`) is unchanged.
2. **Poor contrast allowed on task text too** (names, prices, ratings, diet tags), not only decorative text.
3. **Task-card positions may differ from B.** Measure and report them instead of holding ±10 px.
4. **Non-interactive look-alike buttons/chips allowed** (`Promo type="fake"`), with neutral words only (`A_FAKE_WORDS`: "Yum!", "Wow!", "Hey there"…). No item, price, rating, diet, category or offer. Taps on them pass through and are logged as dead taps.

**A_MENU_ORDER** (Menu – All, top to bottom): D04, D02, M12, M01, M13, M06, M02, M09, M07, M10, D06, M11, M05, M14, D01, M03, D03, M08, D05, M04. Set 1 / Set 2 targets were placed at similar depths (T1 M13 #5 / M07 #9; T2 M02 #7 / M06 #6; T3 M10 #10 / M11 #12 and D01 #15 / D03 #17). Do not change once the pilot starts.

**Deliberate violations in A (visual only; behaviour is identical to B):**
- Visual hierarchy: prices, ratings and promos compete with names; headings small and pale; Total smaller than Subtotal.
- Consistency: five rotating card styles (colour, border, radius, shadow, tilt, field placement), so the same item can look different under another filter; each screen's primary button has a different shape; nav tabs and the two diet filters each look different.
- Proximity: price, rating and diet tag placed in different corners per card; on the item screen the price is at the top, far from the name; labels far from values on Checkout cards and in the summary.
- Similarity: fake buttons/chips look like real controls; promo strips look like cards.
- Alignment and crowding: mixed left/centre/right alignment, offset and tilted cards, small gaps.
- Affordances and status: Back has no visible button shape on most screens; the selected diet filter and active nav tab are only subtly marked.
- Cognitive load: patterned background, extra decorations, tickers, strips and fake buttons between cards.

**Still kept in A:** every control ≥ 44 × 44 px (smallest measured 45 px); task text ≥ 14 px; item names never truncated or covered; decorations and promos never over a control, never tappable, static; primary action fill #C8451C; Ready and Wait screens identical to B; same screens, handlers, cart, logging and export.

**Where A differs in code:** `src/theme/theme-a.css` (all rules scoped to `[data-theme="A"]`, Ready excluded); `src/screens/Menu.jsx` and `src/screens/Home.jsx` (an `isA` branch: mixed list, no category tiles); `src/components/Promo.jsx` (fake type, renders nothing in B); `src/screens/ItemDetail.jsx` (one fake button, renders nothing in B); `src/data/layoutA.js`. The logger's class names (`.food-card`, `.chip`, `.btn`, `.nav-bar__tab`, `.top-bar__back`, `.category-tile`, `.screen__scroll`) are unchanged, and card text is still only item data, so tap and card logging work the same.

**Measured 22 Nov 2026 (Chromium, 390 × 844, dev build; not yet on the study iPhone):**
- Lowest task-text contrast in the A Menu: 2.27:1 (a price), 2.61:1 (a name).
- Task-card positions (px from the top of the list, B → A): Menu – All: Veggie Supreme 1605 → 1824, Chicken Fajita 1739 → 2162, Mango Lassi 2387 → 2770, Mint Lemonade 2655 → 3107. Vegetarian: Veggie Supreme 801 → 1095, Mango Lassi 1449 → 1623, Mint Lemonade 1717 → 1776. Non-vegetarian: Chicken Fajita 1203 → 1429, Mango Lassi 1485 → 1790, Mint Lemonade 1753 → 2146.
- Screenshots: `screenshots/prototype-a/` (17 PNGs).

---

## 4. Menu and task data (frozen, single source of truth)

Source: "BiteBuddy Shared Menu Sheet". **Do not change any value.** Prices are PKR, shown as "Rs. 720". Ratings are shown with one decimal.

| ID | Item | Category | Price | Rating | Dietary tag | Description | Type | Order |
|---|---|---|---|---|---|---|---|---|
| M01 | Crispy Chicken Burger | Burgers | 720 | 4.2 | Non-vegetarian | Fried chicken fillet, lettuce and mayo in a sesame bun. | Meal | 1 |
| M02 | Grilled Chicken Burger | Burgers | 790 | 4.6 | Non-vegetarian | Grilled chicken breast, tomato and garlic sauce in a sesame bun. | Meal | 2 |
| M03 | BBQ Chicken Burger | Burgers | 920 | 4.4 | Non-vegetarian | Chicken patty, onion rings and barbecue sauce in a sesame bun. | Meal | 3 |
| M04 | Veggie Crunch Burger | Burgers | 680 | 4.8 | Vegetarian | Crumbed vegetable patty, lettuce and mayo in a sesame bun. | Meal | 4 |
| M05 | Chicken Caesar Wrap | Wraps | 850 | 4.2 | Non-vegetarian | Chicken strips, lettuce and Caesar dressing in a flour tortilla. | Meal | 1 |
| M06 | Chicken Tikka Wrap | Wraps | 640 | 4.6 | Non-vegetarian | Tikka chicken, onion and mint chutney in a flour tortilla. | Meal | 2 |
| M07 | Spicy Chicken Wrap | Wraps | 610 | 4.4 | Non-vegetarian | Spiced chicken, cabbage and chilli sauce in a flour tortilla. | Meal | 3 |
| M08 | Falafel Wrap | Wraps | 660 | 4.8 | Vegetarian | Chickpea falafel, hummus and salad in a flour tortilla. | Meal | 4 |
| M09 | Cheese Margherita Pizza | Pizza | 770 | 4.3 | Vegetarian | Tomato sauce and mozzarella on a thin 9-inch crust. | Meal | 1 |
| M10 | Veggie Supreme Pizza | Pizza | 950 | 4.7 | Vegetarian | Peppers, olives, onion and mushrooms on a thin 9-inch crust. | Meal | 2 |
| M11 | Chicken Fajita Pizza | Pizza | 1,090 | 4.4 | Non-vegetarian | Fajita chicken, peppers and onion on a thin 9-inch crust. | Meal | 3 |
| M12 | Daal Chawal Bowl | Rice Bowls | 650 | 4.1 | Vegetarian | Yellow lentil daal over steamed rice with fried onion. | Meal | 1 |
| M13 | Chana Pulao Bowl | Rice Bowls | 630 | 4.4 | Vegetarian | Chickpea pulao with raita and a cucumber slice. | Meal | 2 |
| M14 | Vegetable Biryani | Rice Bowls | 690 | 4.3 | Vegetarian | Spiced rice with mixed vegetables and fried onion. | Meal | 3 |
| D01 | Mango Lassi | Drinks | 260 | 4.3 | none (drink) | Chilled yogurt drink blended with mango. | Drink | 1 |
| D02 | Sweet Lassi | Drinks | 220 | 4.1 | none (drink) | Chilled yogurt drink with sugar. | Drink | 2 |
| D03 | Mint Lemonade | Drinks | 240 | 4.4 | none (drink) | Fresh lemon, mint and soda. | Drink | 3 |
| D04 | Classic Lemonade | Drinks | 200 | 4.0 | none (drink) | Fresh lemon, sugar and water. | Drink | 4 |
| D05 | Fresh Orange Juice | Drinks | 300 | 4.2 | none (drink) | Orange juice squeezed to order. | Drink | 5 |
| D06 | Cola 345 ml | Drinks | 150 | 3.9 | none (drink) | Carbonated cola in a 345 ml can. | Drink | 6 |

Section order: Burgers, Wraps, Pizza, Rice Bowls, Drinks. Menu-wide checks:
- 14 meals: 7 vegetarian, 7 non-vegetarian.
- 6 drinks, with no diet tag.
- No two items share a price or a name.
- No item is rated exactly 4.5.

**Fixed rules (Rules tab):**
- Delivery fee Rs. 150.
- Delivery address pre-filled and not editable.
- Payment: Cash on delivery only.
- Quantity always 1, with no quantity control.
- Diet filters apply to meals only.
- No "popular" or "bestseller" badges in either prototype.
- Menu frozen once the pilot starts.

### Task sets (exact wording read aloud)

| Set | Task | Wording | Correct answer | Item price / order total |
|---|---|---|---|---|
| Set 1 | T1 | Find the cheapest vegetarian meal under Rs. 700 and add it to your cart. | Chana Pulao Bowl | Rs. 630 |
| Set 1 | T2 | Find a chicken burger rated above 4.5 and add it to your cart. | Grilled Chicken Burger | Rs. 790 |
| Set 1 | T3 | Add Veggie Supreme Pizza and Mango Lassi to your cart and place the order. | Veggie Supreme Pizza + Mango Lassi | Subtotal Rs. 1,210 + delivery Rs. 150 = **Rs. 1,360** |
| Set 2 | T1 | Find the cheapest non-vegetarian meal under Rs. 900 and add it to your cart. | Spicy Chicken Wrap | Rs. 610 |
| Set 2 | T2 | Find a chicken wrap rated above 4.5 and add it to your cart. | Chicken Tikka Wrap | Rs. 640 |
| Set 2 | T3 | Add Chicken Fajita Pizza and Mint Lemonade to your cart and place the order. | Chicken Fajita Pizza + Mint Lemonade | Subtotal Rs. 1,330 + delivery Rs. 150 = **Rs. 1,480** |

Every task has exactly one correct answer (verified by sheet formulas).

---

## 5. React implementation requirements

### Stack
Vite + React + plain JavaScript (the existing starter). **No new dependencies are needed for the core app.** Use React state and context for routing between screens and for the cart, and plain CSS (CSS custom properties) for themes. Ask before adding anything, including a router, state library, CSS framework or test runner.

Fonts: Plus Jakarta Sans, weights 400, 500, 600, 700 and 800. It must look the same in both conditions and must not depend on the network during sessions. A self-hosted font file in the project is preferable to a Google Fonts link. **[VERIFY]** Confirm the approach with the owner before adding font files.

### Recommended structure (proposal; explain and confirm before creating)
```
src/
  data/
    menu.js          // the 20 items exactly as in section 4 (single source)
    tasks.js         // task sets, wording, correct answers, caps, valid-first-step lists
    rules.js         // delivery fee 150, address text, payment text
  state/
    CartContext.jsx  // useReducer: add(itemId), reset(); derived count/subtotal/total
    NavContext.jsx   // screen stack: push, back, replace, resetTo('home'); overlay open/close
    SessionContext.jsx // participant code, condition, block, set, current task, timing
  logging/
    logger.js        // append-only event log in memory + export as JSON/CSV
  theme/
    tokens.css       // shared structure
    theme-a.css      // [data-theme="A"] variables and A-only decorative styles
    theme-b.css      // [data-theme="B"] variables
  components/        // shared: FoodCard, FoodImage, DietTag, Chip, Button, NavBar, TopBar,
                     // CartRow, CategoryTile, SearchField, Summary, AddedPanel, Decor, Promo
  screens/           // Ready, Home, Menu, ItemDetail, Cart, Checkout, OrderConfirmed
  moderator/         // setup + export screen (never shown to participants during tasks)
  App.jsx
```

### Principles
- **One set of screens and components for both conditions.** The condition only sets `data-theme="A"` or `"B"` on the app root. All layout differences come from CSS variables and theme classes.
- **Decorations and promo banners are components that render only when the theme is A.** They must be:
  - `aria-hidden="true"`;
  - non-interactive (`pointer-events: none`, so taps pass through to the background, where they are logged as dead taps);
  - static (no animation);
  - free of item names, prices, ratings, diet info or offers;
  - never placed over a control.
- **All content comes from `src/data/`.** No item text, price or rating is typed inside a component.
- **Theme A exception (owner, 22 Nov 2026):** Menu and Home have an `isA` branch: A shows one mixed list with no category chips, tiles or section headings (section 3, "React Prototype A redesign"). The two Menu and Fixed-header bullets below describe B (and the shared filter logic, which A also uses).
- **Menu screen:** one Menu component with a `filter` prop (all, veg, nonveg) rendering the three Menu states, in sheet order. Drinks always shown. When a filtered section has no meals, show the empty message. Only one case occurs with this menu: Rice Bowls under the Non-vegetarian filter, which shows "No non-vegetarian items in this category." exactly as in Figma. Every category has at least one vegetarian meal, so no vegetarian empty message exists or is needed.
- **Fixed menu header**, with category chips scrolling the list so the section heading lands directly below the header (CSS `scroll-margin-top` equal to the header height, smooth scroll ~300 ms). Home category tiles open Menu – All and scroll to that section.
- **Every item** card opens its detail screen, and every detail screen has Back and Add to cart (see the note in section 3; confirmed). Home featured cards and the search field: keep them non-interactive, matching Figma, unless the owner decides otherwise **[VERIFY]**.
- **Navigation semantics to match Figma:** Back returns to the previous screen. "Back to menu" goes to Menu – All. Tab buttons go to their screen. "Back to home" goes to Home and empties the cart. Screen transitions are a 200 ms ease-out fade in both themes, or none in both. Never different between themes.
- **Cart:**
  - Adding an item sets it in the cart with quantity 1. Adding the same item again changes nothing (matches Figma's boolean variables).
  - No remove and no quantity controls (matching Figma and the Rules tab).
  - Status line: "Cart: 1 item · Rs. 950" / "Cart: 2 items · Rs. 1,210". Subtotal, "Delivery fee Rs. 150", Total.
  - Format prices as "Rs. " plus comma thousands.
  - Empty state text and the hidden Checkout button follow Figma.
  - Cart rows appear in menu order (M01 … D06), as in Figma's fixed row order. **Decided (owner, 21 Nov 2026): confirmed, menu order.**
- **Panel after Add to cart:** a bottom sheet over a 40% black backdrop. Backdrop tap closes it. "View cart" and "Back to menu" buttons.
- **Ready screen:** identical in both themes (B styling, background #FAF8F5). Its Start button starts the task timer (t0 = Home rendered after Start).
- **Viewport:** design for 390 × 844 portrait. On the study phone, the layout must not depend on browser chrome differences between conditions. Same device, browser, zoom and brightness for every session. **Decided (owner, 21 Nov 2026):** one iPhone, the same physical phone for all 12 participants; Safari; portrait orientation; target design viewport 390 × 844 CSS pixels, matching the Figma prototypes.

### Accessibility floors (both themes)
- Task-related text ≥ 14 px.
- Decorative text ≥ 12 px.
- All text contrast ≥ 4.5:1. **Theme A exception (owner, 22 Nov 2026):** A may use poor contrast, including on task text (lowest measured 2.27:1). B keeps ≥ 4.5:1.
- Every tappable control ≥ 44 × 44 px.
- No overlapping or truncated item names.
- No decoration over a control.

The Figma audit lowest contrast was 4.58:1 (the Ready wordmark, identical in both).

### Session, task and logging support
Keep this simple and local. No backend, no analytics service, no network calls.

- **Moderator setup screen (moderator only):**
  - enter participant code (P01 …);
  - pick condition C1–C4, which derives the block order, prototype and set;
  - choose block and task;
  - export logs.

  Participants see only "Design 1" / "Design 2". Theme letters must not appear on any participant-visible screen or tab title.
- **Each task run:** reset cart and navigation to Home → show Ready → Start → t0.
  - T1 and T2 end at the first Add to cart; record the item and whether it is correct.
  - T3 ends when Order confirmed appears; record the ordered items and the total.
  - Enforce caps: 120 s for T1 and T2, 180 s for T3. Record a censored flag.
  - How the cap is shown to the moderator (not the participant): **[VERIFY]**.
- **Events to log** (each with a high-resolution timestamp relative to t0, plus participant, condition, prototype letter, set and task):
  - `tap`: pointer down and up without movement, with target id, role (interactive or dead), and screen;
  - `navigate`: from screen, to screen and cause;
  - `back`;
  - `filter`;
  - `chip_scroll`;
  - `open_item`;
  - `add_to_cart`: item id and correct or incorrect;
  - `panel_open` and `panel_close`;
  - `view_cart`;
  - `checkout`;
  - `place_order`;
  - `scroll`: throttled samples of scrollTop per screen;
  - `item_visibility`: IntersectionObserver enter and exit for each card, to support scroll-past detection;
  - `task_end`: success, time, censored.
- **Derived measures** (computed at export or in analysis, not shown to participants):
  - task time;
  - success;
  - decision errors (wrong item added);
  - wrong turns (opened a screen or item not on a path to the goal, then went back); the "on path" rule must be written down and agreed first **[VERIFY]**;
  - backtracks (Back taps and returns to a previous screen);
  - taps vs the shortest path (shortest path per task to be defined and recorded in `tasks.js`) **[VERIFY]**;
  - time to first relevant tap, using the valid-first-step lists in section 2;
  - scroll-pasts (the target card was fully visible, then left the viewport without being opened) **[VERIFY]** the visibility threshold.
- **Export:** download a JSON file (and optionally CSV) per participant from the moderator screen, using a Blob and an object URL. Keep logs in memory and optionally in `localStorage`, wrapped in try/catch, so a refresh does not lose a session.

### Gaze vs behaviour
This app does **not** measure gaze or attention. Taps, scrolls, visibility events and timings are **behavioural proxies**. Never name a variable, column, chart or UI label "gaze", "fixation" or "attention" as if it were measured directly. Use names like `firstRelevantTapMs`, `scrollPastCount` and `deadTapCount`.

---

## 6. Experimental integrity (non-negotiable)

1. A and B share every screen, component, data file, state, navigation rule, transition and logging hook. The only switch is the theme. **Exception (owner, 22 Nov 2026):** Theme A has no category chips, Home category tiles or section headings, and shows a mixed item order (section 3, "React Prototype A redesign"). Do not add any further A-only differences without the owner's approval.
2. Do not change menu data, prices, ratings, descriptions, diet tags, item order, section order, copy text or task answers. (Theme A's display order comes from `src/data/layoutA.js`; `src/data/menu.js` stays frozen.)
3. Do not add features in only one condition. Do not add features in both without the owner's approval: search, remove buttons, quantity, sorting, recommendations, extra badges, animations, sounds or haptics would all change the experiment.
4. Do not add informative badges or promotions. A's decorations carry no information and are not tappable.
5. Do not use motion in A only. Decorations are static. Transitions are identical in both.
6. Keep the primary action colour #C8451C in both themes.
7. Keep task items' scroll distances similar between themes. After building the A layout, measure the four task cards' positions on all three Menu states and compare with B. Report the differences; Figma achieved within ±10 px. **Changed (owner, 22 Nov 2026):** the React A no longer holds ±10 px; measure and report instead (latest values in section 3, "React Prototype A redesign").
8. The Ready screen is identical in both themes.
9. Behaviour measured by the app is a proxy, not gaze (section 5).
10. Preserve the methodology: neutral names, counterbalancing table, task order T1→T2→T3, empty cart and Home at every task start, time caps, success rules.
11. Before calling a feature done, check it in **both** themes with the same steps, and say so in the report.

Suggested parity check before any study use:
- render both themes;
- confirm the same set of interactive elements on every screen (same count and roles), except that A has no category chips or Home category tiles (owner decision, 22 Nov 2026);
- confirm identical text content apart from A's decorative promo text;
- run both task sets in both themes from a fresh state and confirm the Rs. 1,360 and Rs. 1,480 totals.

---

## 7. Development workflow

- The project is a standard Vite React JavaScript starter. Leave the existing config files alone unless a change is needed and explained.
- Claude Code CLI writes the code. The owner uses ChatGPT for explanations, so keep explanations concrete.
- Work in small steps. Propose first, implement after approval, then report.
- Before installing a package: name it, explain why, give the no-dependency alternative, and wait for approval.
- No git commits, pushes, branch changes or history rewrites without explicit permission.
- Do not delete or move existing files unless agreed.
- Do not touch the Figma file or project documents.
- Run `npm run dev` and `npm run build` to check work. Report errors exactly, not summarised away.
- When unsure about methodology or data, stop and ask. Do not guess.

---

## 8. Current project status (updated 22 Nov 2026)

### Completed in Figma
- Prototype B (low complexity), corrected and approved.
- Prototype A (high complexity), built in six screen groups (Home; three Menus; 20 item screens; Cart, Checkout and Order confirmed; four panels; Ready), each approved.
- Separate A variable collections, A components and A flow.
- A / Ready made identical to B (background fixed at #FAF8F5).

### Validated (Stage 7 final audit, read-only, all PASS)
- 32 frames each.
- 642 text layers and 1,951 layers' visibility identical between A and B (A has extra decorative text only).
- Identical item order.
- 72 interactive layers and 118 + 24 actions in each, with identical settings after name mapping.
- No cross-prototype destinations or variable references.
- B and the shared Components page unchanged.
- Accessibility floors met in both.
- Both task flows played from a fresh load through Order confirmed in A and B: Set 1 Rs. 1,360 and Set 2 Rs. 1,480, including both item orders in A.

Known Figma limitations recorded in the audit:
- Scroll offsets are not readable by script (checked in playback).
- Restart may not reset variables (reload instead).
- Mixing items from both sets gives partial counts.
- Some decoration layers are named "… badge" but carry no information.

### Implemented in React (found in the code, 22 Nov 2026)
The earlier "nothing implemented" note was out of date. The repo already contains:
- data files (`src/data/menu.js`, `tasks.js`, `rules.js`, `conditions.js`, `relevantTaps.js`);
- all screens (Ready, Wait, Home, Menu, ItemDetail, Cart, Checkout, OrderConfirmed) and shared components;
- both themes (`src/theme/theme-b.css`, `theme-a.css`), cart, navigation, session state;
- moderator setup (`src/moderator/Setup.jsx`), event logging (`src/logging/logger.js`) and JSON export;
- self-hosted Plus Jakarta Sans (`public/fonts/`).

### Done and verified on 22 Nov 2026 (Chromium at 390 × 844, dev build)
- Theme A redesigned as a deliberately poor design (section 3, "React Prototype A redesign").
- `npm run lint` and `npm run build`: pass.
- All 20 items open, add to cart and total identically in A and B (filters show 20 / 13 / 13 cards in both).
- Moderator session (P99, condition C1) with export: A Set 1 T1 success, T2 wrong item recorded as a failure, T3 Rs. 1,360; B Set 2 T3 Rs. 1,480. All event types present in the JSON.
- Theme B unchanged: layout, colour, font and text fingerprints of 13 B screen states identical before and after the redesign; A's Ready screen identical to B's.
- **Not yet tested:** the study iPhone in Safari.

### Not yet built or decided anywhere
- Practice prototype.
- Per-task starting points.
- The written "on path" rule, shortest-path definitions and scroll-past threshold (the A redesign changes A's shortest paths, so these now need A and B versions).
- Updating the Methodology Plan, report limitations and `reference/step-5b-theme-a-measurements.md` (Figma-era) for the A redesign.
- New deadline and testing dates (the original deadline was 19 Nov 2026) **[VERIFY]**.
- The pilot.

### Suggested next steps (propose each before doing it)
1. **Done.** The owner has confirmed: all 20 items interactive (section 3); diet filter behaviour, replicated exactly (section 3); cart row order, menu order (section 5); device and browser, one iPhone / Safari / portrait / 390 × 844 (section 5); logging as supplementary to screen recording (section 2).
2. **Done.** Added `src/data/menu.js`, `tasks.js` and `rules.js` from section 4, with a small check that counts and totals match (14 meals, 6 drinks, Rs. 1,360, Rs. 1,480) — validated in Step 1.
3. **Implemented** (found in code): theme B screens, shared components, screen-stack navigator.
4. **Implemented** (found in code): cart reducer and added-to-cart panel; both task sets verified 22 Nov 2026.
5. **Implemented, then redesigned 22 Nov 2026**: theme A (section 3, "React Prototype A redesign").
6. **Implemented** (found in code): moderator setup, Ready → Start → t0, time caps, event logging, JSON export. Export verified 22 Nov 2026; time caps not re-tested.
7. Run a parity check across both themes and a full dry run on the study phone.
8. Pilot with 1–2 non-counted participants before real sessions.

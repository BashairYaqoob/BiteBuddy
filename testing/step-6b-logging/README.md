# Step 6, Phase 6b: supplementary event logging, measures and JSON export

Implemented and tested 22 Nov 2026. Follows the owner's 10 decisions and data-integrity rules (21 Nov 2026).

The log is supplementary: the screen recording stays the primary record. Every measure is a behavioural proxy; nothing measures gaze or attention.

## Files

| File | Change |
|---|---|
| `src/logging/logger.js` | **New.** Document-level listeners: taps (≤ 10 px movement, timed at pointer down, interactive/dead, relevant), filter, chip_scroll, tile_scroll, view_cart, checkout, place_order, scroll samples, card visibility (IntersectionObserver, "any" and "full") |
| `src/data/relevantTaps.js` | **New.** Valid-first-step lists from CLAUDE.md section 2 plus decision 5, written out as item IDs |
| `src/state/sessionStore.js` | Event log (`seq`, `attemptId`, `ms`, `afterEnd`, `screen`, `type`, `data`), measures, JSON export, `task_end` / `attempt_closed` / `counted_changed` events, batched saving with a write on page hide, the two-tab safeguard |
| `src/state/NavContext.jsx` | Logs `navigate`, `back` and `open_item`. The stack is mirrored in a ref so each call is logged once; behaviour unchanged |
| `src/state/CartContext.jsx` | Logs `add_to_cart`, `panel_open` and `panel_close`; behaviour unchanged |
| `src/screens/ItemDetail.jsx` | Calls the cart add before the task-end check, so the add that ends T1/T2 isn't marked `afterEnd` |
| `src/moderator/Setup.jsx` | Export button (`P01-session.json`) and the other-tab warning |

**Unchanged:**
- all A/B styling and the shared components;
- task definitions, menu data, conditions;
- Figma and the research documents.

No dependencies were added and no Git operations were run.

## Measures (computed at task end and again at export)

- **Window:** events with `0 ≤ ms ≤ end time` and `afterEnd: false`. The end time is `timeMs` (completed or timed out), or the last logged event (abandoned or interrupted).
- **`firstRelevantTapMs` and `firstRelevantTapStatus`:**
  - `observed`: a relevant tap happened; the value is its time.
  - `censored_time_limit`: no relevant tap before the limit; the value is the limit and `firstRelevantTapCensored` is true.
  - `none_before_end`: the task ended without a relevant tap; the value is null.
  - `not_applicable`: the attempt was abandoned or interrupted.
- **`tapCount`, `deadTapCount`, `backCount`.**
- **Not computed** (rules not decided): wrong turns, taps against the shortest path, scroll-pasts. The raw events are in the export.

## Results

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed |
| Phase 6b checks (`data/phase-6b-checks.json`), real pointer and touch input, real 120 s limit | **44 / 44** |
| Phase 6a suite re-run on the 6b code (real 120 s and 180 s limits, deadline race) | 39 / 39. One expectation was updated: an interrupted attempt now keeps its last logged event time instead of 0 |
| Two tabs on one device | The newer tab wins; the older one warns and stops saving; storage isn't overwritten |
| Regression (27 checks), both themes, 390 × 844 and 390 × 664 | 27 / 27, no console errors, no network requests outside the dev server |
| Screens vs the final parity audit | 50 / 52 pixel-identical. The 2 differences are the known gradient noise (Theme A, 664, M10 and panel). An intermittent 36-pixel, 1-level Home difference didn't repeat in two fresh captures |
| Session-mode screens (logging on) vs regression screens | Pixel-identical (Home, Menu) |
| A/B parity / heading landing | Text and buttons identical, width 390, no decoration over a control, no animation / 20 / 20 in all four runs |
| The same scripted T1 path in A and B | Identical non-scroll event sequences and identical measures (times aside) |
| Production build | Opens on setup; taps, navigation, filter and visibility events are logged |

**What the 44 checks cover:**
- the Start tap logged with a negative `ms`;
- a touch swipe is not a tap and opens nothing; an 8 px movement is a tap;
- relevant and irrelevant classification;
- filter `from`/`to`; chip and tile scroll; `open_item`; `back`;
- the ending `add_to_cart` and `panel_open` are not `afterEnd`, and `task_end` follows them;
- events after the end are `afterEnd`;
- scroll samples are at least 100 ms apart, plus final samples;
- visibility enter/exit at both levels, including removal on a filter change;
- all four `firstRelevantTapStatus` outcomes;
- abandoned and interrupted attempts keep their events across a reload;
- `counted_changed`;
- the real file download, with its fields checked;
- no "gaze", "attention" or "fixation" field names.

## Findings for the owner

1. **Back from an item resets the Menu filter.** This predates Phase 6, is identical in A and B, and was found by the log. Open an item from Menu – Vegetarian and press Back: the app shows Menu – All, scrolled to the top. The diet filter is local Menu state and isn't kept when the item screen opens. In Figma, Back returns to the previous frame (Menu – Vegetarian). Not fixed: it changes an interaction, so it needs an owner decision.
2. **T1 "a category tab"** is read literally, so every category counts as relevant, including Drinks.
3. **Visibility** is measured within the scroll area. Cards under the added-to-cart panel still count as visible.
4. **An attempt abandoned on the Ready screen** (before Start) has no t0, so its events keep `ms: null`.
5. **Additions beyond the plan, both for data integrity:**
   - the two-tab safeguard;
   - a save when the page is hidden or closed, so batched events aren't lost.
6. **Not tested:** the study iPhone in Safari (real touch, the download behaviour of the export, `localStorage` limits).

## Files in this folder

- `data/phase-6b-checks.json`: all 44 check results.
- `data/example-export-P80-session.json`: a real export from the test run (6 attempts, 489 events).
- `data/example-events-one-attempt.json`: every event of one T1 attempt.
- `data/phase-6b-test-script.mjs`, `data/two-tab-check.mjs`: the test scripts.

# Step 6, Phase 6a: session setup, Ready → Start → t0, task ends, time limits

Implemented and tested 21–22 Nov 2026. Phase 6b (event logging, JSON export) has **not** started.

The in-app record is supplementary. The screen recording stays the primary capture method.

## Files

| File | Change |
|---|---|
| `src/data/conditions.js` | **New.** The C1–C4 table, copied exactly from CLAUDE.md section 2 |
| `src/state/sessionStore.js` | **New.** Participant, attempts, t0, end events, time limits, counted attempts, `localStorage`, the 3 s moderator hold, tap timing |
| `src/state/SessionContext.jsx` | **New.** The `useSession()` hook |
| `src/moderator/Setup.jsx`, `Setup.css` | **New.** The moderator setup screen (plain styling, separate from both prototypes) |
| `src/screens/Wait.jsx` | **New.** "Please wait for the moderator." (reuses the Ready styling; no control) |
| `src/state/ThemeContext.jsx` | The theme now comes from the session. The dev link moved to the store |
| `src/App.jsx` | Shows setup or a task attempt. Each attempt remounts the frame (Ready, empty cart) |
| `src/screens/Ready.jsx` | The Start handler records the tap time. No visual change |
| `src/screens/Home.jsx` | Records t0 from the first frame that draws Home. No visual change |
| `src/screens/ItemDetail.jsx` | The Add to cart handler records the T1/T2 end. No visual change |
| `src/screens/OrderConfirmed.jsx` | Records the T3 end from its first frame. No visual change |

**Unchanged:**
- `tasks.js`, `menu.js`, `rules.js`;
- all theme CSS and every other component;
- the cart and navigation logic;
- Figma, CLAUDE.md and the research documents.

No dependencies were added and no Git operations were run.

## How it works

- **Start-up:** the app opens on moderator setup. In development only, `?theme=A` or `?theme=B` skips setup (for regression scripts); production builds ignore it.
- **Times:**
  - `startTapMs` is the pointerdown of the Start tap, so the time is taken at the touch, not on release or after React renders.
  - `t0` is the timestamp of the first animation frame after Home is placed in the page. It is set once per attempt.
  - All times are in ms from t0, on the browser's high-resolution clock.
- **Task ends:**
  - **T1/T2:** the first Add to cart ends the task, timed at its pointerdown. A wrong item gives `success: false` and `decisionError: true`. Later adds don't change the result.
  - **T3:** ends on the first frame of Order confirmed. `success` is true only if the order is exactly the named meal and drink.
- **Time limits:**
  - The result is `time_limit`, `censored: true`, `timeMs` exactly 120000 or 180000, and `timerFiredMs` is kept as a diagnostic. The wait screen is then shown.
  - If a press is in progress at the deadline, the decision waits for its release. A press that started at or before the deadline completes the task, flagged `raceResolved`.
- **Abandoned and interrupted:**
  - **Abandoned:** you leave a running attempt with the 3 s hold.
  - **Interrupted:** an attempt was still open when the page reloaded. It is closed on the next load, and the app reopens on setup without resuming the timer. The next run gets a new attempt ID.
- **Counted attempts:** one per block and task. By default it's the latest completed or timed-out attempt. Your overrides ("Count this one", "None counted", "Back to default") are saved with a history entry each.
- **Saving:** `localStorage` key `bitebuddy-study-v1` is written immediately on every change in Phase 6a, which covers the Start tap, t0, task ends and moderator actions.

## Results

| Check | Result |
|---|---|
| `npm run lint` / `npm run build` | Passed / passed (final code) |
| Phase 6a checks (`data/phase-6a-checks.json`), real pointer input, real 120 s and 180 s waits | **39 / 39** |
| T3 totals | Set 1 Rs. 1,360 and Set 2 Rs. 1,480, each in both themes |
| Ready, A vs B / wait screen, A vs B | Pixel-identical / pixel-identical |
| Regression (27 checks), both themes, 390 × 844 and 390 × 664 | 27 / 27 in all four runs; no console errors; no network requests outside the dev server |
| Screens unchanged vs the final parity audit | 50 / 52 pixel-identical. Theme A at 664, item M10 and panel: colour differences of at most 1 level (out of 255) inside the gradient image tile only, consistent across reruns. No A/B styling was changed |

## Investigation of the two differing screenshots (22 Nov 2026)

**Affected:** Theme A, 390 × 664, item M10 and the added-to-cart panel.

**What changed:**
- Item M10: 29,594 pixels; the panel: 18,099 pixels.
- Every changed pixel differs by exactly **1 colour level out of 255**, the smallest possible change.
- All of them lie inside one rectangle: CSS x 26–364, y 74–290. That is Theme A's large item image tile, whose fill is a gradient (a 22 % tint of the category colour). On the panel screenshot the same tile is under the dimmed backdrop.
- Nothing else on either screen changed.

**Controlled test:**
1. I built a scratch copy of the app with every Phase 6 edit reversed (the pre-Phase-6 code).
2. I captured it and the current code in the same browser session.

**Results:**

| Comparison | Result |
|---|---|
| Pre-Phase-6 code, captured today, vs the final audit | The same 2 screenshots differ, with identical pixel counts, the same rectangle and a 1-level maximum |
| Phase 6 code vs pre-Phase-6 code, same session | **13 / 13 pixel-identical** |

**Conclusion:**
- This is **not caused by Phase 6**; it's the test environment.
- The Chrome version is the same as during the audit (158.0.8127.36, installed 20 Nov), so the difference is in how that browser session draws the gradient. The exact reason it shows only at 664 can't be determined from screenshots.
- No visual regression, so nothing was fixed or changed.
- The scratch copy was deleted afterwards.

## Further confirmations (22 Nov 2026)

| Check | Result |
|---|---|
| No participant-visible prototype letters | Passed. 20 participant screens across both themes (Ready, Home, three Menu states, item, panel, Cart, Checkout, Order confirmed). Checked: visible text, aria-labels, alt, title and placeholder attributes, the page title ("bitebuddy") and the URL. The setup screen was also checked |
| Refresh survival | Passed. After a reload: the participant record, every ended attempt (byte-for-byte) and the counted overrides and history are all intact. Only the open attempt became `interrupted`, keeping its saved fields. Setup is shown, the timer is not resumed, and the re-run gets a new ID (a2) |
| Production build | `npm run build` then `vite preview`: `/`, `/?theme=A` and `/?theme=B` all open "Moderator setup". The dev shortcut isn't in the production bundle |
| No Phase 6b code | No IntersectionObserver, scroll logging, event logger, export, `afterEnd`, `data-log-id` or relevant-tap measures in `src/`. `measures` is `null` |
| A/B parity (12 screens, 844 and 664) | Text identical, buttons identical, width 390, no decoration over a control, no animation |
| Heading landing | 20 / 20 in both themes, both heights |

## Not verified

- **The study iPhone in Safari** (touch timing, the 3 s hold, `localStorage`).
- **After a reload the setup screen asks for the participant code again.** The stored record reopens when you enter the same code and condition.
- **Testing caveat:** the first regression run used a Chrome flag (`--disable-gpu`) that changes text anti-aliasing. With the original flags, the result was the one above.

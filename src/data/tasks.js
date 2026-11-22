// Source: CLAUDE.md section 4 ("Task sets") and section 2 (time caps, end events).
// Exact wording, correct answers and time caps. Do not change any value here.
//
// Not included here (deferred to the logging step, per CLAUDE.md section 5):
// - valid-first-step lists (needed for "time to first relevant tap")
// - shortest-path definitions (needed for "taps vs shortest path")
// - the written "on path" rule (needed for "wrong turn" detection)
// These are explicitly marked [VERIFY] / not yet decided in CLAUDE.md and are not
// required for Step 1 (menu data, task wording/answers, fixed app configuration).

export const TASK_SETS = {
  set1: {
    T1: {
      id: 'T1',
      wording: 'Find the cheapest vegetarian meal under Rs. 700 and add it to your cart.',
      correctItemIds: ['M13'],
      correctItemNames: ['Chana Pulao Bowl'],
      expectedPrice: 630,
      timeCapSeconds: 120,
      endEvent: 'add_to_cart',
    },
    T2: {
      id: 'T2',
      wording: 'Find a chicken burger rated above 4.5 and add it to your cart.',
      correctItemIds: ['M02'],
      correctItemNames: ['Grilled Chicken Burger'],
      expectedPrice: 790,
      timeCapSeconds: 120,
      endEvent: 'add_to_cart',
    },
    T3: {
      id: 'T3',
      wording: 'Add Veggie Supreme Pizza and Mango Lassi to your cart and place the order.',
      correctItemIds: ['M10', 'D01'],
      correctItemNames: ['Veggie Supreme Pizza', 'Mango Lassi'],
      expectedSubtotal: 1210,
      expectedTotal: 1360,
      timeCapSeconds: 180,
      endEvent: 'order_confirmed',
    },
  },
  set2: {
    T1: {
      id: 'T1',
      wording: 'Find the cheapest non-vegetarian meal under Rs. 900 and add it to your cart.',
      correctItemIds: ['M07'],
      correctItemNames: ['Spicy Chicken Wrap'],
      expectedPrice: 610,
      timeCapSeconds: 120,
      endEvent: 'add_to_cart',
    },
    T2: {
      id: 'T2',
      wording: 'Find a chicken wrap rated above 4.5 and add it to your cart.',
      correctItemIds: ['M06'],
      correctItemNames: ['Chicken Tikka Wrap'],
      expectedPrice: 640,
      timeCapSeconds: 120,
      endEvent: 'add_to_cart',
    },
    T3: {
      id: 'T3',
      wording: 'Add Chicken Fajita Pizza and Mint Lemonade to your cart and place the order.',
      correctItemIds: ['M11', 'D03'],
      correctItemNames: ['Chicken Fajita Pizza', 'Mint Lemonade'],
      expectedSubtotal: 1330,
      expectedTotal: 1480,
      timeCapSeconds: 180,
      endEvent: 'order_confirmed',
    },
  },
}

export const TASK_ORDER = ['T1', 'T2', 'T3']

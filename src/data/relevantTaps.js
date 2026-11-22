// Source: CLAUDE.md section 2 / Methodology Plan, "Relevant tap (valid-first-step
// list, fixed for both prototypes)". Owner decision 5 (21 Nov 2026): a
// "category" tap is a Home category tile OR a Menu category chip. Home featured
// cards are not interactive (dead taps); the bottom Menu tab is not a category.
// Owner decision (22 Nov 2026): for T1 every category counts, Drinks included.
// Do not change any value here once the pilot starts.
//
// T1: the matching diet filter, a category tab, or a meal card of the named diet.
// T2: the Burgers (Set 1) or Wraps (Set 2) category, or a chicken burger / chicken wrap card.
// T3: the Pizza category, or the named pizza card.
//
// Item ids follow the frozen menu (src/data/menu.js):
// vegetarian meals M04 M08 M09 M10 M12 M13 M14; non-vegetarian meals M01 M02 M03 M05 M06 M07 M11;
// chicken burgers M01 M02 M03; chicken wraps M05 M06 M07.

const ALL_CATEGORIES = ['Burgers', 'Wraps', 'Pizza', 'Rice Bowls', 'Drinks']

export const RELEVANT_TAPS = {
  set1: {
    T1: { filters: ['veg'], categories: ALL_CATEGORIES, cards: ['M04', 'M08', 'M09', 'M10', 'M12', 'M13', 'M14'] },
    T2: { filters: [], categories: ['Burgers'], cards: ['M01', 'M02', 'M03'] },
    T3: { filters: [], categories: ['Pizza'], cards: ['M10'] },
  },
  set2: {
    T1: { filters: ['nonveg'], categories: ALL_CATEGORIES, cards: ['M01', 'M02', 'M03', 'M05', 'M06', 'M07', 'M11'] },
    T2: { filters: [], categories: ['Wraps'], cards: ['M05', 'M06', 'M07'] },
    T3: { filters: [], categories: ['Pizza'], cards: ['M11'] },
  },
}

// target: { kind: 'filter' | 'category_chip' | 'category_tile' | 'card' | ..., filter, category, itemId }
export function isRelevantTap(set, task, target) {
  const rule = RELEVANT_TAPS[set] && RELEVANT_TAPS[set][task]
  if (!rule || !target) return false
  if (target.kind === 'filter') return rule.filters.includes(target.filter)
  if (target.kind === 'category_chip' || target.kind === 'category_tile') return rule.categories.includes(target.category)
  if (target.kind === 'card') return rule.cards.includes(target.itemId)
  return false
}

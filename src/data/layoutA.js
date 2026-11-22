// Prototype A presentation order (owner decision, 22 Nov 2026): Theme A shows
// the menu as one mixed list with no categories, section headings or category
// chips. Prototype B keeps the frozen menu-sheet order from src/data/menu.js.
//
// This file changes ORDER ONLY in Theme A. Names, prices, ratings, diet tags
// and descriptions still come from src/data/menu.js and are not changed.
// The order is fixed (identical for every participant), never random.
//
// How it was chosen: categories are interleaved so no two neighbours share a
// category more than once, and each Set 1 / Set 2 target pair sits at a
// similar depth so neither task set is favoured by position:
//   T1  M13 (Set 1) #5   / M07 (Set 2) #9
//   T2  M02 (Set 1) #7   / M06 (Set 2) #6
//   T3  M10 (Set 1) #10  / M11 (Set 2) #12
//   T3  D01 (Set 1) #15  / D03 (Set 2) #17
// Do not change once the pilot starts.
export const A_MENU_ORDER = [
  'D04', 'D02', 'M12', 'M01', 'M13',
  'M06', 'M02', 'M09', 'M07', 'M10',
  'D06', 'M11', 'M05', 'M14', 'D01',
  'M03', 'D03', 'M08', 'D05', 'M04',
]

// Non-interactive look-alike "buttons" and "chips" (owner decision, 22 Nov
// 2026). Neutral words only: no item, price, rating, diet, category or offer.
// Rendered by Promo type="fake"; taps on them are logged as dead taps.
export const A_FAKE_WORDS = ['Yum!', 'Wow!', 'Ooh!', 'Hello!', 'Munch munch', 'Hey there', 'Nom nom', 'Hi!']

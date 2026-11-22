import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, MENU_ITEMS } from '../data/menu'
import FoodCard from '../components/FoodCard'
import Chip from '../components/Chip'
import NavBar from '../components/NavBar'
import TopBar from '../components/TopBar'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { useNav } from '../state/NavContext'
import './Menu.css'

// Prototype A decorations (Decor renders nothing in Theme B), from the saved
// Figma A layout data, per filter state. List-level positions are Figma
// scroll y − 158 (the fixed header). Rotated confetti (clockwise, centred in
// the Figma bounding box): "Confetti 1" 10° is measured; "Confetti 2" 12° is an
// owner-approved INFERENCE (never visible in the export).
// See reference/step-5b-theme-a-measurements.md.
const C1 = [10, [67.1953, 34.7489]]
const C2 = [12, [67.5913, 36.7819]]
const A_LIST_DECOR = {
  all: [['blob', 330, 32], ['confetti', 300, 788.8, ...C1], ['blob', -30, 1262.2], ['dots', 344, 1735.6], ['blob', 330, 2366.8], ['confetti', 6, 2918, ...C2]],
  veg: [['blob', 330, 32], ['confetti', 300, 528.4, ...C1], ['blob', -30, 871.6], ['dots', 344, 1214.8], ['blob', 330, 1672.4], ['confetti', 6, 2050, ...C2]],
  nonveg: [['blob', 330, 32], ['confetti', 300, 538, ...C1], ['blob', -30, 886], ['dots', 344, 1234], ['blob', 330, 1698], ['confetti', 6, 2082, ...C2]],
}
// Beside each section heading (section-relative).
const A_HEADING_DECOR = {
  Burgers: ['stripes', 306, 10],
  Wraps: ['sticker', 334, 10],
  Pizza: ['stripes', 306, 10],
  'Rice Bowls': ['sticker', 334, 10],
  Drinks: ['stripes', 306, 10],
}
// In the extra space below some sections (section-relative top y).
const A_GAP_DECOR_Y = {
  all: { Wraps: 540, 'Rice Bowls': 428 },
  veg: { 'Rice Bowls': 424 },
  nonveg: { Wraps: 398, 'Rice Bowls': 72 },
}

// Approved asymmetry, replicated exactly (CLAUDE.md section 3):
// all->veg->veg, all->nonveg->nonveg, veg->veg(again)->all, veg->nonveg->all,
// nonveg->nonveg(again)->all, nonveg->veg->veg.
function nextDietFilter(current, tapped) {
  if (tapped === current) return 'all'
  if (tapped === 'nonveg' && current === 'veg') return 'all'
  return tapped
}

function isVisible(item, filter) {
  if (item.type === 'Drink') return true // drinks have no diet tag, always shown
  if (filter === 'veg') return item.dietTag === 'Vegetarian'
  if (filter === 'nonveg') return item.dietTag === 'Non-vegetarian'
  return true
}

export default function Menu({ filter: initialFilter = 'all', scrollTo }) {
  const { push, setCurrentParams } = useNav()
  const [filter, setFilter] = useState(initialFilter)

  // The filter is also saved in this Menu's navigation entry, so Back from an
  // item opened here returns to the same filter (Figma: Back → previous frame).
  const chooseFilter = (tapped) => {
    const next = nextDietFilter(filter, tapped)
    setFilter(next)
    setCurrentParams({ filter: next })
  }
  const sectionRefs = useRef({})

  useEffect(() => {
    if (scrollTo && sectionRefs.current[scrollTo]) {
      sectionRefs.current[scrollTo].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [scrollTo])

  const scrollToCategory = (category) => {
    sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="screen menu-screen" data-filter={filter}>
      {/* Figma Prototype B (Step 4.5c): fixed header = title bar ("Menu", no
          Back) + diet filters. The category chips scroll with the list. */}
      <header className="menu-screen__header">
        <TopBar title="Menu" showBack={false} />
        <div className="menu-screen__diet-filters">
          <Chip
            label="Vegetarian"
            selected={filter === 'veg'}
            onClick={() => chooseFilter('veg')}
          />
          <Chip
            label="Non-vegetarian"
            selected={filter === 'nonveg'}
            onClick={() => chooseFilter('nonveg')}
          />
        </div>
      </header>

      <div className="screen__scroll menu-screen__content">
        {A_LIST_DECOR[filter].map(([type, x, y, rotate, box]) => (
          <Decor key={`${type}-${y}`} type={type} x={x} y={y} rotate={rotate} box={box} />
        ))}
        <Promo type="ticker" />
        <div className="menu-screen__category-chips">
          {CATEGORIES.map((category) => (
            <Chip key={category} label={category} selected={false} onClick={() => scrollToCategory(category)} />
          ))}
        </div>
        <Promo type="strip" />
        {CATEGORIES.map((category) => {
          const items = MENU_ITEMS.filter((item) => item.category === category && isVisible(item, filter))
          const [accentType, accentX, accentY] = A_HEADING_DECOR[category]
          const gapY = A_GAP_DECOR_Y[filter][category]

          return (
            <section
              key={category}
              className="menu-screen__section"
              data-category={category}
              ref={(el) => {
                sectionRefs.current[category] = el
              }}
            >
              <Decor type={accentType} x={accentX} y={accentY} />
              {gapY !== undefined && (
                <>
                  <Decor type="dots" x={310} y={gapY} />
                  <Decor type="stripes" x={8} y={gapY + 14} />
                  <Decor type="confetti" x={147} y={gapY + 8} />
                </>
              )}
              <h2 className="menu-screen__section-title">{category}</h2>
              {items.length === 0 ? (
                <p className="menu-screen__empty">No non-vegetarian items in this category.</p>
              ) : (
                <div className="menu-screen__cards">
                  {items.map((item) => (
                    <FoodCard key={item.id} item={item} onSelect={(itemId) => push('ItemDetail', { itemId })} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <NavBar active="Menu" />
    </div>
  )
}

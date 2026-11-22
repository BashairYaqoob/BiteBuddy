import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, MENU_ITEMS } from '../data/menu'
import FoodCard from '../components/FoodCard'
import Chip from '../components/Chip'
import NavBar from '../components/NavBar'
import TopBar from '../components/TopBar'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { useNav } from '../state/NavContext'
import { useTheme } from '../state/ThemeContext'
import { A_MENU_ORDER, A_FAKE_WORDS } from '../data/layoutA'
import './Menu.css'

// Prototype A (owner decision, 22 Nov 2026): one mixed list, no category
// chips, no section headings, no empty-category message. Same cards, same
// filters, same handlers as B; only the order and the look differ.
const A_ITEMS = A_MENU_ORDER.map((id) => MENU_ITEMS.find((item) => item.id === id))

// Scattered decorations behind the A list (absolute, list-relative px).
// Decor is aria-hidden, pointer-events: none and static.
const A_LIST_DECOR = [
  ['blob', 320, 40], ['confetti', 10, 150], ['dots', 340, 300], ['stripes', 6, 460],
  ['sticker', 360, 610], ['blob', -30, 760], ['confetti', 300, 900], ['dots', 2, 1060],
  ['stripes', 330, 1210], ['blob', 330, 1380], ['confetti', 20, 1520], ['sticker', 8, 1690],
  ['dots', 344, 1840], ['blob', -28, 2000], ['stripes', 320, 2150], ['confetti', 290, 2320],
  ['sticker', 360, 2480], ['dots', 4, 2630], ['blob', 330, 2790], ['confetti', 10, 2950],
  ['stripes', 6, 3100], ['dots', 340, 3260], ['blob', -30, 3420], ['sticker', 360, 3580],
]

// What appears after the card at each position in the visible A list: look-
// alike fake buttons/chips, promo strips and ticker bands (all non-interactive,
// general wording). Keyed by position so the pattern is fixed for everyone.
function aFillerAfter(index) {
  if (index % 4 === 1) return <Promo key={`fake-${index}`} type="fake" word={A_FAKE_WORDS[index % A_FAKE_WORDS.length]} variant={index % 3} />
  if (index % 6 === 3) return <Promo key={`strip-${index}`} type="strip" />
  if (index % 7 === 5) return <Promo key={`ticker-${index}`} type="ticker" />
  return null
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
  const isA = useTheme() === 'A'
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

      {isA ? (
        <div className="screen__scroll menu-screen__content menu-screen__a-list">
          {A_LIST_DECOR.map(([type, x, y]) => (
            <Decor key={`${type}-${y}`} type={type} x={x} y={y} />
          ))}
          <Promo type="ticker" />
          <Promo type="fake" word="Hey there" variant={2} />
          {A_ITEMS.filter((item) => isVisible(item, filter)).flatMap((item, index) => [
            <FoodCard key={item.id} item={item} onSelect={(itemId) => push('ItemDetail', { itemId })} />,
            aFillerAfter(index),
          ])}
          <Promo type="strip" />
        </div>
      ) : (
      <div className="screen__scroll menu-screen__content">
        <div className="menu-screen__category-chips">
          {CATEGORIES.map((category) => (
            <Chip key={category} label={category} selected={false} onClick={() => scrollToCategory(category)} />
          ))}
        </div>
        {CATEGORIES.map((category) => {
          const items = MENU_ITEMS.filter((item) => item.category === category && isVisible(item, filter))

          return (
            <section
              key={category}
              className="menu-screen__section"
              data-category={category}
              ref={(el) => {
                sectionRefs.current[category] = el
              }}
            >
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
      )}

      <NavBar active="Menu" />
    </div>
  )
}

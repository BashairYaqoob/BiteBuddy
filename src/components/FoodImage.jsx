import burgerGlyph from '../assets/b/glyph-burger.svg'
import wrapGlyph from '../assets/b/glyph-wrap.svg'
import pizzaGlyph from '../assets/b/glyph-pizza.svg'
import bowlGlyph from '../assets/b/glyph-bowl.svg'
import drinkGlyph from '../assets/b/glyph-drink.svg'
import aBurgerTile from '../assets/a/foodimage-burger.svg'
import aWrapTile from '../assets/a/foodimage-wrap.svg'
import aPizzaTile from '../assets/a/foodimage-pizza.svg'
import aBowlTile from '../assets/a/foodimage-bowl.svg'
import aDrinkTile from '../assets/a/foodimage-drink.svg'
import { useTheme } from '../state/ThemeContext'
import './FoodImage.css'

// No photos in either prototype (CLAUDE.md section 3): a placeholder tile with
// the category glyph extracted from Figma Prototype B (src/assets/b). The glyph
// is a 44 × 44 box on every tile size (card 96 × 96, Home tile 106 × 80, item
// screen 342 × 220), per reference/step-4.5b-measurements.md. Decorative only.
const GLYPHS = {
  Burgers: burgerGlyph,
  Wraps: wrapGlyph,
  Pizza: pizzaGlyph,
  'Rice Bowls': bowlGlyph,
  Drinks: drinkGlyph,
}

// Prototype A tiles (Figma "A / FoodImage": the same glyph on a multi-colour
// tile with corner dots). Used for the card (96 × 96) and the Home category
// tile (stretched to 106 × 80, as in Figma's A / CategoryTile).
const A_TILES = {
  Burgers: aBurgerTile,
  Wraps: aWrapTile,
  Pizza: aPizzaTile,
  'Rice Bowls': aBowlTile,
  Drinks: aDrinkTile,
}

// Prototype A large item tile (Figma "A / FoodImage – Detail", measured from
// reference/BiteBuddy-Figma-Reference-A.png; see
// reference/step-5b-theme-a-measurements.md): category colour at 22% over
// white, 2 px border in that colour, radius 20, four corner dots, B's glyph.
const A_DETAIL_COLOUR = {
  Burgers: 'mustard',
  Wraps: 'teal',
  Pizza: 'pink',
  'Rice Bowls': 'violet',
  Drinks: 'mustard',
}
// Corner dots: [centre x, centre y, radius, colour] in tile coordinates
// (from the outer edge; the CSS subtracts the 2 px border).
const A_DETAIL_DOTS = [
  [19, 19, 5, 'pink'],
  [318, 22, 4, 'teal'],
  [21.5, 197.5, 3.5, 'violet'],
  [320.5, 196.5, 4.5, 'mustard'],
]

export default function FoodImage({ category, size = 'card' }) {
  const theme = useTheme()
  if (theme === 'A' && size === 'detail' && A_DETAIL_COLOUR[category]) {
    return (
      <div className={`food-image food-image--detail food-image--a-detail food-image--a-${A_DETAIL_COLOUR[category]}`} aria-hidden="true">
        {A_DETAIL_DOTS.map(([cx, cy, r, c]) => (
          <span
            key={c}
            className={`food-image__dot decor__fill--${c}`}
            style={{ left: cx - r - 2, top: cy - r - 2, width: r * 2, height: r * 2 }}
          />
        ))}
        <img className="food-image__glyph" src={GLYPHS[category]} width="44" height="44" alt="" />
      </div>
    )
  }
  const aTile = theme === 'A' && size !== 'detail' ? A_TILES[category] : null
  if (aTile) {
    return (
      <div className={`food-image food-image--${size} food-image--a-tile`} aria-hidden="true">
        <img className="food-image__a-tile" src={aTile} alt="" />
      </div>
    )
  }
  const glyph = GLYPHS[category]
  return (
    <div className={`food-image food-image--${size}`} aria-hidden="true">
      {glyph && <img className="food-image__glyph" src={glyph} width="44" height="44" alt="" />}
    </div>
  )
}

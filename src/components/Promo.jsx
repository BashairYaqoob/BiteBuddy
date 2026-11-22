import heroShape1 from '../assets/a/promo-hero-shape-1.svg'
import heroShape2 from '../assets/a/promo-hero-shape-2.svg'
import heroShape3 from '../assets/a/promo-hero-shape-3.svg'
import heroShape4 from '../assets/a/promo-hero-shape-4.svg'
import stripShape1 from '../assets/a/promo-strip-shape-1.svg'
import stripShape2 from '../assets/a/promo-strip-shape-2.svg'
import { useTheme } from '../state/ThemeContext'
import './Promo.css'

// Prototype A static promotions (Figma "A / PromoBanner": Hero, Strip, Ticker).
// Theme A only: renders nothing in Theme B. General wording only — no item,
// price, rating, diet or offer. aria-hidden and never tappable. Text is shown
// uppercase via CSS; the wording is exactly as in Figma.
const TEXT = {
  heroTitle: 'Fresh picks every day',
  heroSubtitle: 'Cooked with care, served with a smile',
  strip: 'Good food · Good mood · Good food',
  ticker: 'Hello hungry ✦ Hello hungry ✦ Hello hungry',
}

// Decorative shapes: [src, size, position] from the Figma component.
const HERO_SHAPES = [
  [heroShape1, 90, { right: -28, top: -36 }],
  [heroShape2, 60, { right: -26, top: 48 }],
  [heroShape3, 26, { right: 32, top: 66 }],
  [heroShape4, 10, { right: 80, top: 78 }],
]
const STRIP_SHAPES = [
  [stripShape1, 30, { left: -18, top: -12 }],
  [stripShape2, 28, { right: -16, top: 20 }],
]

function Shapes({ list }) {
  return list.map(([src, size, pos], i) => (
    <img key={i} className="promo__shape" src={src} width={size} height={size} alt="" style={pos} />
  ))
}

// `style` (optional): used to place a fixed strip at its Figma position inside
// scrolling content (position: absolute), behind the text.
// type="fake" (owner decision, 22 Nov 2026): a non-interactive shape styled
// like a button (variant 0), a chip (1) or a link-like pill (2), with a
// neutral word from src/data/layoutA.js. It is a <div>, aria-hidden and
// pointer-events: none, so a tap on it is logged as a dead tap.
export default function Promo({ type, style, word, variant = 0 }) {
  const theme = useTheme()
  if (theme !== 'A') return null

  if (type === 'fake') {
    return (
      <div className={`promo promo--fake promo--fake-${variant}`} aria-hidden="true" style={style}>
        <p className="promo__fake-text">{word}</p>
      </div>
    )
  }

  if (type === 'hero') {
    return (
      <div className="promo promo--hero" aria-hidden="true">
        <Shapes list={HERO_SHAPES} />
        <p className="promo__hero-title">{TEXT.heroTitle}</p>
        <p className="promo__hero-subtitle">{TEXT.heroSubtitle}</p>
      </div>
    )
  }
  if (type === 'strip') {
    return (
      <div className="promo promo--strip" aria-hidden="true" style={style}>
        <Shapes list={STRIP_SHAPES} />
        <p className="promo__strip-text">{TEXT.strip}</p>
      </div>
    )
  }
  if (type === 'ticker') {
    return (
      <div className="promo promo--ticker" aria-hidden="true">
        <p className="promo__ticker-text">{TEXT.ticker}</p>
      </div>
    )
  }
  return null
}

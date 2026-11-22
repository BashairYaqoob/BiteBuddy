import dotsSvg from '../assets/a/decor-dots.svg'
import blobSvg from '../assets/a/decor-blob.svg'
import stickerSvg from '../assets/a/decor-sticker.svg'
import cardStickerSvg from '../assets/a/card-sticker.svg'
import { useTheme } from '../state/ThemeContext'
import './Decor.css'

// Prototype A decorations (Figma component "A / Decor", plus the FoodCard
// corner sticker). Theme A only: renders nothing in Theme B. Always
// aria-hidden, never tappable (pointer-events: none), static, and carries no
// item information. Position comes from the caller via `x` / `y` (px, relative
// to the nearest positioned ancestor), taken from the saved Figma A layout data.
const SVGS = { dots: [dotsSvg, 40], blob: [blobSvg, 64], sticker: [stickerSvg, 20], cardSticker: [cardStickerSvg, 18] }

// Confetti bars: centre x, centre y, rotation (deg), colour — from the Figma
// component (64 × 24 box, 8 × 4 bars, radius 1).
const CONFETTI = [
  [5.07, 7.25, 20, 'pink'],
  [20.38, 12.9, -15, 'teal'],
  [34.35, 0.96, -40, 'mustard'],
  [46.13, 13.93, 35, 'violet'],
  [60.29, 4.27, -10, 'pink'],
]
const STRIPES = ['mustard', 'teal', 'pink', 'violet']

// `rotate` (deg, clockwise) and `box` ([w, h]) are for rotated confetti: Figma
// records the rotated instance's bounding box, so the 64 × 24 confetti is
// centred in that box and rotated about its centre.
export default function Decor({ type, x, y, style, rotate, box }) {
  const theme = useTheme()
  if (theme !== 'A') return null
  let place = { left: x, top: y, ...style }
  if (rotate && box) {
    place = { left: x + box[0] / 2 - 32, top: y + box[1] / 2 - 12, transform: `rotate(${rotate}deg)`, ...style }
  }

  // Item screen info card (Figma "Decor / Info card"): a fixed 366 × 214
  // white panel with a 2 px violet border, radius 16, behind the item text.
  if (type === 'infoCard') {
    return <span className="decor decor--info-card" aria-hidden="true" style={place} />
  }

  if (SVGS[type]) {
    const [src, size] = SVGS[type]
    return <img className={`decor decor--${type}`} src={src} width={size} height={size} alt="" aria-hidden="true" style={place} />
  }
  if (type === 'stripes') {
    return (
      <span className="decor decor--stripes" aria-hidden="true" style={place}>
        {STRIPES.map((c, i) => (
          <span key={c} className={`decor__stripe decor__fill--${c}`} style={{ left: i * 12 }} />
        ))}
      </span>
    )
  }
  if (type === 'confetti') {
    return (
      <span className="decor decor--confetti" aria-hidden="true" style={place}>
        {CONFETTI.map(([cx, cy, deg, c], i) => (
          <span
            key={i}
            className={`decor__bar decor__fill--${c}`}
            style={{ left: cx - 4, top: cy - 2, transform: `rotate(${deg}deg)` }}
          />
        ))}
      </span>
    )
  }
  return null
}

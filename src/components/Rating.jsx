import starIcon from '../assets/b/icon-star.svg'
import aStarIcon from '../assets/a/icon-star.svg'
import { useTheme } from '../state/ThemeContext'
import { formatRating } from '../utils/format'
import './Rating.css'

// Rating as in Figma Prototype B: 16 px accent star, 4 px gap, number in
// 16 Medium ink (reference/step-4.5b-measurements.md). In Theme A, food cards
// use the A / FoodCard star; the item screen (variant="detail") keeps the
// accent star and Medium number, as in the Figma A item frames
// (reference/step-5b-theme-a-measurements.md). The star is decorative; the
// number carries the value.
export default function Rating({ value, variant }) {
  const theme = useTheme()
  const useAStar = theme === 'A' && variant !== 'detail'
  return (
    <span className={`rating${variant === 'detail' ? ' rating--detail' : ''}`}>
      <img className="rating__star" src={useAStar ? aStarIcon : starIcon} width="16" height="16" alt="" aria-hidden="true" />
      <span className="rating__value">{formatRating(value)}</span>
    </span>
  )
}

import FoodImage from './FoodImage'
import DietTag from './DietTag'
import Rating from './Rating'
import Decor from './Decor'
import { formatPrice } from '../utils/format'
import './FoodCard.css'

// Layout as in Figma Prototype B (reference/step-4.5b-measurements.md):
// name → diet tag (meals only; drink cards show no label) → row with price
// left and rating right.
export default function FoodCard({ item, interactive = true, onSelect }) {
  const content = (
    <>
      <FoodImage category={item.category} size="card" />
      <div className="food-card__info">
        <span className="food-card__name">{item.name}</span>
        {item.dietTag && <DietTag item={item} />}
        <span className="food-card__row">
          <span className="food-card__price">{formatPrice(item.price)}</span>
          <Rating value={item.rating} />
        </span>
      </div>
      {/* Theme A only: 18 px corner sticker at the card's outer bottom-left
          corner (Figma A / FoodCard: bottom 0, left 0 of the frame; −2 here
          because CSS measures inside A's 2 px border). Renders nothing in B. */}
      <Decor type="cardSticker" x={-2} style={{ bottom: -2 }} />
    </>
  )

  if (!interactive) {
    return <div className="food-card food-card--static">{content}</div>
  }

  return (
    <button type="button" className="food-card" onClick={() => onSelect(item.id)}>
      {content}
    </button>
  )
}

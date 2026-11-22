import FoodImage from './FoodImage'
import './CategoryTile.css'

// Figma Prototype B: image tile 106 × 80 with the label underneath, no border
// (reference/step-4.5b-measurements.md). The whole tile stays one button.
export default function CategoryTile({ category, onSelect }) {
  return (
    <button type="button" className="category-tile" onClick={() => onSelect(category)}>
      <FoodImage category={category} size="tile" />
      <span className="category-tile__label">{category}</span>
    </button>
  )
}

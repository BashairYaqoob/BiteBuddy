import './DietTag.css'

// Meals: diet tag pill. Drinks have no diet tag (Rules tab); Figma Prototype B
// shows the plain text "Drink" (no pill) on drink item screens and no label on
// drink cards (reference/step-4.5b-measurements.md). Wording unchanged.
export default function DietTag({ item }) {
  if (!item.dietTag) {
    return <span className="diet-tag diet-tag--plain">Drink</span>
  }
  return <span className="diet-tag">{item.dietTag}</span>
}

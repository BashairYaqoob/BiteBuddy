import { formatPrice } from '../utils/format'
import './CartRow.css'

// Figma Prototype B (reference/step-4.5b-measurements.md, measured in the
// Added-to-cart panel): name with "Qty 1" underneath on the left, price right.
export default function CartRow({ item }) {
  return (
    <div className="cart-row">
      <span className="cart-row__info">
        <span className="cart-row__name">{item.name}</span>
        <span className="cart-row__qty">Qty 1</span>
      </span>
      <span className="cart-row__price">{formatPrice(item.price)}</span>
    </div>
  )
}

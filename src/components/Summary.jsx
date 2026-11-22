import { formatPrice } from '../utils/format'
import { DELIVERY_FEE } from '../data/rules'
import './Summary.css'

// Presentational only in Step 3 — rendered with zero values until Step 4
// supplies real subtotal/total from CartContext.
export default function Summary({ subtotal = 0, total = 0 }) {
  return (
    <div className="summary">
      <div className="summary__row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="summary__row">
        <span>Delivery fee</span>
        <span>{formatPrice(DELIVERY_FEE)}</span>
      </div>
      <div className="summary__row summary__row--total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}

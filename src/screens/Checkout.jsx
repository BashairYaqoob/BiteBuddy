import TopBar from '../components/TopBar'
import Button from '../components/Button'
import Summary from '../components/Summary'
import CartRow from '../components/CartRow'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { DELIVERY_ADDRESS, PAYMENT_METHOD } from '../data/rules'
import { useCart } from '../state/CartContext'
import { useNav } from '../state/NavContext'
import './Checkout.css'

// Figma Prototype B (Step 4.5c): one column, 16 px apart — "Order summary",
// item rows, delivery address card, payment card, summary. Each card holds its
// label and value. Text unchanged. The item rows are hidden layers in Figma,
// so the positions below them (with real items) are PROVISIONAL until
// prototype-player screenshots confirm them.
export default function Checkout() {
  const { items, subtotal, total } = useCart()
  const { push } = useNav()

  return (
    <div className="screen checkout-screen">
      {/* Theme A only; positions from reference/step-5b-theme-a-measurements.md.
          Fixed beside the title bar: */}
      <Decor type="sticker" x={211} y={18} />
      <Decor type="blob" x={318} y={8} />
      <TopBar title="Checkout" />
      <div className="screen__scroll checkout-screen__content">
        {/* Promo strip in the scrolling content (Figma y 660 → content y 560). */}
        <Promo type="strip" style={{ position: 'absolute', left: 24, top: 560, width: 342 }} />
        <h2 className="checkout-screen__section-title">Order summary</h2>
        <div className="checkout-screen__rows">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </div>
        <div className="checkout-screen__card">
          <span className="checkout-screen__card-label">Delivery address</span>
          <span className="checkout-screen__card-value">{DELIVERY_ADDRESS}</span>
        </div>
        <div className="checkout-screen__card">
          <span className="checkout-screen__card-label">Payment</span>
          <span className="checkout-screen__card-value">{PAYMENT_METHOD}</span>
        </div>
        <Summary subtotal={subtotal} total={total} />
      </div>
      <div className="checkout-screen__footer">
        <Button variant="primary" onClick={() => push('OrderConfirmed')}>
          Place order
        </Button>
      </div>
    </div>
  )
}

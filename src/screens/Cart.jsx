import NavBar from '../components/NavBar'
import CartRow from '../components/CartRow'
import Summary from '../components/Summary'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { useCart } from '../state/CartContext'
import { useNav } from '../state/NavContext'
import './Cart.css'

// Figma Prototype B (Step 4.5c): title bar "Cart" with no Back; empty
// message top-left. Filled state: rows and summary scroll; the Checkout
// button is fixed above the nav bar (Figma layer at y 700). The row/summary
// placement is PROVISIONAL: those Figma layers are hidden, so it is derived
// from Figma's 16 px auto-layout spacing until prototype-player screenshots
// confirm it.
export default function Cart() {
  const { items, isEmpty, subtotal, total } = useCart()
  const { push } = useNav()

  return (
    <div className="screen cart-screen">
      {/* Theme A only; positions from reference/step-5b-theme-a-measurements.md.
          Fixed beside the title bar: */}
      <Decor type="sticker" x={147} y={18} />
      <Decor type="blob" x={318} y={8} />
      <TopBar title="Cart" showBack={false} />
      <div className="screen__scroll cart-screen__content">
        {/* Promo strip in the scrolling content (Figma y 640 → content y 540),
            behind the text; never over the Checkout button or nav bar. */}
        <Promo type="strip" style={{ position: 'absolute', left: 24, top: 540, width: 342 }} />
        {isEmpty ? (
          <p className="cart-screen__empty">Your cart is empty. Browse the menu to add items.</p>
        ) : (
          <>
            <div className="cart-screen__rows">
              {items.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </div>
            <Summary subtotal={subtotal} total={total} />
          </>
        )}
      </div>
      {!isEmpty && (
        <div className="cart-screen__footer">
          <Button variant="primary" onClick={() => push('Checkout')}>
            Checkout
          </Button>
        </div>
      )}
      <NavBar active="Cart" />
    </div>
  )
}

import { useLayoutEffect } from 'react'
import Button from '../components/Button'
import Summary from '../components/Summary'
import CartRow from '../components/CartRow'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import checkIcon from '../assets/b/icon-check.svg'
import { useCart } from '../state/CartContext'
import { useNav } from '../state/NavContext'
import { recordOrderConfirmedFrame } from '../state/sessionStore'
import './OrderConfirmed.css'

export default function OrderConfirmed() {
  const { items, subtotal, total, reset } = useCart()
  const { resetTo } = useNav()

  // Step 6: T3 ends when Order confirmed first appears; the timestamp of the
  // first frame that draws this screen is the end time (as for t0 on Home).
  // Runs once, on arrival, with the order just placed.
  useLayoutEffect(() => {
    const id = requestAnimationFrame((frameTime) => recordOrderConfirmedFrame(frameTime, items, subtotal, total))
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cart stays intact while this screen is shown (so the order just placed
  // still displays correctly) and is only cleared when the participant taps
  // "Back to home" — not on arrival here.
  const backToHome = () => {
    reset()
    resetTo('Home')
  }

  return (
    <div className="screen order-confirmed-screen">
      <div className="screen__scroll order-confirmed-screen__content">
        {/* Theme A only; in the scrolling content (no title bar), Figma y − 44,
            behind the text (reference/step-5b-theme-a-measurements.md). */}
        <Decor type="blob" x={318} y={-4} />
        <Decor type="dots" x={286} y={60} />
        <Decor type="confetti" x={56} y={68} />
        <Promo type="strip" style={{ position: 'absolute', left: 24, top: 556, width: 342 }} />
        <Decor type="dots" x={326} y={616} />
        <Decor type="confetti" x={24} y={620} />
        {/* Figma Prototype B: 80 px accent circle with a 40 px white check.
            Item rows are hidden layers in Figma, so the summary position
            with real items is PROVISIONAL (Step 4.5c). */}
        <div className="order-confirmed-screen__check" aria-hidden="true">
          <img src={checkIcon} width="40" height="40" alt="" />
        </div>
        <h1 className="order-confirmed-screen__heading">Order confirmed</h1>
        <p className="order-confirmed-screen__message">
          Thank you. Your order has been placed and will arrive soon.
        </p>
        <div className="order-confirmed-screen__rows">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </div>
        <Summary subtotal={subtotal} total={total} />
      </div>
      <div className="order-confirmed-screen__footer">
        <Button variant="primary" onClick={backToHome}>
          Back to home
        </Button>
      </div>
    </div>
  )
}

import Button from './Button'
import CartRow from './CartRow'
import Decor from './Decor'
import checkIcon from '../assets/b/icon-check.svg'
import { useCart } from '../state/CartContext'
import { useNav } from '../state/NavContext'
import { formatPrice } from '../utils/format'
import './AddedPanel.css'

export default function AddedPanel() {
  const { isPanelOpen, lastAddedItem, count, subtotal, closePanel } = useCart()
  const { push, resetTo } = useNav()

  if (!isPanelOpen || !lastAddedItem) return null

  // Status line uses the subtotal, not the total (CLAUDE.md section 3,
  // e.g. "Cart: 2 items · Rs. 1,210" excludes the delivery fee).
  const statusNoun = count === 1 ? 'item' : 'items'
  const statusLine = `Cart: ${count} ${statusNoun} · ${formatPrice(subtotal)}`

  const backToMenu = () => {
    closePanel()
    resetTo('Menu', { filter: 'all' })
  }

  const viewCart = () => {
    closePanel()
    push('Cart')
  }

  // Layout as in Figma Prototype B (reference/step-4.5b-measurements.md):
  // header row = 40 px accent badge with a white check, then heading over
  // the status line; item row; the two buttons.
  return (
    <div className="added-panel">
      <button
        type="button"
        className="added-panel__backdrop"
        aria-label="Close"
        onClick={closePanel}
      />
      <div className="added-panel__sheet" role="dialog" aria-modal="true" aria-label="Added to cart">
        {/* Theme A only: Figma sheet positions (318, 26) and (244, 36), −2 for
            the sheet's 2 px border (CSS measures inside it). */}
        <Decor type="dots" x={316} y={24} />
        <Decor type="sticker" x={242} y={34} />
        <div className="added-panel__header">
          <div className="added-panel__check" aria-hidden="true">
            <img src={checkIcon} width="24" height="24" alt="" />
          </div>
          <div className="added-panel__text">
            <h2 className="added-panel__heading">Added to cart</h2>
            <p className="added-panel__status">{statusLine}</p>
          </div>
        </div>
        <CartRow item={lastAddedItem} />
        <div className="added-panel__actions">
          <Button variant="primary" onClick={viewCart}>
            View cart
          </Button>
          <Button variant="secondary" onClick={backToMenu}>
            Back to menu
          </Button>
        </div>
      </div>
    </div>
  )
}

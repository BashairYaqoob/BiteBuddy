import { MENU_ITEMS } from '../data/menu'
import FoodImage from '../components/FoodImage'
import DietTag from '../components/DietTag'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
import Rating from '../components/Rating'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { useCart } from '../state/CartContext'
import { recordAddToCart, tapTime } from '../state/sessionStore'
import { formatPrice } from '../utils/format'
import './ItemDetail.css'

export default function ItemDetail({ itemId }) {
  const item = MENU_ITEMS.find((candidate) => candidate.id === itemId)
  const { add } = useCart()

  if (!item) {
    return (
      <div className="screen item-detail-screen">
        <TopBar title="Details" />
        <p className="item-detail-screen__missing">Item not found.</p>
      </div>
    )
  }

  return (
    <div className="screen item-detail-screen">
      {/* Theme A only (Decor and Promo render nothing in Theme B); positions
          from reference/step-5b-theme-a-measurements.md (Figma A − 44).
          Fixed beside the title bar: */}
      <Decor type="sticker" x={176} y={18} />
      <Decor type="blob" x={318} y={8} />
      <TopBar title="Details" />
      <div className="screen__scroll item-detail-screen__content">
        {/* In the scrolling content, behind the text (content y = Figma y − 100). */}
        <Decor type="infoCard" x={12} y={240} />
        <Decor type="stripes" x={318} y={360} />
        <Decor type="dots" x={326} y={546} />
        <Decor type="confetti" x={24} y={550} />
        <Promo type="strip" style={{ position: 'absolute', left: 24, top: 478, width: 342 }} />
        <FoodImage category={item.category} size="detail" />
        <h1 className="item-detail-screen__name">{item.name}</h1>
        <div className="item-detail-screen__meta">
          <DietTag item={item} />
          <Rating value={item.rating} variant="detail" />
        </div>
        <p className="item-detail-screen__price">{formatPrice(item.price)}</p>
        <p className="item-detail-screen__description">{item.description}</p>
        {/* Theme A only: non-interactive look-alike button (dead tap). */}
        <Promo type="fake" word="Yum!" variant={0} />
      </div>
      <div className="item-detail-screen__footer">
        <Button
          variant="primary"
          onClick={(event) => {
            const time = tapTime(event)
            add(item.id)
            recordAddToCart(item.id, time)
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  )
}

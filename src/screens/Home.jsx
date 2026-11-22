import { useLayoutEffect } from 'react'
import { CATEGORIES, MENU_ITEMS } from '../data/menu'
import SearchField from '../components/SearchField'
import CategoryTile from '../components/CategoryTile'
import FoodCard from '../components/FoodCard'
import NavBar from '../components/NavBar'
import Decor from '../components/Decor'
import Promo from '../components/Promo'
import { useNav } from '../state/NavContext'
import { recordHomeFrame } from '../state/sessionStore'
import './Home.css'

// Order fixed by CLAUDE.md section 3: Vegetable Biryani, Chicken Caesar Wrap,
// Cheese Margherita Pizza.
const FEATURED_IDS = ['M14', 'M05', 'M09']

export default function Home() {
  const { push } = useNav()
  const featured = FEATURED_IDS.map((id) => MENU_ITEMS.find((item) => item.id === id))

  // Step 6, t0: after Home is in the page, the next animation frame is the
  // first one that draws it; its timestamp is t0. The store keeps only the
  // first one per attempt (later visits to Home do not change t0).
  useLayoutEffect(() => {
    const id = requestAnimationFrame((frameTime) => recordHomeFrame(frameTime))
    return () => cancelAnimationFrame(id)
  }, [])

  const openCategory = (category) => {
    push('Menu', { filter: 'all', scrollTo: category })
  }

  return (
    <div className="screen home-screen">
      <div className="screen__scroll home-screen__content">
        {/* Theme A only (Decor and Promo render nothing in Theme B).
            Positions: Figma A layout − 44 (Option A). "Confetti top" is
            rotated 8° clockwise (measured, reference/step-5b-theme-a-measurements.md),
            centred in its Figma bounding box; it sits partly behind the search field. */}
        <Decor type="blob" x={300} y={-26} />
        <Decor type="confetti" x={300} y={48} rotate={8} box={[66.717, 32.674]} />
        <Decor type="dots" x={210} y={14} />
        <Decor type="blob" x={-24} y={762} />
        <h1 className="home-screen__wordmark">
          Bite<span className="home-screen__wordmark-accent">Buddy</span>
        </h1>
        <SearchField />
        <Promo type="hero" />

        <section>
          <Decor type="stripes" x={310} y={10} />
          <h2 className="home-screen__section-title">Categories</h2>
          <div className="home-screen__categories">
            {CATEGORIES.map((category) => (
              <CategoryTile key={category} category={category} onSelect={openCategory} />
            ))}
          </div>
        </section>

        <section>
          <Decor type="sticker" x={334} y={6} />
          <h2 className="home-screen__section-title">Featured meals</h2>
          <div className="home-screen__featured">
            {featured.map((item) => (
              <FoodCard key={item.id} item={item} interactive={false} />
            ))}
          </div>
        </section>
      </div>
      <NavBar active="Home" />
    </div>
  )
}

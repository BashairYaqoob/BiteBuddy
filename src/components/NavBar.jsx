import homeActive from '../assets/b/nav-home-active.svg'
import homeInactive from '../assets/b/nav-home-inactive.svg'
import menuActive from '../assets/b/nav-menu-active.svg'
import menuInactive from '../assets/b/nav-menu-inactive.svg'
import cartActive from '../assets/b/nav-cart-active.svg'
import cartInactive from '../assets/b/nav-cart-inactive.svg'
import aHomeActive from '../assets/a/nav-home-active.svg'
import aHomeInactive from '../assets/a/nav-home-inactive.svg'
import aMenuActive from '../assets/a/nav-menu-active.svg'
import aMenuInactive from '../assets/a/nav-menu-inactive.svg'
import aCartActive from '../assets/a/nav-cart-active.svg'
import aCartInactive from '../assets/a/nav-cart-inactive.svg'
import { useNav } from '../state/NavContext'
import { useTheme } from '../state/ThemeContext'
import './NavBar.css'

// Icons from Figma (src/assets/b for Prototype B, src/assets/a for A);
// decorative, the label names the tab. Same three tabs and handlers in both.
const TABS = [
  { screen: 'Home', label: 'Home', icon: homeInactive, iconActive: homeActive, aIcon: aHomeInactive, aIconActive: aHomeActive },
  { screen: 'Menu', label: 'Menu', icon: menuInactive, iconActive: menuActive, aIcon: aMenuInactive, aIconActive: aMenuActive },
  { screen: 'Cart', label: 'Cart', icon: cartInactive, iconActive: cartActive, aIcon: aCartInactive, aIconActive: aCartActive },
]

export default function NavBar({ active }) {
  const { resetTo } = useNav()
  const isA = useTheme() === 'A'

  return (
    <nav className="nav-bar" aria-label="Primary">
      {TABS.map((tab) => {
        const isActive = tab.screen === active
        return (
          <button
            key={tab.screen}
            type="button"
            className={`nav-bar__tab${isActive ? ' nav-bar__tab--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => resetTo(tab.screen, tab.screen === 'Menu' ? { filter: 'all' } : {})}
          >
            <img
              className="nav-bar__icon"
              src={isA ? (isActive ? tab.aIconActive : tab.aIcon) : isActive ? tab.iconActive : tab.icon}
              width="24"
              height="24"
              alt=""
              aria-hidden="true"
            />
            <span className="nav-bar__label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

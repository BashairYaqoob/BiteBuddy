import backIcon from '../assets/b/icon-back.svg'
import aBackIcon from '../assets/a/icon-back.svg'
import { useNav } from '../state/NavContext'
import { useTheme } from '../state/ThemeContext'
import './TopBar.css'

// Figma Prototype B title bar (reference/step-4.5b-measurements.md).
// showBack (default true) lets screens without Back in Figma (Menu, Cart) use
// the same bar; which screens use it is decided in Step 4.5c. Back behaviour
// is unchanged: it calls the navigator's back(). Theme A uses the
// A / TopBar back icon; its styling is in theme-a.css.
export default function TopBar({ title, showBack = true }) {
  const { back } = useNav()
  const theme = useTheme()
  return (
    <header className="top-bar">
      {showBack && (
        <button type="button" className="top-bar__back" aria-label="Back" onClick={back}>
          <img src={theme === 'A' ? aBackIcon : backIcon} width="24" height="24" alt="" aria-hidden="true" />
        </button>
      )}
      <h1 className="top-bar__title">{title}</h1>
    </header>
  )
}

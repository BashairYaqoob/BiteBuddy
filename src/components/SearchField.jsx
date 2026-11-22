import searchIcon from '../assets/b/icon-search.svg'
import aSearchIcon from '../assets/a/icon-search.svg'
import { useTheme } from '../state/ThemeContext'
import './SearchField.css'

// Non-functional, matching Figma (CLAUDE.md section 3) — rendered as static
// text, not a real input, so it doesn't imply functionality that isn't there.
// The search icon is decorative (reference/step-4.5b-measurements.md);
// Theme A uses the A / SearchField icon.
export default function SearchField() {
  const theme = useTheme()
  return (
    <div className="search-field" role="presentation">
      <img className="search-field__icon" src={theme === 'A' ? aSearchIcon : searchIcon} width="24" height="24" alt="" aria-hidden="true" />
      <span className="search-field__placeholder">Search meals and drinks</span>
    </div>
  )
}

import { createContext, useContext } from 'react'

// Which prototype styling is shown. The theme changes appearance only:
// screens, data, cart, navigation and handlers are shared by both.
//
// Step 6: the theme comes from the study session (the current block's
// prototype, chosen on the moderator setup screen). The development-only
// `?theme=A` / `?theme=B` link is handled in src/state/sessionStore.js and
// is ignored by production builds. Nothing here is visible to participants.
const ThemeContext = createContext('B')

export function ThemeProvider({ theme, children }) {
  return <ThemeContext.Provider value={theme === 'A' ? 'A' : 'B'}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}

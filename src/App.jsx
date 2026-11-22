import { NavProvider, useNav } from './state/NavContext'
import { CartProvider } from './state/CartContext'
import { ThemeProvider, useTheme } from './state/ThemeContext'
import { useSession } from './state/SessionContext'
import Setup from './moderator/Setup'
import Wait from './screens/Wait'
import AddedPanel from './components/AddedPanel'
import Ready from './screens/Ready'
import Home from './screens/Home'
import Menu from './screens/Menu'
import ItemDetail from './screens/ItemDetail'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import OrderConfirmed from './screens/OrderConfirmed'
import './App.css'

const SCREENS = {
  Ready,
  Home,
  Menu,
  ItemDetail,
  Cart,
  Checkout,
  OrderConfirmed,
}

function ScreenHost() {
  const { current } = useNav()
  const Screen = SCREENS[current.screen]
  return <Screen {...current.params} />
}

// The theme only sets data-theme on the frame; everything inside is shared.
// At the time limit the neutral wait screen replaces the task (decision 1).
function AppFrame({ showWait }) {
  const theme = useTheme()
  return (
    <div className="app-frame" data-theme={theme}>
      {showWait ? (
        <Wait />
      ) : (
        <NavProvider>
          <CartProvider>
            <ScreenHost />
            <AddedPanel />
          </CartProvider>
        </NavProvider>
      )}
    </div>
  )
}

// Moderator setup, or a task attempt. Each attempt remounts the frame (key),
// so it always starts on Ready with an empty cart and a fresh screen stack.
function App() {
  const session = useSession()
  if (session.mode === 'setup') return <Setup />

  let theme = session.freeTheme
  let key = 'free'
  if (session.mode === 'task') {
    const p = session.participants[session.activeCode]
    const attempt = p && p.attempts.find((a) => a.attemptId === session.activeAttemptId)
    theme = attempt ? attempt.prototype : 'B'
    key = session.activeAttemptId
  }
  return (
    <ThemeProvider theme={theme}>
      <AppFrame key={key} showWait={session.showWait} />
    </ThemeProvider>
  )
}

export default App

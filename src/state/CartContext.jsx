import { createContext, useContext, useMemo, useReducer } from 'react'
import { MENU_ITEMS } from '../data/menu'
import { DELIVERY_FEE } from '../data/rules'
import { logAddToCart, logPanelClose } from '../logging/logger'

// Cart reducer (CLAUDE.md section 5). Mirrors Figma's boolean-per-item model:
// adding an already-added item changes nothing about cart contents/totals,
// but still re-opens the panel, matching Figma's unconditional open-panel
// action. Cart rows/items are derived by filtering MENU_ITEMS, which is
// already in fixed menu order, so no separate ordering logic is needed
// (CLAUDE.md section 5, "menu order" decision).

const CartContext = createContext(null)

const initialState = {
  addedIds: [],
  lastAddedItemId: null,
  isPanelOpen: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const alreadyAdded = state.addedIds.includes(action.itemId)
      return {
        addedIds: alreadyAdded ? state.addedIds : [...state.addedIds, action.itemId],
        lastAddedItemId: action.itemId,
        isPanelOpen: true,
      }
    }
    case 'CLOSE_PANEL':
      return { ...state, isPanelOpen: false }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const items = useMemo(
    () => MENU_ITEMS.filter((item) => state.addedIds.includes(item.id)),
    [state.addedIds],
  )

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items])
  const isEmpty = items.length === 0
  const total = isEmpty ? 0 : subtotal + DELIVERY_FEE
  const lastAddedItem = state.lastAddedItemId
    ? MENU_ITEMS.find((item) => item.id === state.lastAddedItemId)
    : null

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      subtotal,
      total,
      isEmpty,
      isPanelOpen: state.isPanelOpen,
      lastAddedItem,
      // Step 6b: add_to_cart / panel_open / panel_close events for the
      // supplementary log; cart behaviour is unchanged.
      add: (itemId) => {
        logAddToCart(itemId)
        dispatch({ type: 'ADD_ITEM', itemId })
      },
      closePanel: () => {
        if (state.isPanelOpen) logPanelClose(state.lastAddedItemId)
        dispatch({ type: 'CLOSE_PANEL' })
      },
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [items, subtotal, total, isEmpty, state.isPanelOpen, state.lastAddedItemId, lastAddedItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

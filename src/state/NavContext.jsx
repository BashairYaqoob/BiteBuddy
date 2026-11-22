import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { logBack, logNavigate } from '../logging/logger'

// Simple screen-stack navigator (CLAUDE.md section 5). Three primitives:
// push (forward, can go Back), back (pop), resetTo (discard the whole stack —
// used by the bottom-nav tabs and "Back to home"). setCurrentParams updates the
// current screen's saved parameters without navigating (used by Menu to
// remember its diet filter, so Back from an item returns to the same filter,
// as in Figma, where each filter is its own frame).
//
// Step 6b: each primitive also records a navigate / back event for the
// supplementary log. The stack is mirrored in a ref so each call is logged
// exactly once; navigation behaviour is unchanged.

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const initial = [{ screen: 'Ready', params: {} }]
  const [stack, setStack] = useState(initial)
  const stackRef = useRef(initial)

  const commit = (next) => {
    stackRef.current = next
    setStack(next)
  }

  const push = (screen, params = {}) => {
    const prev = stackRef.current
    const entry = { screen, params }
    logNavigate(prev[prev.length - 1], entry)
    commit([...prev, entry])
  }

  const back = () => {
    const prev = stackRef.current
    if (prev.length <= 1) return
    logBack(prev[prev.length - 1], prev[prev.length - 2])
    commit(prev.slice(0, -1))
  }

  const resetTo = (screen, params = {}) => {
    const prev = stackRef.current
    const entry = { screen, params }
    logNavigate(prev[prev.length - 1], entry)
    commit([entry])
  }

  const setCurrentParams = (params) => {
    const prev = stackRef.current
    const top = prev[prev.length - 1]
    commit([...prev.slice(0, -1), { ...top, params: { ...top.params, ...params } }])
  }

  const current = stack[stack.length - 1]

  const value = useMemo(
    () => ({ current, canGoBack: stack.length > 1, push, back, resetTo, setCurrentParams }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, stack.length],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within a NavProvider')
  return ctx
}

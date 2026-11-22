import { useSyncExternalStore } from 'react'
import { getState, subscribe } from './sessionStore'

// React access to the study session store (src/state/sessionStore.js).
// The store itself does the timing, so nothing waits for React to render.
export function useSession() {
  return useSyncExternalStore(subscribe, getState)
}

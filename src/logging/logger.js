// Supplementary behavioural event logging (Step 6, Phase 6b).
//
// One set of document-level listeners records, for the running attempt only:
//   tap              pointer down + up with at most 10 px movement (decision 4),
//                    time = pointer down; role interactive or dead; relevant
//   filter           diet filter change (Menu keeps the filter in local state)
//   chip_scroll      Menu category chip;  tile_scroll  Home category tile
//   view_cart, checkout, place_order   their buttons
//   scroll           scrollTop, at most every 100 ms while moving + a final
//                    sample 150 ms after it stops (decision 10)
//   item_visibility  card enter / exit at two levels, "any" and "full" (decision 9)
// Navigation (navigate, back, open_item) and cart (add_to_cart, panel_open,
// panel_close) events come from NavContext / CartContext through the helpers
// at the bottom. Nothing here changes what the participant sees, and nothing
// is logged on the moderator setup screen. Behavioural proxies only.

import { MENU_ITEMS } from '../data/menu'
import { isRelevantTap } from '../data/relevantTaps'
import { activeTaskInfo, getState, isCorrectItem, logEvent } from '../state/sessionStore'

const TAP_MOVE_TOLERANCE = 10 // px (decision 4)
const SCROLL_SAMPLE_MS = 100 // decision 10
const SCROLL_STOP_MS = 150

// ---------------------------------------------------------------------------
// What is on screen, and what a DOM element is

function itemIdByName(text) {
  let best = null
  for (const item of MENU_ITEMS) {
    if (text.includes(item.name) && (!best || item.name.length > best.name.length)) best = item
  }
  return best ? best.id : null
}

const slug = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function screenLabel() {
  if (getState().showWait) return 'Wait'
  const frame = document.querySelector('.app-frame')
  const screen = frame && frame.querySelector('.screen')
  if (!screen) return null
  let label = 'Unknown'
  if (screen.classList.contains('ready-screen')) label = 'Ready'
  else if (screen.classList.contains('home-screen')) label = 'Home'
  else if (screen.classList.contains('menu-screen')) label = `Menu:${screen.dataset.filter}`
  else if (screen.classList.contains('item-detail-screen')) {
    const name = screen.querySelector('.item-detail-screen__name')
    label = `ItemDetail:${name ? itemIdByName(name.textContent) : '?'}`
  } else if (screen.classList.contains('cart-screen')) label = 'Cart'
  else if (screen.classList.contains('checkout-screen')) label = 'Checkout'
  else if (screen.classList.contains('order-confirmed-screen')) label = 'OrderConfirmed'
  if (frame.querySelector('.added-panel')) label += '+panel'
  return label
}

// Identify the control under a touch. Same classes in both themes, so the ids
// are identical for A and B.
function classify(el) {
  const frame = document.querySelector('.app-frame')
  if (!frame || !el || !frame.contains(el)) return null
  const control = el.closest('button, a, input, select, textarea, [role="button"]')
  if (!control || !frame.contains(control)) {
    const card = el.closest('.food-card')
    if (card) return { targetId: `dead:featured-card-${itemIdByName(card.textContent)}`, role: 'dead', kind: 'dead' }
    const named = el.closest('[class]')
    const cls = named ? named.className.toString().split(' ')[0] : el.tagName.toLowerCase()
    return { targetId: `dead:${cls}`, role: 'dead', kind: 'dead' }
  }
  const text = control.textContent.replace(/\s+/g, ' ').trim()
  if (control.matches('.menu-screen__diet-filters .chip')) {
    const filter = text === 'Vegetarian' ? 'veg' : 'nonveg'
    return { targetId: `filter-${filter}`, role: 'interactive', kind: 'filter', filter }
  }
  if (control.matches('.menu-screen__category-chips .chip')) {
    return { targetId: `chip-${slug(text)}`, role: 'interactive', kind: 'category_chip', category: text }
  }
  if (control.matches('.category-tile')) {
    const category = control.querySelector('.category-tile__label').textContent.trim()
    return { targetId: `tile-${slug(category)}`, role: 'interactive', kind: 'category_tile', category }
  }
  if (control.matches('.food-card')) {
    const itemId = itemIdByName(text)
    return { targetId: `card-${itemId}`, role: 'interactive', kind: 'card', itemId }
  }
  if (control.matches('.nav-bar__tab')) {
    return { targetId: `nav-${slug(control.querySelector('.nav-bar__label').textContent)}`, role: 'interactive', kind: 'nav' }
  }
  if (control.matches('.top-bar__back')) return { targetId: 'back', role: 'interactive', kind: 'back' }
  if (control.matches('.added-panel__backdrop')) return { targetId: 'panel-backdrop', role: 'interactive', kind: 'panel_backdrop' }
  if (control.matches('.btn')) return { targetId: `btn-${slug(text)}`, role: 'interactive', kind: 'button' }
  return { targetId: `control-${slug(text) || control.tagName.toLowerCase()}`, role: 'interactive', kind: 'other' }
}

// ---------------------------------------------------------------------------
// Taps

const downs = new Map() // pointerId → { x, y, time, target, moved }

function onPointerDown(e) {
  const target = classify(e.target)
  if (!target) return
  downs.set(e.pointerId, { x: e.clientX, y: e.clientY, time: e.timeStamp, target, screen: screenLabel(), moved: false })
}

function onPointerMove(e) {
  const d = downs.get(e.pointerId)
  if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_MOVE_TOLERANCE) d.moved = true
}

function onPointerUp(e) {
  const d = downs.get(e.pointerId)
  downs.delete(e.pointerId)
  if (!d || d.moved || Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_MOVE_TOLERANCE) return
  const info = activeTaskInfo()
  const frame = document.querySelector('.app-frame')
  const r = frame ? frame.getBoundingClientRect() : { left: 0, top: 0 }
  const { targetId, role } = d.target
  logEvent(
    'tap',
    {
      targetId,
      role,
      relevant: role === 'interactive' && !!info && isRelevantTap(info.set, info.task, d.target),
      x: Math.round(d.x - r.left),
      y: Math.round(d.y - r.top),
    },
    d.time,
    d.screen,
  )
}

// ---------------------------------------------------------------------------
// What a tap did (click = activation). Capture phase, so this runs before the
// app's own handlers; navigation / cart events triggered by the same click
// read `currentClick` for their cause and time.

let currentClick = null

function onClick(e) {
  const target = classify(e.target)
  if (!target || target.role !== 'interactive') return
  const time = lastDownTime != null && lastDownTime <= e.timeStamp ? lastDownTime : e.timeStamp
  currentClick = { targetId: target.targetId, time }
  setTimeout(() => {
    currentClick = null
  }, 0)
  const screen = screenLabel()
  if (target.kind === 'filter') {
    const menu = document.querySelector('.menu-screen')
    const from = menu ? menu.dataset.filter : null
    // Read the new filter once React has applied the change.
    setTimeout(() => {
      const after = document.querySelector('.menu-screen')
      logEvent('filter', { tapped: target.filter, from, to: after ? after.dataset.filter : null }, time, screen)
    }, 0)
  } else if (target.kind === 'category_chip') {
    logEvent('chip_scroll', { category: target.category }, time, screen)
  } else if (target.kind === 'category_tile') {
    logEvent('tile_scroll', { category: target.category }, time, screen)
  } else if (target.targetId === 'btn-view-cart') {
    logEvent('view_cart', {}, time, screen)
  } else if (target.targetId === 'btn-checkout') {
    logEvent('checkout', {}, time, screen)
  } else if (target.targetId === 'btn-place-order') {
    logEvent('place_order', {}, time, screen)
  }
}

let lastDownTime = null

// ---------------------------------------------------------------------------
// Scroll samples (decision 10)

const scrollState = new WeakMap()

function onScroll(e) {
  const el = e.target
  if (!(el instanceof Element) || !el.classList.contains('screen__scroll')) return
  let s = scrollState.get(el)
  if (!s) {
    s = { last: -Infinity, stopTimer: null, lastTime: 0 }
    scrollState.set(el, s)
  }
  const screen = screenLabel()
  s.lastTime = e.timeStamp
  if (e.timeStamp - s.last >= SCROLL_SAMPLE_MS) {
    s.last = e.timeStamp
    logEvent('scroll', { scrollTop: Math.round(el.scrollTop), final: false }, e.timeStamp, screen)
  }
  clearTimeout(s.stopTimer)
  s.stopTimer = setTimeout(() => {
    if (el.isConnected) logEvent('scroll', { scrollTop: Math.round(el.scrollTop), final: true }, s.lastTime, screenLabel())
  }, SCROLL_STOP_MS)
}

// ---------------------------------------------------------------------------
// Card visibility (decision 9): enter / exit at "any" (> 0 %) and "full" (100 %)
// within the scroll area of the screen. No scroll-past is computed here.

const observers = new WeakMap() // scroll root → IntersectionObserver
const cardState = new WeakMap() // card → { any, full, itemId }

function onIntersect(entries) {
  const screen = screenLabel()
  for (const entry of entries) {
    const card = entry.target
    const s = cardState.get(card)
    if (!s) continue
    const any = entry.isIntersecting && entry.intersectionRatio > 0
    const full = entry.isIntersecting && entry.intersectionRatio >= 0.999
    for (const [level, now] of [['any', any], ['full', full]]) {
      if (now !== s[level]) {
        if (now || s[level] !== undefined) {
          logEvent('item_visibility', { itemId: s.itemId, state: now ? 'enter' : 'exit', level }, entry.time, screen)
        }
        s[level] = now
      }
    }
  }
}

function observeCard(card) {
  if (cardState.has(card)) return
  const root = card.closest('.screen__scroll')
  if (!root) return
  let io = observers.get(root)
  if (!io) {
    io = new IntersectionObserver(onIntersect, { root, threshold: [0, 1] })
    observers.set(root, io)
  }
  cardState.set(card, { any: undefined, full: undefined, itemId: itemIdByName(card.textContent) })
  io.observe(card)
}

// A visible card removed from the page (filter change, leaving the screen)
// gets an exit event with reason "removed".
function forgetCard(card) {
  const s = cardState.get(card)
  if (!s) return
  const time = performance.now()
  for (const level of ['full', 'any']) {
    if (s[level]) logEvent('item_visibility', { itemId: s.itemId, state: 'exit', level, reason: 'removed' }, time, screenLabel())
  }
  cardState.delete(card)
}

function cardsIn(node) {
  if (!(node instanceof Element)) return []
  const list = node.matches('.food-card') ? [node] : []
  return list.concat([...node.querySelectorAll('.food-card')])
}

function onMutations(mutations) {
  for (const m of mutations) {
    m.removedNodes.forEach((n) => cardsIn(n).forEach(forgetCard))
    m.addedNodes.forEach((n) => cardsIn(n).forEach(observeCard))
  }
}

// ---------------------------------------------------------------------------
// Helpers for NavContext and CartContext

function cause() {
  return currentClick ? { time: currentClick.time, cause: currentClick.targetId } : { time: performance.now(), cause: 'app' }
}

function navLabel(entry) {
  if (!entry) return null
  if (entry.screen === 'Menu') return `Menu:${entry.params.filter || 'all'}`
  if (entry.screen === 'ItemDetail') return `ItemDetail:${entry.params.itemId}`
  return entry.screen
}

export function logNavigate(fromEntry, toEntry) {
  const { time, cause: why } = cause()
  const from = screenLabel() || navLabel(fromEntry)
  logEvent('navigate', { from, to: navLabel(toEntry), cause: why }, time, from)
  if (toEntry.screen === 'ItemDetail') logEvent('open_item', { itemId: toEntry.params.itemId, fromScreen: from }, time, from)
}

export function logBack(fromEntry, toEntry) {
  const { time } = cause()
  const from = screenLabel() || navLabel(fromEntry)
  logEvent('back', { from, to: navLabel(toEntry) }, time, from)
}

export function logAddToCart(itemId) {
  const { time } = cause()
  const screen = screenLabel()
  logEvent('add_to_cart', { itemId, correct: isCorrectItem(itemId) }, time, screen)
  logEvent('panel_open', { itemId }, time, screen)
}

const PANEL_CLOSE_CAUSE = { 'panel-backdrop': 'backdrop', 'btn-view-cart': 'view_cart', 'btn-back-to-menu': 'back_to_menu' }

export function logPanelClose(itemId) {
  const { time, cause: why } = cause()
  logEvent('panel_close', { itemId, cause: PANEL_CLOSE_CAUSE[why] || why }, time, screenLabel())
}

// ---------------------------------------------------------------------------

function install() {
  if (typeof window === 'undefined' || getState().mode === 'free') return
  const opts = { capture: true, passive: true }
  document.addEventListener('pointerdown', (e) => {
    lastDownTime = e.timeStamp
    onPointerDown(e)
  }, opts)
  document.addEventListener('pointermove', onPointerMove, opts)
  document.addEventListener('pointerup', onPointerUp, opts)
  document.addEventListener('pointercancel', (e) => downs.delete(e.pointerId), opts)
  document.addEventListener('click', onClick, { capture: true })
  document.addEventListener('scroll', onScroll, opts)
  new MutationObserver(onMutations).observe(document.body, { childList: true, subtree: true })
  document.querySelectorAll('.food-card').forEach(observeCard)
}

install()

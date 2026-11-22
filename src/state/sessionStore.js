// Study session store (Step 6): participant, condition, attempts, t0, task end
// events, time limits (Phase 6a) and the supplementary event log, behavioural
// measures and JSON export (Phase 6b). Plain JavaScript outside React, so
// timing never waits for React to render; SessionContext.jsx exposes it, and
// src/logging/logger.js feeds it the DOM-level events (taps, scroll, visibility).
//
// Clock: every time is performance.now() / event.timeStamp (the same
// high-resolution clock). Saved times are milliseconds relative to the
// attempt's t0, so they stay meaningful after a reload.
//
// Supplementary record only: the screen recording is the primary capture
// method (CLAUDE.md section 2). Behavioural proxies only, no gaze data.

import { CONDITIONS } from '../data/conditions'
import { TASK_SETS, TASK_ORDER } from '../data/tasks'

const STORAGE_KEY = 'bitebuddy-study-v1'
const HOLD_ZONE = 44 // px, top-right corner of the app frame (decision 3)
const HOLD_MS = 3000
const HOLD_MOVE_TOLERANCE = 10 // px
const SAVE_BATCH_MS = 1000 // ordinary events are saved at most once a second

export const COMPLETED_REASONS = ['add_to_cart', 'order_confirmed', 'time_limit']

// ---------------------------------------------------------------------------
// State

let state = {
  mode: 'setup', // 'setup' | 'task' | 'free' (development ?theme= link only)
  freeTheme: null,
  storageOk: true,
  activeCode: null,
  activeAttemptId: null,
  showWait: false, // neutral "Please wait for the moderator." screen (decision 1)
  otherTab: false, // another tab wrote the saved data: this tab stops saving
  participants: {},
}

// Each open copy of the app (browser tab) marks its saves with its own id, so
// two tabs on one device can never silently overwrite each other's data.
const TAB_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// Runtime-only timing for the active attempt (performance.now() values).
let run = null

const listeners = new Set()

function emit() {
  state = { ...state }
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getState() {
  return state
}

// ---------------------------------------------------------------------------
// Storage. save() writes immediately; it is called directly for the Start tap,
// t0, every task end and every moderator action. Ordinary events (taps,
// scroll samples, visibility) use scheduleSave(), at most once a second.

let saveTimer = null

function save() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = null
  if (state.otherTab) return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, savedAt: new Date().toISOString(), writer: TAB_ID, participants: state.participants }),
    )
    if (!state.storageOk) {
      state.storageOk = true
      emit()
    }
  } catch {
    if (state.storageOk) {
      state.storageOk = false
      emit()
    }
  }
}

function scheduleSave() {
  if (!saveTimer) saveTimer = setTimeout(save, SAVE_BATCH_MS)
}

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (parsed && parsed.participants) state.participants = parsed.participants
  } catch {
    state.storageOk = false
  }
  for (const p of Object.values(state.participants)) {
    if (!p.events) p.events = []
    if (p.nextSeq == null) p.nextSeq = p.events.length + 1
  }
}

// ---------------------------------------------------------------------------
// Helpers

const pairKey = (block, task) => `b${block}-${task}`
const round = (ms) => (ms == null ? null : Math.round(ms * 10) / 10)

function participant() {
  return state.activeCode ? state.participants[state.activeCode] : null
}

function findAttempt(id) {
  const p = participant()
  return p ? p.attempts.find((a) => a.attemptId === id) : null
}

function activeAttempt() {
  return state.activeAttemptId ? findAttempt(state.activeAttemptId) : null
}

function emptyResult(endReason) {
  return {
    endReason,
    success: null,
    censored: false,
    timeMs: null,
    endTimeSource: null,
    timerFiredMs: null,
    raceResolved: false,
    itemId: null,
    correct: null,
    decisionError: null,
    orderedItemIds: null,
    orderSubtotal: null,
    orderTotal: null,
    lastEventMs: null,
  }
}

// Decision 7: one counted attempt per block/task pair. Default = the latest
// completed or timed-out attempt; a moderator override (an attempt id or
// 'none') replaces the default. Abandoned / interrupted are never counted by
// default.
function recomputeCounted(p) {
  const pairs = new Set(p.attempts.map((a) => pairKey(a.block, a.task)))
  for (const key of pairs) {
    const list = p.attempts.filter((a) => pairKey(a.block, a.task) === key)
    const override = p.countedOverrides[key]
    let chosen = null
    let by = 'default'
    if (override === 'none') {
      by = 'moderator'
    } else if (override && list.some((a) => a.attemptId === override)) {
      chosen = override
      by = 'moderator'
    } else {
      const eligible = list.filter((a) => a.result && COMPLETED_REASONS.includes(a.result.endReason))
      chosen = eligible.length ? eligible[eligible.length - 1].attemptId : null
    }
    for (const a of list) {
      a.counted = a.attemptId === chosen
      a.countedBy = by
    }
  }
}

// ---------------------------------------------------------------------------
// Event log (Phase 6b). Every event: seq, attemptId, ms (from that attempt's
// t0; events before t0, e.g. the Start tap, are converted once t0 is known),
// afterEnd (logged after the result was fixed), screen, type, data.

function pushEvent(p, event) {
  event.seq = p.nextSeq++
  p.events.push(event)
  return event
}

// Task-time events for the active attempt. Ignored when no attempt is running
// (setup screen, development ?theme= link).
export function logEvent(type, data = {}, time = performance.now(), screen = null, afterEndOverride) {
  const a = activeAttempt()
  const p = participant()
  if (!a || !p || !run) return
  const event = pushEvent(p, {
    seq: 0,
    attemptId: a.attemptId,
    ms: run.t0 != null ? round(time - run.t0) : null,
    afterEnd: afterEndOverride !== undefined ? afterEndOverride : !!a.result,
    screen,
    type,
    data,
  })
  if (run.t0 == null) run.preT0.push({ event, time })
  if (event.ms != null && !event.afterEnd && (a.lastEventMs == null || event.ms > a.lastEventMs)) a.lastEventMs = event.ms
  scheduleSave()
}

// Moderator / status events (not tied to the participant's clock).
function logModeratorEvent(p, type, attemptId, ms, data) {
  pushEvent(p, { seq: 0, attemptId, ms, afterEnd: false, screen: 'moderator', type, data: { at: new Date().toISOString(), ...data } })
}

export function isTaskRunning() {
  const a = activeAttempt()
  return !!(a && run && run.t0 != null && !a.result)
}

export function activeTaskInfo() {
  const a = activeAttempt()
  return a ? { set: a.set, task: a.task, prototype: a.prototype } : null
}

export function isCorrectItem(itemId) {
  const a = activeAttempt()
  return a ? TASK_SETS[a.set][a.task].correctItemIds.includes(itemId) : null
}

// ---------------------------------------------------------------------------
// Behavioural measures (only those whose rules the methodology defines).
// Window: events with 0 <= ms <= end time and afterEnd false, where the end
// time is timeMs (completed / timed out) or the last event (abandoned /
// interrupted). firstRelevantTapMs separates an observed tap from a censored
// observation (owner rule, 21 Nov 2026).
function computeMeasures(a, events) {
  const r = a.result
  if (!r) return null
  const end = r.timeMs != null ? r.timeMs : r.lastEventMs
  const inWindow = events.filter(
    (e) => e.attemptId === a.attemptId && !e.afterEnd && e.ms != null && e.ms >= 0 && (end == null || e.ms <= end),
  )
  const taps = inWindow.filter((e) => e.type === 'tap')
  const firstRelevant = taps.find((e) => e.data.relevant)
  let firstRelevantTapMs = null
  let status
  if (firstRelevant) {
    firstRelevantTapMs = firstRelevant.ms
    status = 'observed'
  } else if (r.endReason === 'time_limit') {
    firstRelevantTapMs = r.timeMs
    status = 'censored_time_limit'
  } else if (COMPLETED_REASONS.includes(r.endReason)) {
    status = 'none_before_end'
  } else {
    status = 'not_applicable'
  }
  return {
    firstRelevantTapMs,
    firstRelevantTapStatus: status,
    firstRelevantTapCensored: status === 'censored_time_limit',
    firstRelevantTapTarget: firstRelevant ? firstRelevant.data.targetId : null,
    tapCount: taps.length,
    deadTapCount: taps.filter((e) => e.data.role === 'dead').length,
    backCount: inWindow.filter((e) => e.type === 'back').length,
  }
}

function closeInterrupted() {
  const now = new Date().toISOString()
  for (const p of Object.values(state.participants)) {
    for (const a of p.attempts) {
      if (!a.result) {
        a.result = emptyResult('interrupted')
        a.result.lastEventMs = a.lastEventMs ?? null
        a.endedAt = now
        a.measures = computeMeasures(a, p.events)
        logModeratorEvent(p, 'attempt_closed', a.attemptId, a.result.lastEventMs, { reason: 'interrupted' })
      }
    }
    recomputeCounted(p)
  }
}

// ---------------------------------------------------------------------------
// Start-up: development-only ?theme= link (decision 8), otherwise restore
// saved data, close any unfinished attempt as interrupted, open setup.

function init() {
  if (typeof window === 'undefined') return
  if (import.meta.env.DEV) {
    const requested = new URLSearchParams(window.location.search).get('theme')
    if (requested === 'A' || requested === 'B') {
      state.mode = 'free'
      state.freeTheme = requested
      return
    }
  }
  load()
  closeInterrupted()
  save()
  installPointerTracking()
  // Another tab saved over this tab's data (only fires for other tabs).
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY || state.otherTab) return
    let writer
    try {
      writer = e.newValue ? JSON.parse(e.newValue).writer : null
    } catch {
      writer = null
    }
    if (writer !== TAB_ID) {
      state.otherTab = true
      emit()
    }
  })
  // Ordinary events are batched; write them before the page goes away.
  window.addEventListener('pagehide', save)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save()
  })
}

// ---------------------------------------------------------------------------
// Tap timing: the time of an interaction is the pointerdown that started it
// (the Methodology Plan times a tap from first touch), not the later click or
// React render. Falls back to the click's own timestamp.

let lastDown = null
let pointerIsDown = false
let afterPointerUp = []
let hold = null
let suppressHoldClick = false

function installPointerTracking() {
  const opts = { capture: true, passive: true }
  document.addEventListener('pointerdown', (e) => {
    lastDown = { time: e.timeStamp, target: e.target }
    pointerIsDown = true
    startHold(e)
  }, opts)
  document.addEventListener('pointermove', (e) => {
    if (hold && Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > HOLD_MOVE_TOLERANCE) cancelHold()
  }, opts)
  const up = () => {
    pointerIsDown = false
    cancelHold()
    // A click from the hold's release (if the browser fires one) comes right
    // after this pointerup in the same task; stop ignoring clicks after it.
    if (suppressHoldClick) setTimeout(() => { suppressHoldClick = false }, 0)
    // Let the click that follows this pointerup run first.
    const pending = afterPointerUp
    afterPointerUp = []
    if (pending.length) setTimeout(() => pending.forEach((fn) => fn()), 0)
  }
  document.addEventListener('pointerup', up, opts)
  document.addEventListener('pointercancel', up, opts)
  document.addEventListener('click', (e) => {
    if (suppressHoldClick) {
      e.preventDefault()
      e.stopPropagation()
      suppressHoldClick = false
    }
  }, { capture: true })
}

export function tapTime(event) {
  if (lastDown && event.currentTarget && event.currentTarget.contains(lastDown.target) && lastDown.time <= event.timeStamp) {
    return { time: lastDown.time, source: 'pointerdown' }
  }
  return { time: event.timeStamp, source: 'click' }
}

// Decision 3: hold 3 s in the top-right 44 × 44 px of the app frame.
function startHold(e) {
  cancelHold()
  if (state.mode !== 'task') return
  const frame = document.querySelector('.app-frame')
  if (!frame) return
  const r = frame.getBoundingClientRect()
  if (e.clientX < r.right - HOLD_ZONE || e.clientX > r.right || e.clientY < r.top || e.clientY > r.top + HOLD_ZONE) return
  hold = {
    x: e.clientX,
    y: e.clientY,
    timer: setTimeout(() => {
      hold = null
      // The finger is still down; its release must not tap the setup screen.
      suppressHoldClick = true
      returnToSetup()
    }, HOLD_MS),
  }
}

function cancelHold() {
  if (hold) clearTimeout(hold.timer)
  hold = null
}

// ---------------------------------------------------------------------------
// Moderator actions

export function openParticipant(code, condition) {
  const existing = state.participants[code]
  if (existing && existing.condition !== condition) {
    return `${code} already exists with condition ${existing.condition}.`
  }
  if (!existing) {
    state.participants[code] = {
      participant: code,
      condition,
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      attempts: [],
      countedOverrides: {},
      countedHistory: [],
      events: [],
      nextSeq: 1,
    }
  }
  state.activeCode = code
  save()
  emit()
  return null
}

export function closeParticipant() {
  state.activeCode = null
  save()
  emit()
}

export function startAttempt(block, task) {
  const p = participant()
  if (!p) return
  const blockInfo = CONDITIONS[p.condition].find((b) => b.block === block)
  const number = p.attempts.filter((a) => a.block === block && a.task === task).length + 1
  const attempt = {
    attemptId: `${p.participant}-b${block}-${task}-a${number}`,
    participant: p.participant,
    condition: p.condition,
    block,
    design: blockInfo.design,
    prototype: blockInfo.prototype,
    set: blockInfo.set,
    task,
    attempt: number,
    counted: false,
    countedBy: 'default',
    startedAt: new Date().toISOString(),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    readyShownMs: null,
    startTapMs: null,
    startTapSource: null,
    t0: null,
    endedAt: null,
    lastEventMs: null,
    result: null,
    measures: null,
  }
  p.attempts.push(attempt)
  recomputeCounted(p)
  run = { readyShown: performance.now(), startTap: null, t0: null, deadline: null, timer: null, timerFired: null, pendingTimeout: false, preT0: [] }
  state.activeAttemptId = attempt.attemptId
  state.mode = 'task'
  state.showWait = false
  save()
  emit()
}

// Leaving a running attempt makes it "abandoned"; an ended attempt is unchanged.
export function returnToSetup() {
  const a = activeAttempt()
  const p = participant()
  if (a && !a.result) {
    a.result = emptyResult('abandoned')
    a.result.lastEventMs = run && run.t0 != null ? round(performance.now() - run.t0) : null
    a.lastEventMs = a.result.lastEventMs
    a.endedAt = new Date().toISOString()
    a.measures = computeMeasures(a, p.events)
    logModeratorEvent(p, 'attempt_closed', a.attemptId, a.result.lastEventMs, { reason: 'abandoned' })
    recomputeCounted(p)
  }
  stopTimer()
  run = null
  state.activeAttemptId = null
  state.mode = 'setup'
  state.showWait = false
  save()
  emit()
}

// target: an attempt id, 'none', or null (back to the default rule).
export function setCounted(block, task, target) {
  const p = participant()
  if (!p) return
  const key = pairKey(block, task)
  const before = p.attempts.find((a) => a.block === block && a.task === task && a.counted)
  if (target === null) delete p.countedOverrides[key]
  else p.countedOverrides[key] = target
  recomputeCounted(p)
  const after = p.attempts.find((a) => a.block === block && a.task === task && a.counted)
  const entry = {
    at: new Date().toISOString(),
    block,
    task,
    from: before ? before.attemptId : null,
    to: after ? after.attemptId : null,
    choice: target === null ? 'default' : target,
  }
  p.countedHistory.push(entry)
  logModeratorEvent(p, 'counted_changed', null, null, { block, task, from: entry.from, to: entry.to, choice: entry.choice })
  save()
  emit()
}

export function clearStoredData() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable; memory is still cleared
  }
  state.participants = {}
  state.activeCode = null
  emit()
}

// Suggested next task: the first block/task pair with no completed or
// timed-out attempt, in block order and T1 → T2 → T3.
export function nextTask(p) {
  for (const block of [1, 2]) {
    for (const task of TASK_ORDER) {
      const done = p.attempts.some((a) => a.block === block && a.task === task && a.result && COMPLETED_REASONS.includes(a.result.endReason))
      if (!done) return { block, task }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// JSON export (Phase 6b): one file per participant, neutral file name.

const NOTE =
  'Supplementary behavioural log. The screen recording is the primary record. ' +
  'All measures are behavioural proxies; no gaze or attention is measured.'

const DEFINITIONS = {
  ms: 'Milliseconds from the attempt’s t0 (first frame showing Home after Start). Negative = before t0.',
  t0: 'Timestamp of the first animation frame that draws Home after the Start tap.',
  tap: 'Pointer down and up with at most 10 px movement; time = pointer down. role "dead" = non-interactive area.',
  relevant: 'Tap on the task’s valid-first-step list (src/data/relevantTaps.js).',
  timeMs: 'Completed: end time − t0 (T1/T2: Add to cart pointer down; T3: first Order confirmed frame). Time limit: exactly 120000 or 180000.',
  firstRelevantTapStatus: 'observed | censored_time_limit (no relevant tap before the limit; value = the limit) | none_before_end | not_applicable (abandoned/interrupted).',
  measuresWindow: 'Measures use events with 0 <= ms <= end time and afterEnd false.',
  item_visibility: 'IntersectionObserver within the screen’s scroll area; level "any" (>0 % visible) or "full" (100 %). Cards under the added-to-cart panel still count as visible.',
  scroll: 'scrollTop of the screen’s scroll area, at most every 100 ms while moving, plus a final sample 150 ms after it stops.',
  notComputed: 'Wrong turns, taps against the shortest path and scroll-pasts are not computed (rules not yet decided); the raw events are included.',
}

export function buildExport(code) {
  const p = state.participants[code]
  if (!p) return null
  for (const a of p.attempts) if (a.result) a.measures = computeMeasures(a, p.events)
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    note: NOTE,
    definitions: DEFINITIONS,
    session: {
      participant: p.participant,
      condition: p.condition,
      createdAt: p.createdAt,
      device: { viewportWidth: p.viewportWidth, viewportHeight: p.viewportHeight, userAgent: p.userAgent },
      storage: state.otherTab ? 'memory only (another tab was open)' : state.storageOk ? 'localStorage' : 'memory only',
    },
    blocks: CONDITIONS[p.condition],
    attempts: p.attempts,
    countedHistory: p.countedHistory,
    events: p.events.map(({ seq, attemptId, ms, afterEnd, screen, type, data }) => ({ seq, attemptId, ms, afterEnd, screen, type, data })),
  }
}

export function downloadExport(code) {
  const data = buildExport(code)
  if (!data) return false
  save()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${code}-session.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
  return true
}

// ---------------------------------------------------------------------------
// Task events (called by Ready, Home, ItemDetail, OrderConfirmed)

function taskDef(a) {
  return TASK_SETS[a.set][a.task]
}

export function recordStartTap({ time, source }) {
  const a = activeAttempt()
  if (!a || !run || run.startTap != null) return
  run.startTap = time
  a.startTapSource = source
  save()
}

// t0 = timestamp of the first frame that draws Home after Start (called from
// requestAnimationFrame scheduled in Home's layout effect).
export function recordHomeFrame(frameTime) {
  const a = activeAttempt()
  if (!a || !run || run.startTap == null || run.t0 != null) return
  run.t0 = frameTime
  a.t0 = 0
  a.readyShownMs = round(run.readyShown - frameTime)
  a.startTapMs = round(run.startTap - frameTime)
  a.lastEventMs = 0
  // Events logged before t0 (Ready taps, the Start tap) get their ms now.
  for (const { event, time } of run.preT0) event.ms = round(time - frameTime)
  run.preT0 = []
  const cap = taskDef(a).timeCapSeconds * 1000
  run.deadline = frameTime + cap
  run.timer = setTimeout(onTimer, Math.max(0, run.deadline - performance.now()))
  save()
}

function stopTimer() {
  if (run && run.timer) clearTimeout(run.timer)
  if (run) run.timer = null
}

function onTimer() {
  const a = activeAttempt()
  if (!a || !run || a.result) return
  run.timerFired = performance.now()
  // A press may be in progress (e.g. on Add to cart) that started before the
  // deadline: wait for its release and click, then decide by timestamp.
  if (pointerIsDown) {
    run.pendingTimeout = true
    afterPointerUp.push(finishTimeout)
    return
  }
  finishTimeout()
}

function endAttempt(a, endTime) {
  const p = participant()
  logEvent('task_end', { ...a.result }, endTime, null, false)
  a.endedAt = new Date().toISOString()
  stopTimer()
  a.measures = computeMeasures(a, p.events)
  recomputeCounted(p)
}

function finishTimeout() {
  const a = activeAttempt()
  if (!a || !run || a.result) return
  const cap = taskDef(a).timeCapSeconds * 1000
  a.result = emptyResult('time_limit')
  a.result.success = false
  a.result.censored = true
  a.result.timeMs = cap
  a.result.endTimeSource = 'time_limit'
  a.result.timerFiredMs = run.timerFired != null ? round(run.timerFired - run.t0) : null
  a.result.lastEventMs = a.lastEventMs
  endAttempt(a, run.deadline)
  state.showWait = true
  save()
  emit()
}

// Shared end-of-task decision. endTime <= deadline → completed; otherwise
// the attempt is a timeout (a late timer never turns a late completion into
// a success).
function finishCompleted(a, endTime, source, fill) {
  if (!run || run.t0 == null || a.result) return
  if (endTime > run.deadline) {
    if (run.timerFired == null) run.timerFired = performance.now()
    finishTimeout()
    return
  }
  a.result = emptyResult(source === 'frame' ? 'order_confirmed' : 'add_to_cart')
  fill(a.result)
  a.result.timeMs = round(endTime - run.t0)
  a.result.censored = false
  a.result.endTimeSource = source
  a.result.timerFiredMs = run.timerFired != null ? round(run.timerFired - run.t0) : null
  a.result.raceResolved = run.timerFired != null
  if (a.lastEventMs == null || a.result.timeMs > a.lastEventMs) a.lastEventMs = a.result.timeMs
  a.result.lastEventMs = a.lastEventMs
  endAttempt(a, endTime)
  save()
  emit()
}

// T1 / T2 end at the first Add to cart (CLAUDE.md section 2).
export function recordAddToCart(itemId, { time, source }) {
  const a = activeAttempt()
  if (!a || a.task === 'T3') return
  const def = taskDef(a)
  finishCompleted(a, time, source, (r) => {
    r.itemId = itemId
    r.correct = def.correctItemIds.includes(itemId)
    r.success = r.correct
    r.decisionError = !r.correct
  })
}

// T3 ends when Order confirmed first appears (its first drawn frame).
export function recordOrderConfirmedFrame(frameTime, items, subtotal, total) {
  const a = activeAttempt()
  if (!a || a.task !== 'T3') return
  const def = taskDef(a)
  const ids = items.map((item) => item.id)
  finishCompleted(a, frameTime, 'frame', (r) => {
    r.orderedItemIds = ids
    r.orderSubtotal = subtotal
    r.orderTotal = total
    r.success = ids.length === def.correctItemIds.length && def.correctItemIds.every((id) => ids.includes(id))
  })
}

init()

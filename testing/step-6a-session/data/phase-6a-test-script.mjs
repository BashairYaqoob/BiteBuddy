// Phase 6a checks with real pointer input via CDP. node s6a_test.mjs <baseUrl> <outDir> [skipLong]
import { writeFileSync, mkdirSync } from 'node:fs'
const [base, outDir, skipLong] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const t = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const p = new Map(); const ls = []; const errors = []
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } ls.forEach(l => l(m)); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' ')) })
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(x.slice(0, 80) + ' -> ' + r.result.exceptionDetails.exception?.description); return r.result.result.value }
const wait = (ms) => new Promise(r => setTimeout(r, ms))
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
const go = async (url) => { const l = new Promise(r => { const f = (m) => { if (m.method === 'Page.loadEventFired') { ls.splice(ls.indexOf(f), 1); r() } }; ls.push(f) }); await send('Page.navigate', { url }); await l; await ev('document.fonts.ready.then(() => 1)'); await wait(400) }
const reload = async () => { const l = new Promise(r => { const f = (m) => { if (m.method === 'Page.loadEventFired') { ls.splice(ls.indexOf(f), 1); r() } }; ls.push(f) }); await send('Page.reload'); await l; await wait(500) }
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${outDir}/${name}.png`, Buffer.from(r.result.data, 'base64')) }
const store = () => ev(`JSON.parse(localStorage.getItem('bitebuddy-study-v1') || 'null')`)
// Find a visible element by selector + text, scroll it into view, return its centre.
const locate = (sel, text) => ev(`(() => { const els = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => ${text ? `e.textContent.replace(/ +/g,' ').trim().includes(${JSON.stringify(text)})` : 'true'});
  const e = els[0]; if (!e) throw new Error('missing ' + ${JSON.stringify(sel + ' ' + (text || ''))}); e.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
const press = (x, y) => send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
const release = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
const tap = async (sel, text, after = 450) => { const c = await locate(sel, text); await wait(80); await press(c.x, c.y); await wait(40); await release(c.x, c.y); await wait(after) }
const btn = (text, after) => tap('button', text, after)
const hold = async () => { await press(386, 4); await wait(3300); await release(386, 4); await wait(500) }
const attempt = async (aid) => { const s = await store(); for (const pp of Object.values(s.participants)) { const a = pp.attempts.find(x => x.attemptId === aid); if (a) return a } return null }
const checks = []; const ok = (name, cond, detail) => { checks.push({ name, pass: !!cond, detail }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail) : ''}`) }

const openP = async (code, cond) => { await tap('input', null, 100); await ev(`(() => { const i = document.querySelector('input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(code)}); i.dispatchEvent(new Event('input', { bubbles: true })); const s = document.querySelector('select'); const ss = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; ss.call(s, ${JSON.stringify(cond)}); s.dispatchEvent(new Event('change', { bubbles: true })); return 1 })()`); await wait(100); await btn('Open participant') }
const choose = async (block, task) => { await ev(`(() => { const [b, t] = document.querySelectorAll('select'); const ss = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; ss.call(b, '${block}'); b.dispatchEvent(new Event('change', { bubbles: true })); return 1 })()`); await wait(100); await ev(`(() => { const [b, t] = document.querySelectorAll('select'); const ss = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; ss.call(t, '${task}'); t.dispatchEvent(new Event('change', { bubbles: true })); return 1 })()`); await wait(100) }
const theme = () => ev(`document.querySelector('.app-frame')?.getAttribute('data-theme') ?? null`)
const card = (name) => tap('.food-card', name)
const menuChip = (name) => tap('.menu-screen__category-chips .chip', name, 900)

// ---------------------------------------------------------------- fresh start
await go(base); await ev('localStorage.clear(), 1'); await reload()
ok('Opens on moderator setup (no app frame)', await ev(`!!document.querySelector('.moderator') && !document.querySelector('.app-frame')`))
await openP('P90', 'C1')
const setupText = await ev(`document.querySelector('.moderator').innerText`)
ok('Setup shows Design 1 / Design 2 and task sets', /Block 1: Design 1, Task set 1/.test(setupText) && /Block 2: Design 2, Task set 2/.test(setupText))
ok('Setup shows no prototype letter or "prototype"/"theme" wording', !/\b(Prototype|prototype|theme|Theme|complex|simple)\b/.test(setupText) && !/\b[AB]\b/.test(setupText.replace(/\bC[1-4]\b/g, '')), setupText.match(/\b[AB]\b/g))
ok('Suggested task is Block 1 T1', /Task set 1, T1: “Find the cheapest vegetarian meal under Rs\. 700/.test(setupText))
ok('Page title neutral', (await ev('document.title')) === 'bitebuddy', await ev('document.title'))

// ---------------------------------------------------------------- B1 T1 correct (C1 block 1 = A, set 1)
await btn('Show Ready screen', 600)
ok('Ready shown in block 1 theme (A for C1)', (await theme()) === 'A' && (await ev(`!!document.querySelector('.ready-screen')`)))
await shot('ready-A')
await btn('Start', 700)
let a = await attempt('P90-b1-T1-a1')
ok('t0 recorded from the Home frame, after the Start tap', a.t0 === 0 && a.startTapMs < 0 && a.readyShownMs < a.startTapMs, { startTapMs: a.startTapMs, readyShownMs: a.readyShownMs })
ok('Start tap time taken from pointerdown', a.startTapSource === 'pointerdown')
await btn('Menu'); await menuChip('Rice Bowls'); await card('Chana Pulao Bowl'); await btn('Add to cart', 700)
a = await attempt('P90-b1-T1-a1')
ok('T1 correct item → success, add_to_cart, time from pointerdown', a.result.endReason === 'add_to_cart' && a.result.success === true && a.result.correct === true && a.result.decisionError === false && a.result.itemId === 'M13' && a.result.censored === false && a.result.timeMs > 0 && a.result.endTimeSource === 'pointerdown', a.result)
ok('Panel still shown after task end (decision 2)', await ev(`!!document.querySelector('.added-panel')`))
ok('Counted by default', a.counted === true && a.countedBy === 'default')
await hold()
ok('3 s hold top-right returns to setup', await ev(`!!document.querySelector('.moderator')`))
a = await attempt('P90-b1-T1-a1')
ok('Ended attempt unchanged by returning to setup', a.result.endReason === 'add_to_cart')
ok('Suggestion advanced to Block 1 T2', /Task set 1, T2:/.test(await ev(`document.querySelector('.moderator').innerText`)))

// ---------------------------------------------------------------- B1 T2 wrong item
await btn('Show Ready screen', 600); await btn('Start', 700)
await btn('Menu'); await card('Crispy Chicken Burger'); await btn('Add to cart', 700)
a = await attempt('P90-b1-T2-a1')
ok('T2 wrong item → failure, decision error', a.result.endReason === 'add_to_cart' && a.result.success === false && a.result.correct === false && a.result.decisionError === true && a.result.itemId === 'M01', a.result)
// a second Add to cart after the end does not change the result
await btn('Back to menu'); await card('Grilled Chicken Burger'); await btn('Add to cart', 700)
a = await attempt('P90-b1-T2-a1')
ok('Later Add to cart does not change a frozen result', a.result.itemId === 'M01' && a.result.success === false)
await hold()

// ---------------------------------------------------------------- B1 T3 (A, set 1) → Rs. 1,360
const runT3 = async (pizza, drink) => {
  await btn('Show Ready screen', 600); await btn('Start', 700)
  await btn('Menu'); await menuChip('Pizza'); await card(pizza); await btn('Add to cart'); await btn('Back to menu')
  await menuChip('Drinks'); await card(drink); await btn('Add to cart'); await btn('View cart'); await btn('Checkout'); await btn('Place order', 900)
}
await runT3('Veggie Supreme Pizza', 'Mango Lassi')
a = await attempt('P90-b1-T3-a1')
ok('T3 set 1 in A → order_confirmed, success, Rs. 1,210 / 1,360', a.result.endReason === 'order_confirmed' && a.result.success === true && a.result.orderSubtotal === 1210 && a.result.orderTotal === 1360 && a.result.endTimeSource === 'frame' && a.prototype === 'A', a.result)
await hold()

// ---------------------------------------------------------------- B2 T3 (B, set 2) → Rs. 1,480
await choose(2, 'T3'); await runT3('Chicken Fajita Pizza', 'Mint Lemonade')
a = await attempt('P90-b2-T3-a1')
ok('T3 set 2 in B → order_confirmed, success, Rs. 1,330 / 1,480', a.result.success === true && a.result.orderSubtotal === 1330 && a.result.orderTotal === 1480 && a.prototype === 'B' && a.set === 'set2', a.result)
ok('Block 2 theme is B for C1', (await theme()) === 'B')
await hold()

// ---------------------------------------------------------------- abandoned, interrupted, new attempt id
await choose(2, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700); await btn('Menu'); await hold()
a = await attempt('P90-b2-T1-a1')
ok('Leaving a running attempt → abandoned, success/timeMs null', a.result.endReason === 'abandoned' && a.result.success === null && a.result.timeMs === null && a.result.censored === false && a.result.lastEventMs > 0 && a.counted === false, a.result)
await choose(2, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700); await btn('Menu')
const before = await attempt('P90-b2-T1-a2')
ok('Second attempt gets a new id (a2) and is open', before && before.result === null)
await reload()
ok('After reload: setup shown, not the task', await ev(`!!document.querySelector('.moderator') && !document.querySelector('.app-frame')`))
a = await attempt('P90-b2-T1-a2')
ok('Unfinished attempt closed as interrupted, last known time kept', a.result.endReason === 'interrupted' && a.result.success === null && a.result.timeMs === null && a.result.lastEventMs === 0 && a.counted === false, a.result)
const s1 = await store()
ok('Earlier attempts survive the reload unchanged', s1.participants.P90.attempts.filter(x => x.result && x.result.endReason !== 'interrupted' && x.result.endReason !== 'abandoned').length === 4)
await openP('P90', 'C2')
ok('Re-opening P90 with a different condition is refused', /already exists with condition C1/.test(await ev(`document.querySelector('.moderator').innerText`)))
await openP('P90', 'C1')
await choose(2, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700)
await btn('Menu'); await menuChip('Wraps'); await card('Spicy Chicken Wrap'); await btn('Add to cart', 700)
a = await attempt('P90-b2-T1-a3')
ok('Re-run after reload → new attempt a3, set 2 T1 correct (Spicy Chicken Wrap), counted by default', a && a.result.success === true && a.result.itemId === 'M07' && a.counted === true, a && a.result)
await hold()

// ---------------------------------------------------------------- moderator counted override (logged)
await ev(`(() => { const pair = [...document.querySelectorAll('.moderator__pair')].find(d => d.querySelector('h3').textContent.startsWith('Block 2 · T1')); [...pair.querySelectorAll('button')].find(b => b.textContent === 'None counted').click(); return 1 })()`); await wait(300)
let s2 = await store()
let b2t1 = s2.participants.P90.attempts.filter(x => x.block === 2 && x.task === 'T1')
ok('"None counted" → no counted attempt, countedBy moderator, history logged', b2t1.every(x => !x.counted && x.countedBy === 'moderator') && s2.participants.P90.countedHistory.at(-1).from === 'P90-b2-T1-a3' && s2.participants.P90.countedHistory.at(-1).to === null, s2.participants.P90.countedHistory.at(-1))
await ev(`(() => { const pair = [...document.querySelectorAll('.moderator__pair')].find(d => d.querySelector('h3').textContent.startsWith('Block 2 · T1')); [...pair.querySelectorAll('button')].find(b => b.textContent === 'Back to default').click(); return 1 })()`); await wait(300)
s2 = await store(); b2t1 = s2.participants.P90.attempts.filter(x => x.block === 2 && x.task === 'T1')
ok('"Back to default" → a3 counted again (default), history has 2 entries', b2t1.find(x => x.counted)?.attemptId === 'P90-b2-T1-a3' && b2t1.every(x => x.countedBy === 'default') && s2.participants.P90.countedHistory.length === 2)
ok('Abandoned/interrupted attempts offer no "Count this one"', await ev(`(() => { const pair = [...document.querySelectorAll('.moderator__pair')].find(d => d.querySelector('h3').textContent.startsWith('Block 2 · T1')); return [...pair.querySelectorAll('.moderator__attempt')].map(r => r.querySelectorAll('button').length).join(',') })()`) === '0,0,0')
await btn('Change participant')

// ---------------------------------------------------------------- C3: block 1 B set 1 / block 2 A set 2, both T3
await openP('P91', 'C3')
await choose(1, 'T3'); await runT3('Veggie Supreme Pizza', 'Mango Lassi')
a = await attempt('P91-b1-T3-a1')
ok('T3 set 1 in B → Rs. 1,360', a.prototype === 'B' && a.result.success && a.result.orderTotal === 1360)
await shot('ready-B-check'); await hold()
await choose(2, 'T3'); await runT3('Chicken Fajita Pizza', 'Mint Lemonade')
a = await attempt('P91-b2-T3-a1')
ok('T3 set 2 in A → Rs. 1,480', a.prototype === 'A' && a.result.success && a.result.orderTotal === 1480)
await hold()
// Ready in B for comparison
await choose(1, 'T1'); await btn('Show Ready screen', 600); await shot('ready-B'); await hold()

// ---------------------------------------------------------------- time limits (real waits)
if (!skipLong) {
  // T1 in B (C3 block 1): 120 s
  await choose(1, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700); await btn('Menu')
  await wait(121500)
  a = await attempt('P91-b1-T1-a2')
  ok('T1 at 120 s → time_limit, censored, timeMs exactly 120000, success false', a.result.endReason === 'time_limit' && a.result.censored === true && a.result.timeMs === 120000 && a.result.success === false && a.result.timerFiredMs >= 120000 && a.result.timerFiredMs < 120200, a.result)
  ok('Wait screen shown with the neutral message', (await ev(`document.querySelector('.ready-screen__message')?.textContent`)) === 'Please wait for the moderator.' && !(await ev(`!!document.querySelector('button')`)))
  ok('Timed-out attempt counted by default (decision 7)', a.counted === true)
  await shot('wait-B'); await hold()
  // T3 in A (C3 block 2): 180 s
  await choose(2, 'T3'); await btn('Show Ready screen', 600); await btn('Start', 700)
  await wait(181500)
  a = await attempt('P91-b2-T3-a2')
  ok('T3 at 180 s → time_limit, censored, timeMs exactly 180000', a.result.endReason === 'time_limit' && a.result.censored === true && a.result.timeMs === 180000 && a.result.success === false, a.result)
  await shot('wait-A'); ok('Wait screen theme frame is A', (await theme()) === 'A'); await hold()
  // Race: press Add to cart 300 ms before the deadline, release 400 ms after it.
  await choose(2, 'T1'); await btn('Show Ready screen', 600)
  await ev(`window.__startDown = null; document.addEventListener('pointerdown', e => { if (window.__startDown === null) window.__startDown = e.timeStamp }, { capture: true, once: true }); 1`)
  await btn('Start', 700)
  a = await attempt('P91-b2-T1-a1')
  const t0perf = (await ev('window.__startDown')) - a.startTapMs
  await btn('Menu'); await menuChip('Wraps'); await card('Spicy Chicken Wrap')
  const c = await locate('button', 'Add to cart')
  await ev(`new Promise(r => { const target = ${t0perf} + 120000 - 300; const f = () => performance.now() >= target ? r(1) : setTimeout(f, 5); f() })`)
  await press(c.x, c.y)
  await ev(`new Promise(r => { const target = ${t0perf} + 120000 + 400; const f = () => performance.now() >= target ? r(1) : setTimeout(f, 5); f() })`)
  await release(c.x, c.y); await wait(600)
  a = await attempt('P91-b2-T1-a1')
  ok('Race: press before the limit, release after → completed by timestamp, raceResolved', a.result.endReason === 'add_to_cart' && a.result.success === true && a.result.timeMs <= 120000 && a.result.timeMs > 119500 && a.result.raceResolved === true && a.result.censored === false, a.result)
  ok('Race: participant sees the panel, not the wait screen', await ev(`!!document.querySelector('.added-panel')`))
  await hold()
}

ok('No console errors', errors.length === 0, errors)
writeFileSync(`${outDir}/store.json`, JSON.stringify(await store(), null, 1))
writeFileSync(`${outDir}/checks.json`, JSON.stringify(checks, null, 1))
console.log(`\n${checks.filter(c => c.pass).length} / ${checks.length} passed`)
ws.close(); process.exit(0)

// Phase 6b checks: event log, measures, export. Real pointer input via CDP.
// node s6b_test.mjs <base> <outDir> [skipLong]
import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs'
const [base, outDir, skipLong] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const dlDir = `${outDir}/download`; rmSync(dlDir, { recursive: true, force: true }); mkdirSync(dlDir, { recursive: true })
const t = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const p = new Map(); const ls = []; const errors = []
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } ls.forEach(l => l(m)); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' ')) })
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(x.slice(0, 90) + ' -> ' + r.result.exceptionDetails.exception?.description); return r.result.result.value }
const wait = (ms) => new Promise(r => setTimeout(r, ms))
await send('Page.enable'); await send('Runtime.enable')
await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dlDir.replace(/\//g, '\\') })
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
const loaded = () => new Promise(r => { const f = (m) => { if (m.method === 'Page.loadEventFired') { ls.splice(ls.indexOf(f), 1); r() } }; ls.push(f) })
const go = async (url) => { const l = loaded(); await send('Page.navigate', { url }); await l; await ev('document.fonts.ready.then(() => 1)'); await wait(400) }
const reload = async () => { const l = loaded(); await send('Page.reload'); await l; await wait(600) }
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${outDir}/${name}.png`, Buffer.from(r.result.data, 'base64')) }
const store = async () => { await wait(1150); return JSON.parse(await ev(`localStorage.getItem('bitebuddy-study-v1')`)) }
const locate = (sel, text, scroll = true) => locate0(sel, text, scroll).catch(async (err) => { await shot('FAIL-' + sel.replace(/[^a-z]/gi, '')); console.log('screen at failure:', await ev(`document.querySelector('.app-frame, .moderator')?.innerText.slice(0, 300)`)); throw err })
const locate0 = (sel, text, scroll = true) => ev(`(() => { const els = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => ${text ? `e.textContent.replace(/\\s+/g,' ').trim().includes(${JSON.stringify(text)})` : 'true'});
  const e = els[0]; if (!e) throw new Error('missing ' + ${JSON.stringify(sel + ' ' + (text || ''))}); ${scroll ? "e.scrollIntoView({ block: 'center', behavior: 'instant' });" : ''} const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, ...extra })
const tapAt = async (x, y, after = 450) => { await mouse('mousePressed', x, y); await wait(40); await mouse('mouseReleased', x, y); await wait(after) }
const tap = async (sel, text, after = 450, scroll = true) => { const c = await locate(sel, text, scroll); await wait(80); await tapAt(c.x, c.y, after) }
const btn = (text, after) => tap('button', text, after)
const card = (name) => tap('.food-card', name)
const chip = (name) => tap('.menu-screen__category-chips .chip', name, 900)
const hold = async () => { await mouse('mousePressed', 386, 4); await wait(3300); await mouse('mouseReleased', 386, 4); await wait(500) }
const wheel = async (n, dy, gap) => { for (let i = 0; i < n; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 195, y: 500, deltaX: 0, deltaY: dy }); await wait(gap) } await wait(400) }
const setVal = (sel, i, v) => ev(`(() => { const el = document.querySelectorAll('${sel}')[${i}]; const proto = el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLSelectElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(v)}); el.dispatchEvent(new Event(el.tagName === 'INPUT' ? 'input' : 'change', { bubbles: true })); return 1 })()`)
const openP = async (code, cond) => { await setVal('input', 0, code); await setVal('select', 0, cond); await wait(100); await btn('Open participant') }
const choose = async (block, task) => { await setVal('select', 0, String(block)); await wait(120); await setVal('select', 1, task); await wait(120) }
const checks = []; const ok = (name, cond, detail) => { checks.push({ name, pass: !!cond, detail }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail !== undefined ? '  ' + JSON.stringify(detail).slice(0, 600) : ''}`) }
const eventsOf = async (aid) => (await store()).participants[aid.split('-')[0]].events.filter(e => e.attemptId === aid)
const attemptOf = async (aid) => (await store()).participants[aid.split('-')[0]].attempts.find(a => a.attemptId === aid)
const core = (evs) => evs.filter(e => !['scroll', 'item_visibility'].includes(e.type)).map(e => [e.type, e.screen, e.data.targetId || e.data.to || e.data.itemId || e.data.category || '', e.afterEnd].join('|'))

await go(base); await ev(`(async () => { (await import('/src/state/sessionStore.js')).clearStoredData(); return 1 })()`); await reload()

// ===================================================== 1. P80 (C1) block 1 T1 in A, set 1: a scripted path
let swipeScreen = null
const runT1Path = async () => {
  await btn('Show Ready screen', 600)
  await btn('Start', 700)
  await tap('.home-screen h2', 'Categories', 300, false) // dead tap on the Categories heading
  await btn('Menu', 600) // nav tab (not relevant)
  // swipe on the menu list (movement > 10 px): not a tap
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
  const tp = (x, y) => [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }]
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(195, 600) })
  for (let k = 1; k <= 12; k++) { await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: tp(195, 600 - k * 10) }); await wait(16) }
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await wait(500)
  await send('Emulation.setTouchEmulationEnabled', { enabled: false })
  swipeScreen = await ev(`document.querySelector('.menu-screen') ? 'menu' : 'other'`)
  // small movement (8 px): still a tap — on the Menu title (dead)
  const title = await locate('.menu-screen .top-bar__title', null, false)
  await mouse('mousePressed', title.x, title.y); await mouse('mouseMoved', title.x + 8, title.y, { buttons: 1 }); await mouse('mouseReleased', title.x + 8, title.y); await wait(300)
  await tap('.menu-screen__diet-filters .chip', 'Vegetarian', 600) // relevant (T1 set 1)
  await wheel(8, 120, 30) // scroll samples
  await chip('Rice Bowls')
  await card('Chana Pulao Bowl')
  await tap('.top-bar__back', null, 600) // back
  await card('Chana Pulao Bowl')
  await btn('Add to cart', 700) // task end
  await btn('View cart', 600) // after end
}
await openP('P80', 'C1')
await runT1Path()
let A1 = await attemptOf('P80-b1-T1-a1')
let E1 = await eventsOf('P80-b1-T1-a1')
writeFileSync(`${outDir}/events-P80-b1-T1-a1.json`, JSON.stringify(E1, null, 1))
const taps1 = E1.filter(e => e.type === 'tap')
const startTap = taps1.find(e => e.data.targetId === 'btn-start')
ok('Start tap logged with a negative ms (converted once t0 was known)', startTap && startTap.ms < 0 && Math.abs(startTap.ms - A1.startTapMs) < 0.2, { tapMs: startTap && startTap.ms, startTapMs: A1.startTapMs })
ok('Every event has seq, attemptId, ms, afterEnd, screen, type, data', E1.every(e => ['seq', 'attemptId', 'ms', 'afterEnd', 'screen', 'type', 'data'].every(k => k in e)) && E1.every(e => typeof e.ms === 'number'))
ok('seq strictly increasing', E1.every((e, i) => i === 0 || e.seq > E1[i - 1].seq))
ok('Touch swipe (60 px) is not a tap and opens nothing; 8 px movement is a tap (dead, on the Menu title)', swipeScreen === 'menu' && !taps1.some(e => e.data.y > 520 && e.data.y < 610 && e.data.x === 195) && taps1.some(e => e.data.role === 'dead' && e.data.targetId.startsWith('dead:top-bar')), taps1.map(e => e.data.targetId))
const nav = taps1.find(e => e.data.targetId === 'nav-menu')
ok('Menu nav tab is an interactive, not relevant, tap', nav && nav.data.role === 'interactive' && nav.data.relevant === false)
const firstRel = taps1.find(e => e.data.relevant)
ok('First relevant tap = Vegetarian filter (T1 Set 1)', firstRel && firstRel.data.targetId === 'filter-veg')
const filt = E1.find(e => e.type === 'filter')
ok('filter event: all → veg', filt && filt.data.from === 'all' && filt.data.to === 'veg' && filt.screen === 'Menu:all', filt && filt.data)
ok('chip_scroll Rice Bowls logged, and its tap is relevant (category, T1)', E1.some(e => e.type === 'chip_scroll' && e.data.category === 'Rice Bowls') && taps1.some(e => e.data.targetId === 'chip-rice-bowls' && e.data.relevant))
const opens = E1.filter(e => e.type === 'open_item')
ok('open_item ×2 for M13 (first from Menu:veg; second from Menu:all, because Back re-opens the Menu with its default filter)', opens.length === 2 && opens[0].data.fromScreen === 'Menu:veg' && opens[1].data.fromScreen === 'Menu:all' && opens.every(e => e.data.itemId === 'M13'), opens.map(e => e.data))
const backs = E1.filter(e => e.type === 'back')
ok('back event ItemDetail:M13 → Menu:all (as displayed)', backs.length === 1 && backs[0].data.from === 'ItemDetail:M13' && backs[0].data.to === 'Menu:all', backs.map(e => e.data))
const add = E1.find(e => e.type === 'add_to_cart'); const pOpen = E1.find(e => e.type === 'panel_open'); const tEnd = E1.find(e => e.type === 'task_end')
ok('add_to_cart (M13, correct) and panel_open not afterEnd; task_end follows with the result', add && add.data.itemId === 'M13' && add.data.correct === true && !add.afterEnd && pOpen && !pOpen.afterEnd && tEnd && tEnd.data.endReason === 'add_to_cart' && tEnd.seq > add.seq && Math.abs(tEnd.ms - A1.result.timeMs) < 0.2)
ok('add_to_cart time = the Add to cart pointer down (= result timeMs)', Math.abs(add.ms - A1.result.timeMs) < 0.2, { add: add.ms, timeMs: A1.result.timeMs })
const vc = E1.find(e => e.type === 'view_cart'); const pc = E1.find(e => e.type === 'panel_close')
ok('After the end: view_cart and panel_close (cause view_cart) are afterEnd', vc && vc.afterEnd && pc && pc.afterEnd && pc.data.cause === 'view_cart')
const sc = E1.filter(e => e.type === 'scroll' && e.screen === 'Menu:veg')
const moving = sc.filter(e => !e.data.final)
const gaps = moving.slice(1).map((e, i) => e.ms - moving[i].ms)
ok('Scroll samples: ≥ 100 ms apart while moving, plus final samples', moving.length >= 2 && gaps.every(g => g >= 99.9) && sc.some(e => e.data.final), { samples: moving.length, minGap: Math.min(...gaps), finals: sc.filter(e => e.data.final).length })
const vis = E1.filter(e => e.type === 'item_visibility')
ok('item_visibility: enter/exit at both levels', ['any', 'full'].every(l => vis.some(e => e.data.level === l && e.data.state === 'enter') && vis.some(e => e.data.level === l && e.data.state === 'exit')), { n: vis.length })
ok('Home featured cards observed (enter events on Home)', vis.some(e => e.screen === 'Home' && e.data.itemId === 'M14' && e.data.state === 'enter'))
ok('Filter change removes non-veg cards → exit with reason "removed"', vis.some(e => e.data.reason === 'removed' && e.data.itemId === 'M01'))
const m1 = A1.measures
const expTaps = taps1.filter(e => e.ms >= 0 && e.ms <= A1.result.timeMs && !e.afterEnd)
ok('Measures: firstRelevantTapMs observed = Vegetarian tap; counts match the events', m1 && m1.firstRelevantTapStatus === 'observed' && m1.firstRelevantTapCensored === false && m1.firstRelevantTapMs === firstRel.ms && m1.firstRelevantTapTarget === 'filter-veg' && m1.tapCount === expTaps.length && m1.deadTapCount === expTaps.filter(e => e.data.role === 'dead').length && m1.backCount === 1, m1)
ok('Start tap (before t0) excluded from tapCount', !expTaps.includes(startTap))
await hold()
ok('Hold (3 s) in the corner is not logged as a tap', !(await eventsOf('P80-b1-T1-a1')).some(e => e.type === 'tap' && e.data.x >= 346 && e.data.y <= 44))

// ===================================================== 2. T2 with no relevant tap before the (wrong) end
await choose(1, 'T2'); await btn('Show Ready screen', 600); await btn('Start', 700)
await tapAt(386, 4, 300) // short tap in the hold corner → dead tap
await btn('Menu', 600); await chip('Wraps'); await card('Falafel Wrap'); await btn('Add to cart', 700)
let A2 = await attemptOf('P80-b1-T2-a1'); let E2 = await eventsOf('P80-b1-T2-a1')
ok('Short tap in the hold corner → dead tap', E2.some(e => e.type === 'tap' && e.data.role === 'dead' && e.data.x >= 346 && e.data.y <= 44))
ok('T2 Set 1 via Wraps → Falafel: no relevant tap → status none_before_end, value null, decision error', A2.measures.firstRelevantTapStatus === 'none_before_end' && A2.measures.firstRelevantTapMs === null && A2.result.decisionError === true && E2.find(e => e.type === 'add_to_cart').data.correct === false, A2.measures)
await hold()

// ===================================================== 3. T3 via Home Pizza tile
await choose(1, 'T3'); await btn('Show Ready screen', 600); await btn('Start', 700)
await tap('.category-tile', 'Pizza', 900)
await card('Veggie Supreme Pizza'); await btn('Add to cart'); await btn('Back to menu')
await chip('Drinks'); await card('Mango Lassi'); await btn('Add to cart'); await btn('View cart'); await btn('Checkout'); await btn('Place order', 900)
let A3 = await attemptOf('P80-b1-T3-a1'); let E3 = await eventsOf('P80-b1-T3-a1')
ok('T3: tile_scroll Pizza; first relevant tap = Pizza tile', E3.some(e => e.type === 'tile_scroll' && e.data.category === 'Pizza') && A3.measures.firstRelevantTapTarget === 'tile-pizza', A3.measures)
ok('T3: panel_close causes back_to_menu then view_cart; checkout and place_order logged before task_end', (() => { const pcs = E3.filter(e => e.type === 'panel_close').map(e => e.data.cause); const end = E3.find(e => e.type === 'task_end'); return pcs.join() === 'back_to_menu,view_cart' && E3.find(e => e.type === 'checkout').seq < end.seq && E3.find(e => e.type === 'place_order').seq < end.seq && !E3.find(e => e.type === 'place_order').afterEnd })(), E3.filter(e => e.type === 'panel_close').map(e => e.data))
ok('T3: add_to_cart correct flags (M10 true, D01 true) and total Rs. 1,360', E3.filter(e => e.type === 'add_to_cart').every(e => e.data.correct === true) && A3.result.orderTotal === 1360)
const navs = E3.filter(e => e.type === 'navigate').map(e => `${e.data.from}>${e.data.to}:${e.data.cause}`)
ok('navigate events carry from, to and cause', navs.includes('Home>Menu:all:tile-pizza') && navs.some(n => n.startsWith('ItemDetail:M10+panel>Menu:all:btn-back-to-menu')) && navs.some(n => n.includes('>OrderConfirmed:btn-place-order')), navs)
await hold()

// ===================================================== 4. Abandoned and interrupted
await choose(2, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700); await btn('Menu', 600); await hold()
let A4 = await attemptOf('P80-b2-T1-a1')
const S4 = await store()
ok('Abandoned: measures status not_applicable; attempt_closed event logged', A4.measures && A4.measures.firstRelevantTapStatus === 'not_applicable' && S4.participants.P80.events.some(e => e.type === 'attempt_closed' && e.attemptId === 'P80-b2-T1-a1' && e.data.reason === 'abandoned'), A4.measures)
await choose(2, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 700); await btn('Menu', 600); await tap('.menu-screen__diet-filters .chip', 'Non-vegetarian', 600)
await wait(1300) // let the 1 s batch save run
const beforeReload = (await store()).participants.P80.events.filter(e => e.attemptId === 'P80-b2-T1-a2').length
await reload()
const S5 = await store()
const E5 = S5.participants.P80.events.filter(e => e.attemptId === 'P80-b2-T1-a2')
ok('Interrupted: events saved before the reload survive; attempt_closed (interrupted) logged', E5.length >= beforeReload && E5.some(e => e.type === 'tap' && e.data.targetId === 'filter-nonveg') && E5.some(e => e.type === 'attempt_closed' && e.data.reason === 'interrupted'), { before: beforeReload, after: E5.length })
ok('Interrupted attempt measures computed (first relevant = filter-nonveg, status observed)', (() => { const a = S5.participants.P80.attempts.find(x => x.attemptId === 'P80-b2-T1-a2'); return a.result.endReason === 'interrupted' && a.measures.firstRelevantTapTarget === 'filter-nonveg' })())
await openP('P80', 'C1')
// counted override → counted_changed event
await ev(`(() => { const pair = [...document.querySelectorAll('.moderator__pair')].find(d => d.querySelector('h3').textContent.startsWith('Block 1 · T2')); [...pair.querySelectorAll('button')].find(b => b.textContent === 'None counted').click(); return 1 })()`); await wait(300)
const S6 = await store()
ok('counted_changed moderator event logged', S6.participants.P80.events.some(e => e.type === 'counted_changed' && e.data.from === 'P80-b1-T2-a1' && e.data.to === null))

// ===================================================== 5. Time limit with no relevant tap (censored)
if (!skipLong) {
  await choose(2, 'T2'); await btn('Show Ready screen', 600); await btn('Start', 700)
  await tap('.home-screen h2', 'Categories', 300, false) // dead
  await wait(121000)
  const A7 = await attemptOf('P80-b2-T2-a1')
  ok('Time limit, no relevant tap: firstRelevantTapMs = 120000, status censored_time_limit, flagged censored', A7.result.endReason === 'time_limit' && A7.measures.firstRelevantTapMs === 120000 && A7.measures.firstRelevantTapStatus === 'censored_time_limit' && A7.measures.firstRelevantTapCensored === true && A7.measures.firstRelevantTapTarget === null, A7.measures)
  const E7 = await eventsOf('P80-b2-T2-a1')
  ok('task_end at exactly 120000 ms; Wait-screen taps afterEnd', (() => { const te = E7.find(e => e.type === 'task_end'); return te && te.ms === 120000 })())
  await tapAt(200, 400, 300)
  const E7b = await eventsOf('P80-b2-T2-a1')
  ok('Tap on the wait screen → dead, screen "Wait", afterEnd', E7b.some(e => e.type === 'tap' && e.screen === 'Wait' && e.afterEnd && e.data.role === 'dead'))
  await hold()
}

// ===================================================== 6. Export (real download)
await btn('Export P80-session.json', 1500)
const file = `${dlDir}/P80-session.json`
ok('Export downloads P80-session.json', existsSync(file))
if (existsSync(file)) {
  const x = JSON.parse(readFileSync(file, 'utf8'))
  writeFileSync(`${outDir}/P80-session.json`, JSON.stringify(x, null, 1))
  ok('Export: top-level fields', ['schemaVersion', 'exportedAt', 'note', 'definitions', 'session', 'blocks', 'attempts', 'countedHistory', 'events'].every(k => k in x))
  ok('Export: session metadata', x.session.participant === 'P80' && x.session.condition === 'C1' && x.session.device.viewportWidth === 390 && x.session.device.viewportHeight === 844 && !!x.session.device.userAgent && x.session.storage === 'localStorage')
  ok('Export: blocks (C1: Design 1 A set1, Design 2 B set2)', JSON.stringify(x.blocks.map(b => [b.block, b.design, b.prototype, b.set])) === JSON.stringify([[1, 'Design 1', 'A', 'set1'], [2, 'Design 2', 'B', 'set2']]))
  const need = ['attemptId', 'participant', 'condition', 'block', 'design', 'prototype', 'set', 'task', 'attempt', 'counted', 'countedBy', 'startedAt', 'viewportWidth', 'viewportHeight', 'readyShownMs', 'startTapMs', 't0', 'endedAt', 'result', 'measures']
  ok('Export: every attempt has the identity fields, result and measures', x.attempts.every(a => need.every(k => k in a)) && x.attempts.every(a => 'timeMs' in a.result && 'censored' in a.result))
  ok('Export: all attempts and the counted history included', x.attempts.length === (await store()).participants.P80.attempts.length && x.countedHistory.length === 1)
  ok('Export: events only carry the documented fields', x.events.every(e => JSON.stringify(Object.keys(e)) === JSON.stringify(['seq', 'attemptId', 'ms', 'afterEnd', 'screen', 'type', 'data'])))
  ok('Export: no "gaze"/"attention"/"fixation" field names', !/"[^"]*(gaze|fixation|attention)[^"]*"\s*:/i.test(readFileSync(file, 'utf8')))
}

// ===================================================== 7. A/B parity of the log: same path in B (C3 block 1 = B, set 1)
await btn('Change participant'); await openP('P81', 'C3')
await runT1Path()
const EB = await eventsOf('P81-b1-T1-a1'); const EA = E1
ok('Same scripted T1 path in A and B → identical non-scroll/visibility event sequence (type|screen|target|afterEnd)', JSON.stringify(core(EA)) === JSON.stringify(core(EB)), { A: core(EA).length, B: core(EB).length, firstDiff: core(EA).findIndex((v, i) => v !== core(EB)[i]) })
const AB = await attemptOf('P81-b1-T1-a1')
ok('Same path in A and B → same measures except times', ['firstRelevantTapStatus', 'firstRelevantTapTarget', 'tapCount', 'deadTapCount', 'backCount'].every(k => AB.measures[k] === A1.measures[k]), { A: A1.measures, B: AB.measures })
await hold()

// ===================================================== 8. Logging is invisible: session-mode screens equal free-mode screens
await choose(1, 'T1'); await btn('Show Ready screen', 600); await btn('Start', 900); await shot('session-B-home')
await btn('Menu', 900); await shot('session-B-menu'); await hold()

ok('No console errors', errors.length === 0, errors)
writeFileSync(`${outDir}/checks.json`, JSON.stringify(checks, null, 1))
console.log(`\n${checks.filter(c => c.pass).length} / ${checks.length} passed`)
ws.close(); process.exit(0)

// Two tabs on one device: the second tab's save must stop the first tab saving, and warn.
const open = async () => { const t = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json(); const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true })); let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id) } }); const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) }); const ev = async (x) => (await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true })).result.result.value; return { send, ev, ws } }
const wait = (ms) => new Promise(r => setTimeout(r, ms))
const base = process.argv[2]
const a = await open(); await a.send('Page.navigate', { url: base }); await wait(1500)
await a.ev(`(async () => { const m = await import('/src/state/sessionStore.js'); m.clearStoredData(); m.openParticipant('P70', 'C2'); return 1 })()`); await wait(300)
const b = await open(); await b.send('Page.navigate', { url: base }); await wait(1500)
await b.ev(`(async () => { const m = await import('/src/state/sessionStore.js'); m.openParticipant('P71', 'C4'); return 1 })()`); await wait(500)
const warnA = await a.ev(`document.querySelector('.moderator')?.innerText.includes('open in another tab') ?? false`)
const otherA = await a.ev(`(async () => (await import('/src/state/sessionStore.js')).getState().otherTab)()`)
// Tab A tries to save after the warning: stored data must still be tab B's
await a.ev(`(async () => { const m = await import('/src/state/sessionStore.js'); m.openParticipant('P72', 'C1'); return 1 })()`); await wait(300)
const stored = await b.ev(`Object.keys(JSON.parse(localStorage.getItem('bitebuddy-study-v1')).participants).join(',')`)
console.log(`${warnA && otherA ? 'PASS' : 'FAIL'}  Tab A warns and stops saving after tab B saves  ${JSON.stringify({ warnA, otherA })}`)
console.log(`${!stored.includes('P72') ? 'PASS' : 'FAIL'}  Tab A's later change did not overwrite storage  ${JSON.stringify(stored)}`)
await b.ev(`(async () => { (await import('/src/state/sessionStore.js')).clearStoredData(); return 1 })()`)
a.ws.close(); b.ws.close(); process.exit(0)

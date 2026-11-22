import { useState } from 'react'
import { useSession } from '../state/SessionContext'
import {
  COMPLETED_REASONS,
  clearStoredData,
  closeParticipant,
  downloadExport,
  nextTask,
  openParticipant,
  setCounted,
  startAttempt,
} from '../state/sessionStore'
import { CONDITIONS, CONDITION_IDS } from '../data/conditions'
import { TASK_SETS, TASK_ORDER } from '../data/tasks'
import './Setup.css'

// Moderator-only screen (Step 6). Shows "Design 1 / Design 2" and the task
// set, never the prototype letter (decision 6). The participant never uses it.

const SET_LABEL = { set1: 'Task set 1', set2: 'Task set 2' }

function describe(result) {
  if (!result) return 'In progress'
  switch (result.endReason) {
    case 'add_to_cart':
      return `${result.correct ? 'Correct item' : 'Wrong item'} (${result.itemId})`
    case 'order_confirmed':
      return result.success ? 'Correct order' : `Wrong order (${result.orderedItemIds.join(', ')})`
    case 'time_limit':
      return 'Time limit reached (censored)'
    case 'abandoned':
      return 'Abandoned'
    case 'interrupted':
      return 'Interrupted (page reloaded)'
    default:
      return result.endReason
  }
}

const seconds = (ms) => (ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`)

function ParticipantForm({ participants }) {
  const [code, setCode] = useState('')
  const [condition, setCondition] = useState('C1')
  const [error, setError] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    const clean = code.trim().toUpperCase()
    if (!/^P\d{2}$/.test(clean)) {
      setError('Use a code like P01.')
      return
    }
    setError(openParticipant(clean, condition))
  }

  const known = Object.values(participants)

  return (
    <form className="moderator__card" onSubmit={submit}>
      <h2>Participant</h2>
      <label className="moderator__field">
        Code
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="P01" autoComplete="off" />
      </label>
      <label className="moderator__field">
        Condition
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          {CONDITION_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="moderator__error">{error}</p>}
      <button type="submit" className="moderator__button moderator__button--primary">
        Open participant
      </button>
      {known.length > 0 && (
        <p className="moderator__muted">
          Stored: {known.map((p) => `${p.participant} (${p.condition}, ${p.attempts.length} attempts)`).join(' · ')}
        </p>
      )}
    </form>
  )
}

function ParticipantPanel({ p }) {
  const suggested = nextTask(p) || { block: 1, task: 'T1' }
  const [choice, setChoice] = useState(null)
  const selected = choice || suggested
  const blocks = CONDITIONS[p.condition]
  const selectedBlock = blocks.find((b) => b.block === selected.block)
  const wording = TASK_SETS[selectedBlock.set][selected.task].wording

  return (
    <>
      <section className="moderator__card">
        <h2>
          {p.participant} · {p.condition}
        </h2>
        <ul className="moderator__list">
          {blocks.map((b) => (
            <li key={b.block}>
              Block {b.block}: {b.design}, {SET_LABEL[b.set]}
            </li>
          ))}
        </ul>
        <button type="button" className="moderator__button" onClick={() => downloadExport(p.participant)}>
          Export {p.participant}-session.json
        </button>
        <button type="button" className="moderator__button" onClick={closeParticipant}>
          Change participant
        </button>
      </section>

      <section className="moderator__card">
        <h2>Next task</h2>
        <div className="moderator__row">
          <label className="moderator__field">
            Block
            <select
              value={selected.block}
              onChange={(e) => setChoice({ ...selected, block: Number(e.target.value) })}
            >
              {blocks.map((b) => (
                <option key={b.block} value={b.block}>
                  Block {b.block} ({b.design})
                </option>
              ))}
            </select>
          </label>
          <label className="moderator__field">
            Task
            <select value={selected.task} onChange={(e) => setChoice({ ...selected, task: e.target.value })}>
              {TASK_ORDER.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="moderator__wording">
          {SET_LABEL[selectedBlock.set]}, {selected.task}: “{wording}”
        </p>
        <p className="moderator__muted">Read the task aloud and show the card, then show the Ready screen.</p>
        <button
          type="button"
          className="moderator__button moderator__button--primary"
          onClick={() => {
            setChoice(null)
            startAttempt(selected.block, selected.task)
          }}
        >
          Show Ready screen
        </button>
      </section>

      <section className="moderator__card">
        <h2>Attempts</h2>
        {p.attempts.length === 0 && <p className="moderator__muted">None yet.</p>}
        {blocks.map((b) =>
          TASK_ORDER.map((t) => {
            const list = p.attempts.filter((a) => a.block === b.block && a.task === t)
            if (list.length === 0) return null
            const byModerator = list.some((a) => a.countedBy === 'moderator')
            return (
              <div key={`${b.block}-${t}`} className="moderator__pair">
                <h3>
                  Block {b.block} · {t}
                  {byModerator ? ' (moderator choice)' : ''}
                </h3>
                {list.map((a) => {
                  const countable = a.result && COMPLETED_REASONS.includes(a.result.endReason)
                  return (
                    <div key={a.attemptId} className="moderator__attempt">
                      <span>
                        #{a.attempt} · {describe(a.result)} · {seconds(a.result ? a.result.timeMs : null)}
                        {a.counted ? ' · COUNTED' : ''}
                      </span>
                      {countable && !a.counted && (
                        <button type="button" className="moderator__link" onClick={() => setCounted(b.block, t, a.attemptId)}>
                          Count this one
                        </button>
                      )}
                    </div>
                  )
                })}
                <div className="moderator__row">
                  <button type="button" className="moderator__link" onClick={() => setCounted(b.block, t, 'none')}>
                    None counted
                  </button>
                  {byModerator && (
                    <button type="button" className="moderator__link" onClick={() => setCounted(b.block, t, null)}>
                      Back to default
                    </button>
                  )}
                </div>
              </div>
            )
          }),
        )}
      </section>
    </>
  )
}

export default function Setup() {
  const session = useSession()
  const p = session.activeCode ? session.participants[session.activeCode] : null

  const clear = () => {
    if (window.confirm('Delete all stored participant data on this device? Export every participant first.')) clearStoredData()
  }

  return (
    <main className="moderator">
      <h1>Moderator setup</h1>
      {session.otherTab && (
        <p className="moderator__error">
          BiteBuddy is open in another tab or window, so this tab has stopped saving. Export from the tab you were
          using, close the other one, then reload.
        </p>
      )}
      {!session.storageOk && (
        <p className="moderator__error">
          Saving on this device failed. Data is kept in memory only, so a page reload would lose it.
        </p>
      )}
      {p ? <ParticipantPanel key={p.participant} p={p} /> : <ParticipantForm participants={session.participants} />}
      <section className="moderator__card">
        <button type="button" className="moderator__button moderator__button--danger" onClick={clear}>
          Clear stored data
        </button>
      </section>
    </main>
  )
}

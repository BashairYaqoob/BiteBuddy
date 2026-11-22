import './Ready.css'

// Step 6, decision 1: shown when a task reaches its time limit. Neutral and
// identical in both themes: it reuses the Ready screen's fixed styling
// (Ready.css), with no control, so the participant simply waits.
export default function Wait() {
  return (
    <div className="screen ready-screen">
      <div className="screen__scroll ready-screen__content">
        <h1 className="ready-screen__wordmark">
          Bite<span className="ready-screen__wordmark-accent">Buddy</span>
        </h1>
        <p className="ready-screen__message">Please wait for the moderator.</p>
      </div>
    </div>
  )
}

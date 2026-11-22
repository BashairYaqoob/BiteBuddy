import Button from '../components/Button'
import { useNav } from '../state/NavContext'
import { recordStartTap, tapTime } from '../state/sessionStore'
import './Ready.css'

// Identical in both themes (CLAUDE.md section 3, section 6 rule 8). In Figma,
// Start has no interaction; here it moves to Home. Step 6: the Start tap time
// is recorded; t0 itself is the first frame that draws Home (see Home.jsx).
export default function Ready() {
  const { push } = useNav()

  return (
    <div className="screen ready-screen">
      <div className="screen__scroll ready-screen__content">
        <h1 className="ready-screen__wordmark">
          Bite<span className="ready-screen__wordmark-accent">Buddy</span>
        </h1>
        <p className="ready-screen__message">Wait for the moderator, then tap Start.</p>
        <Button
          variant="primary"
          onClick={(event) => {
            recordStartTap(tapTime(event))
            push('Home')
          }}
        >
          Start
        </Button>
      </div>
    </div>
  )
}

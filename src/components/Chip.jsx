import './Chip.css'

export default function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

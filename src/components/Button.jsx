import './Button.css'

export default function Button({ variant = 'primary', children, onClick, type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

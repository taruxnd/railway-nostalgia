import '../styles/glass.css'
import './GlassBackButton.css'

export default function GlassBackButton({ onClick }) {
  return (
    <button
      type="button"
      className="glass-back glass-surface"
      onClick={onClick}
      aria-label="Go back to platform"
    >
      <span className="glass-back__arrow" aria-hidden="true">
        ←
      </span>
      <span className="glass-back__label glass-back__label--desktop">
        Go back to platform
      </span>
      <span className="glass-back__label glass-back__label--mobile">
        Platform
      </span>
    </button>
  )
}

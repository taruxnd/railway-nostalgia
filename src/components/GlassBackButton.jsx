import './GlassBackButton.css'

function IconArrowLeft() {
  return (
    <svg
      className="glass-back__arrow"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M5 12l6-6M5 12l6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function GlassBackButton({ onClick }) {
  return (
    <button
      type="button"
      className="glass-back"
      onClick={onClick}
      aria-label="Go back to platform"
    >
      <IconArrowLeft />
      <span className="glass-back__label glass-back__label--desktop">
        Go back to platform
      </span>
      <span className="glass-back__label glass-back__label--mobile">
        Platform
      </span>
    </button>
  )
}

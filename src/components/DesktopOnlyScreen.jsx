import '../styles/glass.css'
import './DesktopOnlyScreen.css'

function IconLaptop() {
  return (
    <svg
      className="desktop-only__icon"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 18h20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 20h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function DesktopOnlyScreen() {
  return (
    <div className="desktop-only">
      <div className="desktop-only__glow" aria-hidden="true" />
      <div className="desktop-only__panel glass-surface">
        <IconLaptop />
        <p className="desktop-only__brand">Railway Nostalgia</p>
        <h1 className="desktop-only__title">Best on a larger screen</h1>
        <p className="desktop-only__message">
          For the full interactive experience, open this on a desktop or laptop.
        </p>
        <p className="desktop-only__hint">
          Wider view keeps the platform, journeys, and details intact.
        </p>
      </div>
    </div>
  )
}

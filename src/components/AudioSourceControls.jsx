import { IconSpeaker } from './icons/SpeakerIcon'
import '../styles/glass.css'
import './AudioSourceControls.css'

/** Paste the exact YouTube source URL for attribution */
export const SOURCE_URL = 'https://youtu.be/gSOtG9zrUVE?si=UMVncTm4YO8gQjCq'

function IconYouTubePlay() {
  return (
    <svg
      className="audio-controls__icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11 9.5v5l4-2.5-4-2.5z" fill="currentColor" />
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg
      className="audio-controls__icon audio-controls__icon--external"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5M10 14L19 5M15 5h4v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AudioSourceControls({
  isBackgroundSilent,
  onToggleMute,
}) {
  return (
    <div className="audio-controls-cluster" role="group" aria-label="Experience controls">
      <button
        type="button"
        className={`audio-control-pill glass-surface audio-control-pill--mute${isBackgroundSilent ? ' audio-control-pill--muted' : ''}`}
        onClick={onToggleMute}
        aria-label={
          isBackgroundSilent ? 'Unmute background' : 'Mute background'
        }
        aria-pressed={isBackgroundSilent}
      >
        <IconSpeaker
          muted={isBackgroundSilent}
          className="audio-controls__icon"
        />
        <span className="audio-controls__label">
          {isBackgroundSilent ? 'Unmute background' : 'Mute background'}
        </span>
      </button>

      <a
        className="audio-control-pill glass-surface audio-control-pill--credits"
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Audio credits on YouTube (opens in new tab)"
        title="Audio credits"
      >
        <IconYouTubePlay />
        <span className="audio-controls__label">Audio credits</span>
        <IconExternalLink />
      </a>
    </div>
  )
}

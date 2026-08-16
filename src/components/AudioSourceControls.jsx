import { IconSpeaker } from './icons/SpeakerIcon'
import '../styles/glass.css'
import './AudioSourceControls.css'

export default function AudioSourceControls({
  isBackgroundSilent,
  onToggleMute,
  placement = 'inline',
}) {
  return (
    <div
      className={`audio-mute${placement === 'solo' ? ' audio-mute--solo' : ''}`}
      role="group"
      aria-label="Background audio"
    >
      <button
        type="button"
        className={`audio-control-pill glass-surface${isBackgroundSilent ? ' audio-control-pill--muted' : ''}`}
        onClick={onToggleMute}
        aria-label={isBackgroundSilent ? 'Play sound' : 'Mute sound'}
        aria-pressed={!isBackgroundSilent}
      >
        <IconSpeaker
          muted={!isBackgroundSilent}
          className="audio-controls__icon"
        />
        <span className="audio-controls__label">
          {isBackgroundSilent ? 'Play sound' : 'Mute sound'}
        </span>
      </button>
    </div>
  )
}

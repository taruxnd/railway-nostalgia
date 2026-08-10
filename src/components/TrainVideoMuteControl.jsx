import '../styles/glass.css'
import './AudioSourceControls.css'
import './TrainVideoMuteControl.css'
import { IconSpeaker } from './icons/SpeakerIcon'

export default function TrainVideoMuteControl({ isMuted, onToggleMute }) {
  return (
    <div
      className="audio-controls audio-controls--solo glass-surface"
      role="group"
      aria-label="Inside train audio"
    >
      <button
        type="button"
        className={`audio-controls__segment audio-controls__segment--audio audio-controls__segment--full${isMuted ? ' audio-controls__segment--muted' : ''}`}
        onClick={onToggleMute}
        aria-label={
          isMuted ? 'Unmute inside train audio' : 'Mute inside train audio'
        }
        aria-pressed={isMuted}
      >
        <IconSpeaker muted={isMuted} className="audio-controls__icon" />
        <span className="audio-controls__label">Inside train</span>
      </button>
    </div>
  )
}

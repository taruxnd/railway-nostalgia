import { IconTrain } from './icons/TrainIcon'
import '../styles/glass.css'
import './AudioSourceControls.css'
import './ExploreRail.css'

export default function ExploreRail({ onOpenInsideTrain, muteControl }) {
  return (
    <section className="explore-rail" aria-label="Platform actions">
      <div className="explore-rail__row">
        {muteControl}
        <button
          type="button"
          className="audio-control-pill glass-surface"
          onClick={() => onOpenInsideTrain?.()}
        >
          <IconTrain className="audio-controls__icon" />
          <span className="audio-controls__label">Board the Train</span>
        </button>
      </div>
    </section>
  )
}

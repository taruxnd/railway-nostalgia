import '../styles/glass.css'
import './ExperienceCard.css'

export default function ExperienceCard({
  title,
  description,
  asset,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`experience-card glass-surface${active ? ' experience-card--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div className="experience-card__asset">{asset}</div>
      <div className="experience-card__text">
        <span className="experience-card__title">{title}</span>
        <span className="experience-card__description">{description}</span>
      </div>
    </button>
  )
}

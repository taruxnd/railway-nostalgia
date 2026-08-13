import './ExperienceTitle.css'

export default function ExperienceTitle({ variant = 'default' }) {
  return (
    <h1
      className={`experience-title${variant === 'train' ? ' experience-title--train' : ''}`}
    >
      ट्रेन का सफर
    </h1>
  )
}

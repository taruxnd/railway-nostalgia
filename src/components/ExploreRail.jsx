import { useState } from 'react'
import CardAsset from './CardAsset'
import ExperienceCard from './ExperienceCard'
import './ExploreRail.css'

const CARDS = [
  {
    id: 'ticket',
    title: 'Physical Ticket',
    description: 'The little paper pass that made the journey real.',
    assetSrc: '/assets/physicalticket.PNG',
    assetVideo: false,
  },
  {
    id: 'weight',
    title: 'Check Your Weight',
    description: 'Step onto the platform scale before the train arrives.',
    assetSrc: '/assets/machine.png',
    assetVideo: false,
  },
  {
    id: 'train',
    title: 'Enter the Train',
    description: 'Cross the threshold into the compartment and the story.',
    assetSrc: '/assets/insidetrain.MP4',
    assetVideo: true,
  },
]

export default function ExploreRail({
  activeId,
  onActiveIdChange,
  onOpenWeightMachine,
  onOpenInsideTrain,
  onOpenPhysicalTicket,
}) {
  const [internalActiveId, setInternalActiveId] = useState(null)
  const resolvedActiveId = activeId ?? internalActiveId

  const handleCardClick = (card) => {
    if (card.id === 'ticket') {
      onOpenPhysicalTicket?.()
      return
    }

    if (card.id === 'weight') {
      onOpenWeightMachine?.()
      return
    }

    if (card.id === 'train') {
      onOpenInsideTrain?.()
      return
    }

    const next = resolvedActiveId === card.id ? null : card.id
    if (onActiveIdChange) {
      onActiveIdChange(next)
    } else {
      setInternalActiveId(next)
    }
  }

  return (
    <section className="explore-rail" aria-label="Experiences">
      <div className="explore-rail__scroll">
        <div className="explore-rail__cards">
          {CARDS.map((card) => (
            <ExperienceCard
              key={card.id}
              title={card.title}
              description={card.description}
              asset={
                <CardAsset src={card.assetSrc} video={card.assetVideo} />
              }
              active={resolvedActiveId === card.id}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

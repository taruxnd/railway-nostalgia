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
    desktopOnly: true,
  },
  {
    id: 'weight',
    title: 'Check Your Weight',
    description: 'Step onto the platform scale before the train arrives.',
    assetSrc: '/assets/machine.png',
    assetVideo: false,
    desktopOnly: true,
  },
  {
    id: 'train',
    title: 'Enter the Train',
    description: 'Cross the threshold into the compartment and the story.',
    desktopAssetSrc: '/assets/inview%20desktop.mp4',
    mobileAssetSrc: '/assets/mviewmobile.mp4',
    assetVideo: true,
    desktopOnly: false,
  },
]

export default function ExploreRail({
  isMobile = false,
  activeId,
  onActiveIdChange,
  onOpenWeightMachine,
  onOpenInsideTrain,
  onOpenPhysicalTicket,
}) {
  const [internalActiveId, setInternalActiveId] = useState(null)
  const resolvedActiveId = activeId ?? internalActiveId

  const visibleCards = isMobile
    ? CARDS.filter((card) => !card.desktopOnly)
    : CARDS

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
          {visibleCards.map((card) => {
            const assetSrc =
              card.assetSrc ??
              (isMobile ? card.mobileAssetSrc : card.desktopAssetSrc)

            return (
              <ExperienceCard
                key={card.id}
                title={card.title}
                description={card.description}
                asset={<CardAsset src={assetSrc} video={card.assetVideo} />}
                active={resolvedActiveId === card.id}
                onClick={() => handleCardClick(card)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

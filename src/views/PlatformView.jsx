import ExploreRail from '../components/ExploreRail'

const DESKTOP_IMAGE = '/assets/desktop%20view%20image.png'
const MOBILE_IMAGE = '/assets/mobile%20view%20image.png'

export default function PlatformView({
  exploreActiveId,
  onExploreActiveChange,
  onOpenWeightMachine,
  onOpenInsideTrain,
  onOpenPhysicalTicket,
}) {
  return (
    <>
      <picture className="experience__picture">
        <source media="(min-width: 768px)" srcSet={DESKTOP_IMAGE} />
        <img
          className="experience__image"
          src={MOBILE_IMAGE}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <ExploreRail
        activeId={exploreActiveId}
        onExploreActiveChange={onExploreActiveChange}
        onOpenWeightMachine={onOpenWeightMachine}
        onOpenInsideTrain={onOpenInsideTrain}
        onOpenPhysicalTicket={onOpenPhysicalTicket}
      />
    </>
  )
}

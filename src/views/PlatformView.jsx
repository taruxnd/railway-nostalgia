import ExploreRail from '../components/ExploreRail'
import ExperienceTitle from '../components/ExperienceTitle'

const DESKTOP_IMAGE = '/assets/dphoto.png'
const MOBILE_IMAGE = '/assets/mphoto.png'

export default function PlatformView({
  isMobile = false,
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

      <ExperienceTitle />

      <ExploreRail
        isMobile={isMobile}
        activeId={exploreActiveId}
        onExploreActiveChange={onExploreActiveChange}
        onOpenWeightMachine={onOpenWeightMachine}
        onOpenInsideTrain={onOpenInsideTrain}
        onOpenPhysicalTicket={onOpenPhysicalTicket}
      />
    </>
  )
}

import { useEffect, useState } from 'react'
import ExploreRail from '../components/ExploreRail'
import ExperienceTitle from '../components/ExperienceTitle'
import TrainLoadingOverlay from '../components/TrainLoadingOverlay'
import useExperienceVideo from '../hooks/useExperienceVideo'
import './PlatformView.css'

const DESKTOP_VIDEO = '/assets/platformnew.mp4'
const MOBILE_VIDEO = '/assets/platformnewfinal.mp4'
const MOBILE_QUERY = '(max-width: 767px)'

function getPlatformVideoSrc() {
  if (typeof window === 'undefined') return DESKTOP_VIDEO
  return window.matchMedia(MOBILE_QUERY).matches
    ? MOBILE_VIDEO
    : DESKTOP_VIDEO
}

export default function PlatformView({
  isActive = false,
  onOpenInsideTrain,
  muteControl,
}) {
  const [videoSrc, setVideoSrc] = useState(getPlatformVideoSrc)
  const { videoRef, retryToken, loadStatus, hasRevealed, retryLoad } =
    useExperienceVideo({
      isActive,
      videoSrc,
    })

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const update = () => {
      setVideoSrc(media.matches ? MOBILE_VIDEO : DESKTOP_VIDEO)
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <div className="platform-view">
      <div className="experience__picture">
        <video
          key={`${videoSrc}-${retryToken}`}
          ref={videoRef}
          className={`experience__image platform-view__video${hasRevealed ? ' platform-view__video--ready' : ''}`}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {isActive && hasRevealed ? <ExperienceTitle /> : null}

      <ExploreRail
        muteControl={muteControl}
        onOpenInsideTrain={onOpenInsideTrain}
      />

      {isActive ? (
        <TrainLoadingOverlay
          status={loadStatus}
          onRetry={retryLoad}
          message="arriving at the platform"
          errorMessage="Couldn't load the platform"
        />
      ) : null}
    </div>
  )
}

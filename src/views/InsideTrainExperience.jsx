import { useEffect, useState } from 'react'
import ExperienceTitle from '../components/ExperienceTitle'
import TrainLoadingOverlay from '../components/TrainLoadingOverlay'
import useExperienceVideo from '../hooks/useExperienceVideo'
import './InsideTrainExperience.css'

const DESKTOP_VIDEO = '/assets/inview%20desktop.mp4'
const MOBILE_VIDEO = '/assets/mviewmobile.mp4'
const MOBILE_QUERY = '(max-width: 767px)'

function getVideoSrc() {
  if (typeof window === 'undefined') return DESKTOP_VIDEO
  return window.matchMedia(MOBILE_QUERY).matches
    ? MOBILE_VIDEO
    : DESKTOP_VIDEO
}

export default function InsideTrainExperience({ isActive }) {
  const [videoSrc, setVideoSrc] = useState(getVideoSrc)
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
    <div className="inside-train">
      <video
        key={`${videoSrc}-${retryToken}`}
        ref={videoRef}
        className={`inside-train__video${hasRevealed ? ' inside-train__video--ready' : ''}`}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {isActive && hasRevealed ? (
        <ExperienceTitle variant="train" />
      ) : null}

      {isActive ? (
        <TrainLoadingOverlay status={loadStatus} onRetry={retryLoad} />
      ) : null}
    </div>
  )
}

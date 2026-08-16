import { useEffect, useRef, useState } from 'react'
import ExploreRail from '../components/ExploreRail'
import ExperienceTitle from '../components/ExperienceTitle'

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
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(getPlatformVideoSrc)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const update = () => {
      setVideoSrc(media.matches ? MOBILE_VIDEO : DESKTOP_VIDEO)
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0
    video.loop = true

    if (!isActive) {
      video.pause()
      return
    }

    void video.play().catch(() => {
      /* autoplay may be blocked; video stays muted */
    })
  }, [isActive, videoSrc])

  return (
    <>
      <div className="experience__picture">
        <video
          key={videoSrc}
          ref={videoRef}
          className="experience__image"
          src={videoSrc}
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      <ExperienceTitle />

      <ExploreRail
        muteControl={muteControl}
        onOpenInsideTrain={onOpenInsideTrain}
      />
    </>
  )
}

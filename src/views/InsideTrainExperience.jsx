import { useEffect, useRef, useState } from 'react'
import './InsideTrainExperience.css'

const DESKTOP_VIDEO = '/assets/inview%20desktop.mp4'
const MOBILE_VIDEO = '/assets/mview%20mobile.mp4'
const MOBILE_QUERY = '(max-width: 767px)'

export default function InsideTrainExperience({ isActive }) {
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(() => {
    if (typeof window === 'undefined') return DESKTOP_VIDEO
    return window.matchMedia(MOBILE_QUERY).matches
      ? MOBILE_VIDEO
      : DESKTOP_VIDEO
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0

    if (!isActive) {
      video.pause()
      video.currentTime = 0
      return
    }

    video.loop = true
    void video.play().catch(() => {
      /* autoplay may be blocked; video stays muted */
    })
  }, [isActive, videoSrc])

  return (
    <div className="inside-train">
      <video
        key={videoSrc}
        ref={videoRef}
        className="inside-train__video"
        src={videoSrc}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  )
}

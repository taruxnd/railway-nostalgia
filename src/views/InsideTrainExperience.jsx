import { useEffect, useRef } from 'react'
import './InsideTrainExperience.css'

const TRAIN_VIDEO_SRC = '/assets/insidetrain.MP4'

export default function InsideTrainExperience({ isActive, videoMuted }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = videoMuted
  }, [videoMuted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!isActive) {
      video.pause()
      video.currentTime = 0
      return
    }

    video.loop = true
    video.muted = videoMuted
    void video.play()
  }, [isActive, videoMuted])

  return (
    <div className="inside-train">
      <video
        ref={videoRef}
        className="inside-train__video"
        src={TRAIN_VIDEO_SRC}
        loop
        playsInline
        preload="auto"
        muted={videoMuted}
      />
    </div>
  )
}

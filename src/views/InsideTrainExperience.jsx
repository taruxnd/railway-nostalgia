import { useCallback, useEffect, useRef, useState } from 'react'
import ExperienceTitle from '../components/ExperienceTitle'
import TrainLoadingOverlay from '../components/TrainLoadingOverlay'
import './InsideTrainExperience.css'

const DESKTOP_VIDEO = '/assets/inview%20desktop.mp4'
const MOBILE_VIDEO = '/assets/mviewmobile.mp4'
const MOBILE_QUERY = '(max-width: 767px)'
const HAVE_FUTURE_DATA = 3

function getVideoSrc() {
  if (typeof window === 'undefined') return DESKTOP_VIDEO
  return window.matchMedia(MOBILE_QUERY).matches
    ? MOBILE_VIDEO
    : DESKTOP_VIDEO
}

export default function InsideTrainExperience({ isActive }) {
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(getVideoSrc)
  const [retryToken, setRetryToken] = useState(0)
  const [loadStatus, setLoadStatus] = useState('idle')

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
    if (!isActive) {
      setLoadStatus('idle')
      return
    }

    setLoadStatus('loading')
  }, [isActive, videoSrc, retryToken])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0
    video.loop = true

    if (!isActive) {
      video.pause()
      video.currentTime = 0
      return
    }

    let cancelled = false

    const markReady = () => {
      if (cancelled) return
      if (video.paused || video.readyState < HAVE_FUTURE_DATA) return
      setLoadStatus('ready')
    }

    const tryPlay = async () => {
      if (cancelled) return
      if (video.readyState < HAVE_FUTURE_DATA) return

      video.muted = true
      video.defaultMuted = true
      video.volume = 0
      video.loop = true

      try {
        await video.play()
        markReady()
      } catch {
        /* keep loading rather than revealing a frozen frame */
      }
    }

    const onCanPlay = () => {
      void tryPlay()
    }

    const onPlaying = () => {
      markReady()
    }

    const onError = () => {
      if (cancelled) return
      video.pause()
      setLoadStatus('error')
    }

    video.addEventListener('loadeddata', onCanPlay)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    video.load()
    void tryPlay()

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', onCanPlay)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('canplaythrough', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [isActive, videoSrc, retryToken])

  const retryLoad = useCallback(() => {
    setLoadStatus('loading')
    setRetryToken((token) => token + 1)
  }, [])

  return (
    <div className="inside-train">
      <video
        key={`${videoSrc}-${retryToken}`}
        ref={videoRef}
        className={`inside-train__video${loadStatus === 'ready' ? ' inside-train__video--ready' : ''}`}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {isActive && loadStatus === 'ready' ? (
        <ExperienceTitle variant="train" />
      ) : null}

      {isActive ? (
        <TrainLoadingOverlay status={loadStatus} onRetry={retryLoad} />
      ) : null}
    </div>
  )
}

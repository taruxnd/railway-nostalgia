import { useCallback, useEffect, useRef, useState } from 'react'

const HAVE_FUTURE_DATA = 3

export default function useExperienceVideo({ isActive, videoSrc }) {
  const videoRef = useRef(null)
  const [retryToken, setRetryToken] = useState(0)
  const [loadStatus, setLoadStatus] = useState('idle')
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setLoadStatus('idle')
      setHasRevealed(false)
      return
    }

    setLoadStatus('loading')
    setHasRevealed(false)
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
      setHasRevealed(true)
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

    const onWaiting = () => {
      if (cancelled) return
      if (video.readyState >= HAVE_FUTURE_DATA) return
      setLoadStatus((status) => (status === 'error' ? status : 'loading'))
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
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('stalled', onWaiting)
    video.addEventListener('error', onError)

    video.load()
    void tryPlay()

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', onCanPlay)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('canplaythrough', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('stalled', onWaiting)
      video.removeEventListener('error', onError)
    }
  }, [isActive, videoSrc, retryToken])

  const retryLoad = useCallback(() => {
    setLoadStatus('loading')
    setRetryToken((token) => token + 1)
  }, [])

  return { videoRef, retryToken, loadStatus, hasRevealed, retryLoad }
}

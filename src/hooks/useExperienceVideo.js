import { useCallback, useEffect, useRef, useState } from 'react'

const HAVE_CURRENT_DATA = 2
const sessionReadySources = new Set()

export default function useExperienceVideo({ isActive, videoSrc }) {
  const videoRef = useRef(null)
  const hasRevealedRef = useRef(false)
  const [retryToken, setRetryToken] = useState(0)
  const [loadStatus, setLoadStatus] = useState('idle')
  const [hasRevealed, setHasRevealed] = useState(false)
  const sourceKey = `${videoSrc}:${retryToken}`
  const [activeSourceKey, setActiveSourceKey] = useState(sourceKey)

  hasRevealedRef.current = hasRevealed

  if (activeSourceKey !== sourceKey) {
    setActiveSourceKey(sourceKey)
    hasRevealedRef.current = false
    setHasRevealed(false)
    setLoadStatus('idle')
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.volume = 0
    video.loop = true

    if (!isActive) {
      video.pause()
      return
    }

    let cancelled = false
    let rafId = 0

    const markReady = () => {
      if (cancelled || video.paused) return
      sessionReadySources.add(videoSrc)
      hasRevealedRef.current = true
      setHasRevealed(true)
      setLoadStatus('ready')
    }

    const tryPlay = async () => {
      if (cancelled) return
      if (video.readyState < HAVE_CURRENT_DATA) return

      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.volume = 0
      video.loop = true

      try {
        await video.play()
        if (cancelled) return
        if (!video.paused) markReady()
      } catch {
        if (cancelled || hasRevealedRef.current) return
        setLoadStatus((status) => (status === 'error' ? status : 'loading'))
      }
    }

    const showLoaderIfStillNeeded = () => {
      if (cancelled || hasRevealedRef.current || !video.paused) return
      if (video.readyState >= HAVE_CURRENT_DATA) return
      setLoadStatus((status) => (status === 'error' ? status : 'loading'))
    }

    const onLoaded = () => {
      void tryPlay()
    }

    const onPlaying = () => {
      markReady()
    }

    const onWaiting = () => {
      if (cancelled || hasRevealedRef.current) return
      if (video.readyState >= HAVE_CURRENT_DATA) return
      setLoadStatus((status) => (status === 'error' ? status : 'loading'))
    }

    const onError = () => {
      if (cancelled) return
      video.pause()
      sessionReadySources.delete(videoSrc)
      hasRevealedRef.current = false
      setHasRevealed(false)
      setLoadStatus('error')
    }

    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('canplay', onLoaded)
    video.addEventListener('canplaythrough', onLoaded)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('stalled', onWaiting)
    video.addEventListener('error', onError)

    if (video.readyState >= HAVE_CURRENT_DATA || hasRevealedRef.current) {
      void tryPlay()
    } else {
      rafId = window.requestAnimationFrame(showLoaderIfStillNeeded)
      void tryPlay()
    }

    return () => {
      cancelled = true
      window.cancelAnimationFrame(rafId)
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('canplay', onLoaded)
      video.removeEventListener('canplaythrough', onLoaded)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('stalled', onWaiting)
      video.removeEventListener('error', onError)
    }
  }, [isActive, videoSrc, retryToken])

  const retryLoad = useCallback(() => {
    sessionReadySources.delete(videoSrc)
    hasRevealedRef.current = false
    setHasRevealed(false)
    setLoadStatus('loading')
    setRetryToken((token) => token + 1)
  }, [videoSrc])

  return { videoRef, retryToken, loadStatus, hasRevealed, retryLoad }
}

import { useCallback, useEffect, useRef, useState } from 'react'

const HAVE_FUTURE_DATA = 3
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
    video.volume = 0
    video.loop = true

    if (!isActive) {
      video.pause()
      return
    }

    let cancelled = false
    let waitingForPaint = false
    let onTimeUpdate = null
    let rafId = 0

    const clearTimeUpdate = () => {
      if (!onTimeUpdate) return
      video.removeEventListener('timeupdate', onTimeUpdate)
      onTimeUpdate = null
    }

    const markReady = () => {
      if (cancelled) return
      if (video.paused || video.readyState < HAVE_FUTURE_DATA) return
      sessionReadySources.add(videoSrc)
      hasRevealedRef.current = true
      setHasRevealed(true)
      setLoadStatus('ready')
    }

    const revealWhenPlaying = () => {
      if (cancelled || waitingForPaint) return
      if (video.paused || video.readyState < HAVE_FUTURE_DATA) return
      waitingForPaint = true

      const finish = () => {
        if (cancelled) return
        clearTimeUpdate()
        markReady()
      }

      if (!video.paused && video.readyState >= HAVE_FUTURE_DATA) {
        if (
          typeof video.requestVideoFrameCallback === 'function' &&
          !hasRevealedRef.current
        ) {
          video.requestVideoFrameCallback(() => {
            if (cancelled || video.paused) return
            finish()
          })
        } else {
          finish()
        }
      }

      const startTime = video.currentTime
      onTimeUpdate = () => {
        if (cancelled || video.paused) return
        if (video.currentTime === startTime && startTime === 0) return
        finish()
      }
      video.addEventListener('timeupdate', onTimeUpdate)
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
        if (cancelled) return
        if (!video.paused) revealWhenPlaying()
      } catch {
        if (cancelled || hasRevealedRef.current) return
        setLoadStatus((status) => (status === 'error' ? status : 'loading'))
      }
    }

    const showLoaderIfStillNeeded = () => {
      if (cancelled || hasRevealedRef.current) return
      if (video.readyState >= HAVE_FUTURE_DATA) return
      setLoadStatus((status) => (status === 'error' ? status : 'loading'))
    }

    const onCanPlay = () => {
      void tryPlay()
    }

    const onPlaying = () => {
      revealWhenPlaying()
    }

    const onWaiting = () => {
      if (cancelled || hasRevealedRef.current) return
      if (video.readyState >= HAVE_FUTURE_DATA) return
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

    video.addEventListener('loadeddata', onCanPlay)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('canplaythrough', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('stalled', onWaiting)
    video.addEventListener('error', onError)

    const elementReady = video.readyState >= HAVE_FUTURE_DATA
    const alreadyKnown = sessionReadySources.has(videoSrc)

    if (elementReady || hasRevealedRef.current) {
      void tryPlay()
    } else if (alreadyKnown) {
      void tryPlay()
      rafId = window.requestAnimationFrame(showLoaderIfStillNeeded)
    } else {
      rafId = window.requestAnimationFrame(showLoaderIfStillNeeded)
      void tryPlay()
    }

    return () => {
      cancelled = true
      window.cancelAnimationFrame(rafId)
      clearTimeUpdate()
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
    sessionReadySources.delete(videoSrc)
    hasRevealedRef.current = false
    setHasRevealed(false)
    setLoadStatus('loading')
    setRetryToken((token) => token + 1)
  }, [videoSrc])

  return { videoRef, retryToken, loadStatus, hasRevealed, retryLoad }
}

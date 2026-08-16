import { useCallback, useEffect, useRef, useState } from 'react'
import AudioSourceControls from './components/AudioSourceControls'
import GlassBackButton from './components/GlassBackButton'
import PlatformView from './views/PlatformView'
import InsideTrainExperience from './views/InsideTrainExperience'
import './styles/glass.css'
import './App.css'

const PLATFORM_AUDIO_SRC = '/assets/audio.mp3'
const TRAIN_AUDIO_SRC = '/assets/newtrainsound.mp3'
const AMBIENT_VOLUME = 0.22

const AMBIENT_VIEWS = new Set(['platform'])
const UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'click', 'keydown']

async function playUnmuted(audio, syncUi) {
  if (!audio) return false

  audio.loop = true
  audio.volume = AMBIENT_VOLUME
  audio.muted = false

  if (!audio.paused) {
    syncUi()
    return true
  }

  try {
    await audio.play()
    syncUi()
    return !audio.paused && !audio.muted
  } catch {
    syncUi()
    return false
  }
}

function App() {
  const platformAudioRef = useRef(null)
  const trainAudioRef = useRef(null)
  const viewRef = useRef('platform')
  const [isBackgroundSilent, setIsBackgroundSilent] = useState(true)
  const [isTrainAudioSilent, setIsTrainAudioSilent] = useState(true)
  const [view, setView] = useState('platform')

  viewRef.current = view

  const syncPlatformAudioUi = useCallback(() => {
    const audio = platformAudioRef.current
    if (!audio) return
    setIsBackgroundSilent(audio.paused || audio.muted)
  }, [])

  const syncTrainAudioUi = useCallback(() => {
    const audio = trainAudioRef.current
    if (!audio) return
    setIsTrainAudioSilent(audio.paused || audio.muted)
  }, [])

  const stopTrainAudio = useCallback(() => {
    const audio = trainAudioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    syncTrainAudioUi()
  }, [syncTrainAudioUi])

  const startPlatformAudio = useCallback(async () => {
    await playUnmuted(platformAudioRef.current, syncPlatformAudioUi)
  }, [syncPlatformAudioUi])

  const startTrainAudio = useCallback(async () => {
    await playUnmuted(trainAudioRef.current, syncTrainAudioUi)
  }, [syncTrainAudioUi])

  const unlockCurrentAudio = useCallback(async () => {
    if (viewRef.current === 'train') {
      return playUnmuted(trainAudioRef.current, syncTrainAudioUi)
    }

    if (AMBIENT_VIEWS.has(viewRef.current)) {
      return playUnmuted(platformAudioRef.current, syncPlatformAudioUi)
    }

    return false
  }, [syncPlatformAudioUi, syncTrainAudioUi])

  useEffect(() => {
    const audio = platformAudioRef.current
    if (!audio) return

    const onAudioChange = () => syncPlatformAudioUi()
    audio.addEventListener('play', onAudioChange)
    audio.addEventListener('pause', onAudioChange)
    audio.addEventListener('volumechange', onAudioChange)

    return () => {
      audio.removeEventListener('play', onAudioChange)
      audio.removeEventListener('pause', onAudioChange)
      audio.removeEventListener('volumechange', onAudioChange)
    }
  }, [syncPlatformAudioUi])

  useEffect(() => {
    const audio = trainAudioRef.current
    if (!audio) return

    const onAudioChange = () => syncTrainAudioUi()
    audio.addEventListener('play', onAudioChange)
    audio.addEventListener('pause', onAudioChange)
    audio.addEventListener('volumechange', onAudioChange)

    return () => {
      audio.removeEventListener('play', onAudioChange)
      audio.removeEventListener('pause', onAudioChange)
      audio.removeEventListener('volumechange', onAudioChange)
    }
  }, [syncTrainAudioUi])

  useEffect(() => {
    const platformAudio = platformAudioRef.current
    if (!platformAudio) return

    if (view === 'train') {
      platformAudio.pause()
      syncPlatformAudioUi()
      void startTrainAudio()
      return
    }

    stopTrainAudio()

    if (AMBIENT_VIEWS.has(view)) {
      void startPlatformAudio()
    }
  }, [
    view,
    startPlatformAudio,
    startTrainAudio,
    stopTrainAudio,
    syncPlatformAudioUi,
  ])

  useEffect(() => {
    const onGesture = () => {
      void unlockCurrentAudio().then((started) => {
        if (!started) return
        UNLOCK_EVENTS.forEach((eventName) => {
          window.removeEventListener(eventName, onGesture, true)
        })
      })
    }

    UNLOCK_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onGesture, {
        capture: true,
        passive: true,
      })
    })

    return () => {
      UNLOCK_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onGesture, true)
      })
    }
  }, [unlockCurrentAudio])

  const togglePlatformMute = async () => {
    const audio = platformAudioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    const shouldTurnOn = audio.paused || audio.muted

    if (shouldTurnOn) {
      await playUnmuted(audio, syncPlatformAudioUi)
      return
    }

    audio.muted = true
    syncPlatformAudioUi()
  }

  const toggleTrainMute = async () => {
    const audio = trainAudioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    const shouldTurnOn = audio.paused || audio.muted

    if (shouldTurnOn) {
      await playUnmuted(audio, syncTrainAudioUi)
      return
    }

    audio.muted = true
    syncTrainAudioUi()
  }

  const openInsideTrain = () => {
    setView('train')
  }

  const backToPlatform = () => {
    setView('platform')
  }

  const layerClass = (id) =>
    `experience__layer${view === id ? ' experience__layer--active' : ''}`

  return (
    <div className="experience">
      <div className="experience__canvas">
        <div className={layerClass('platform')} aria-hidden={view !== 'platform'}>
          <PlatformView
            isActive={view === 'platform'}
            onOpenInsideTrain={openInsideTrain}
            muteControl={
              <AudioSourceControls
                isBackgroundSilent={isBackgroundSilent}
                onToggleMute={togglePlatformMute}
              />
            }
          />
        </div>

        <div className={layerClass('train')} aria-hidden={view !== 'train'}>
          <InsideTrainExperience isActive={view === 'train'} />
        </div>

        {view !== 'platform' ? (
          <GlassBackButton onClick={backToPlatform} />
        ) : null}

        {view === 'train' ? (
          <AudioSourceControls
            placement="solo"
            isBackgroundSilent={isTrainAudioSilent}
            onToggleMute={toggleTrainMute}
          />
        ) : null}
      </div>

      <audio
        ref={platformAudioRef}
        src={PLATFORM_AUDIO_SRC}
        preload="auto"
        loop
        playsInline
      />
      <audio
        ref={trainAudioRef}
        src={TRAIN_AUDIO_SRC}
        preload="auto"
        loop
        playsInline
      />
    </div>
  )
}

export default App

import { useCallback, useEffect, useRef, useState } from 'react'
import AudioSourceControls from './components/AudioSourceControls'
import GlassBackButton from './components/GlassBackButton'
import useIsMobileViewport from './hooks/useIsMobileViewport'
import PlatformView from './views/PlatformView'
import WeightMachineExperience from './views/WeightMachineExperience'
import InsideTrainExperience from './views/InsideTrainExperience'
import PhysicalTicketExperience from './views/PhysicalTicketExperience'
import './styles/glass.css'
import './App.css'

const PLATFORM_AUDIO_SRC = '/assets/audio.mp3'
const TRAIN_AUDIO_SRC = `/assets/${encodeURIComponent(
  'Inside Train Sound Effects [Free Audio] (Loopable) - Sound Bytes (128k).mp3',
)}`
const AMBIENT_VOLUME = 0.22

const AMBIENT_VIEWS = new Set(['platform', 'ticket', 'weight'])

function App() {
  const isMobile = useIsMobileViewport()
  const platformAudioRef = useRef(null)
  const trainAudioRef = useRef(null)
  const [isBackgroundSilent, setIsBackgroundSilent] = useState(true)
  const [isTrainAudioSilent, setIsTrainAudioSilent] = useState(true)
  const [view, setView] = useState('platform')
  const [weightStep, setWeightStep] = useState('machine')
  const [exploreActiveId, setExploreActiveId] = useState(null)

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
    const audio = platformAudioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    try {
      audio.muted = false
      await audio.play()
    } catch {
      try {
        audio.muted = true
        await audio.play()
      } catch {
        /* blocked until user interacts */
      }
    }

    syncPlatformAudioUi()
  }, [syncPlatformAudioUi])

  const startTrainAudio = useCallback(async () => {
    const audio = trainAudioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    if (!audio.paused) {
      syncTrainAudioUi()
      return
    }

    try {
      audio.muted = false
      await audio.play()
    } catch {
      try {
        audio.muted = true
        await audio.play()
      } catch {
        /* blocked until user interacts */
      }
    }

    syncTrainAudioUi()
  }, [syncTrainAudioUi])

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

  const togglePlatformMute = async () => {
    const audio = platformAudioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    const shouldTurnOn = audio.paused || audio.muted

    if (shouldTurnOn) {
      audio.muted = false
      try {
        await audio.play()
      } catch {
        try {
          audio.muted = true
          await audio.play()
        } catch {
          /* ignore */
        }
      }
      syncPlatformAudioUi()
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
      audio.muted = false
      try {
        await audio.play()
      } catch {
        try {
          audio.muted = true
          await audio.play()
        } catch {
          /* ignore */
        }
      }
      syncTrainAudioUi()
      return
    }

    audio.muted = true
    syncTrainAudioUi()
  }

  const openWeightMachine = () => {
    setWeightStep('machine')
    setView('weight')
  }

  const openInsideTrain = () => {
    setView('train')
  }

  const openPhysicalTicket = () => {
    setView('ticket')
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
            isMobile={isMobile}
            exploreActiveId={exploreActiveId}
            onExploreActiveChange={setExploreActiveId}
            onOpenWeightMachine={openWeightMachine}
            onOpenInsideTrain={openInsideTrain}
            onOpenPhysicalTicket={openPhysicalTicket}
          />
        </div>

        {!isMobile ? (
          <>
            <div className={layerClass('ticket')} aria-hidden={view !== 'ticket'}>
              <PhysicalTicketExperience />
            </div>

            <div className={layerClass('weight')} aria-hidden={view !== 'weight'}>
              <WeightMachineExperience
                step={weightStep}
                onStepChange={setWeightStep}
              />
            </div>
          </>
        ) : null}

        <div className={layerClass('train')} aria-hidden={view !== 'train'}>
          <InsideTrainExperience isActive={view === 'train'} />
        </div>

        {view !== 'platform' ? (
          <GlassBackButton onClick={backToPlatform} />
        ) : null}

        {view === 'train' ? (
          <AudioSourceControls
            isBackgroundSilent={isTrainAudioSilent}
            onToggleMute={toggleTrainMute}
          />
        ) : (
          <AudioSourceControls
            isBackgroundSilent={isBackgroundSilent}
            onToggleMute={togglePlatformMute}
          />
        )}
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

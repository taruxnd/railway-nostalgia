import { useCallback, useEffect, useRef, useState } from 'react'
import AudioSourceControls from './components/AudioSourceControls'
import DesktopOnlyScreen from './components/DesktopOnlyScreen'
import GlassBackButton from './components/GlassBackButton'
import TrainVideoMuteControl from './components/TrainVideoMuteControl'
import useIsMobileViewport from './hooks/useIsMobileViewport'
import PlatformView from './views/PlatformView'
import WeightMachineExperience from './views/WeightMachineExperience'
import InsideTrainExperience from './views/InsideTrainExperience'
import PhysicalTicketExperience from './views/PhysicalTicketExperience'
import './styles/glass.css'
import './App.css'

const AUDIO_SRC = '/assets/audio.mp3'
const AMBIENT_VOLUME = 0.22

const AMBIENT_VIEWS = new Set(['platform', 'ticket', 'weight'])

function App() {
  const isMobile = useIsMobileViewport()
  const audioRef = useRef(null)
  const [isBackgroundSilent, setIsBackgroundSilent] = useState(true)
  const [view, setView] = useState('platform')
  const [weightStep, setWeightStep] = useState('machine')
  const [exploreActiveId, setExploreActiveId] = useState(null)
  const [trainVideoMuted, setTrainVideoMuted] = useState(false)

  const syncBackgroundAudioUi = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setIsBackgroundSilent(audio.paused || audio.muted)
  }, [])

  const startAudio = useCallback(async () => {
    const audio = audioRef.current
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

    syncBackgroundAudioUi()
  }, [syncBackgroundAudioUi])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isMobile) return

    const onAudioChange = () => syncBackgroundAudioUi()

    audio.addEventListener('play', onAudioChange)
    audio.addEventListener('pause', onAudioChange)
    audio.addEventListener('volumechange', onAudioChange)

    const onCanPlay = () => {
      if (AMBIENT_VIEWS.has(view)) {
        void startAudio()
      }
    }

    audio.addEventListener('canplay', onCanPlay)
    syncBackgroundAudioUi()

    if (AMBIENT_VIEWS.has(view)) {
      void startAudio()
    }

    return () => {
      audio.removeEventListener('play', onAudioChange)
      audio.removeEventListener('pause', onAudioChange)
      audio.removeEventListener('volumechange', onAudioChange)
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [view, startAudio, syncBackgroundAudioUi, isMobile])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (view === 'train') {
      audio.pause()
      syncBackgroundAudioUi()
    } else if (AMBIENT_VIEWS.has(view)) {
      void startAudio()
    }
  }, [view, startAudio, syncBackgroundAudioUi])

  const togglePlatformMute = async () => {
    const audio = audioRef.current
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
      syncBackgroundAudioUi()
      return
    }

    audio.muted = true
    syncBackgroundAudioUi()
  }

  const toggleTrainVideoMute = () => {
    setTrainVideoMuted((prev) => !prev)
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

  if (isMobile) {
    return <DesktopOnlyScreen />
  }

  return (
    <div className="experience">
      <div className="experience__canvas">
        <div className={layerClass('platform')} aria-hidden={view !== 'platform'}>
          <PlatformView
            exploreActiveId={exploreActiveId}
            onExploreActiveChange={setExploreActiveId}
            onOpenWeightMachine={openWeightMachine}
            onOpenInsideTrain={openInsideTrain}
            onOpenPhysicalTicket={openPhysicalTicket}
          />
        </div>

        <div className={layerClass('ticket')} aria-hidden={view !== 'ticket'}>
          <PhysicalTicketExperience />
        </div>

        <div className={layerClass('weight')} aria-hidden={view !== 'weight'}>
          <WeightMachineExperience
            step={weightStep}
            onStepChange={setWeightStep}
          />
        </div>

        <div className={layerClass('train')} aria-hidden={view !== 'train'}>
          <InsideTrainExperience
            isActive={view === 'train'}
            videoMuted={trainVideoMuted}
          />
        </div>

        {view !== 'platform' ? (
          <GlassBackButton onClick={backToPlatform} />
        ) : null}

        {view === 'train' ? (
          <TrainVideoMuteControl
            isMuted={trainVideoMuted}
            onToggleMute={toggleTrainVideoMute}
          />
        ) : (
          <AudioSourceControls
            isBackgroundSilent={isBackgroundSilent}
            onToggleMute={togglePlatformMute}
          />
        )}
      </div>

      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop playsInline />
    </div>
  )
}

export default App

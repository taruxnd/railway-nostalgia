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
  const [isMuted, setIsMuted] = useState(false)
  const [view, setView] = useState('platform')
  const [weightStep, setWeightStep] = useState('machine')
  const [exploreActiveId, setExploreActiveId] = useState(null)
  const [trainVideoMuted, setTrainVideoMuted] = useState(false)

  const startAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    if (!audio.paused) {
      setIsMuted(audio.muted)
      return
    }

    try {
      audio.muted = false
      await audio.play()
      setIsMuted(false)
      return
    } catch {
      /* blocked with sound — try muted autoplay, then unmute on user gesture */
    }

    try {
      audio.muted = true
      await audio.play()
      setIsMuted(true)
    } catch {
      /* still blocked until user interacts */
    }
  }, [])

  useEffect(() => {
    if (AMBIENT_VIEWS.has(view)) {
      startAudio()
    }
  }, [view, startAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (view === 'train') {
      audio.pause()
    }
  }, [view])

  const togglePlatformMute = async () => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = AMBIENT_VOLUME

    if (audio.paused) {
      try {
        audio.muted = false
        await audio.play()
        setIsMuted(false)
      } catch {
        try {
          audio.muted = true
          await audio.play()
          setIsMuted(true)
        } catch {
          /* ignore */
        }
      }
      return
    }

    const nextMuted = !audio.muted
    audio.muted = nextMuted
    setIsMuted(nextMuted)
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
            isMuted={isMuted}
            onToggleMute={togglePlatformMute}
          />
        )}
      </div>

      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop playsInline />
    </div>
  )
}

export default App

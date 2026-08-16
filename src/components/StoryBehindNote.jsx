import { useEffect, useId, useRef, useState } from 'react'
import '../styles/glass.css'
import './StoryBehindNote.css'

const CLOSE_MS = 200

function IconInfo({ className = '' }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 11v5.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8.15" r="1.05" fill="currentColor" />
    </svg>
  )
}

function IconClose({ className = '' }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function StoryBehindNote() {
  const titleId = useId()
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  const closeNote = () => {
    setEntered(false)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false)
      triggerRef.current?.focus()
    }, CLOSE_MS)
  }

  const openNote = () => {
    window.clearTimeout(closeTimerRef.current)
    setMounted(true)
    window.requestAnimationFrame(() => setEntered(true))
  }

  useEffect(() => {
    return () => window.clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(() => {
    if (!mounted) return undefined

    const frame = window.requestAnimationFrame(() => {
      setEntered(true)
      closeBtnRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return undefined

    const getFocusable = () => {
      const root = dialogRef.current
      if (!root) return []
      return Array.from(root.querySelectorAll('button, a[href]')).filter(
        (node) => !node.hasAttribute('disabled'),
      )
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeNote()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mounted])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="audio-credits-text"
        aria-label="What inspired this"
        title="What inspired this"
        aria-expanded={mounted}
        aria-haspopup="dialog"
        onClick={openNote}
      >
        What inspired this
        <IconInfo className="audio-credits__arrow" />
      </button>

      {mounted ? (
        <div
          className={`story-note-layer${entered ? ' story-note-layer--open' : ''}`}
        >
          <button
            type="button"
            className="story-note-scrim"
            tabIndex={-1}
            aria-label="Close story"
            onClick={closeNote}
          />
          <div
            ref={dialogRef}
            className="story-note glass-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              ref={closeBtnRef}
              type="button"
              className="story-note__close"
              aria-label="Close"
              onClick={closeNote}
            >
              <IconClose />
            </button>

            <h2 id={titleId} className="story-note__title">
              the story behind this
            </h2>

            <div className="story-note__body">
              <p>
                there’s a strange kind of nostalgia in the sound of an indian
                train.
              </p>
              <p className="story-note__stanza">
                the rhythmic clatter as it starts moving.
                <br />
                the metal rattle of an old sleeper coach.
                <br />
                a station announcement echoing somewhere in the distance.
                <br />
                the horn before the train pulls away.
                <br />
                vendors calling out on the platform.
              </p>
              <p>
                there are entire corners of youtube dedicated to these sounds.
                videos of indian train journeys get millions of views, filled
                with people saying how much they miss travelling this way, how
                the sound takes them back, or simply how peaceful it feels.
              </p>
              <p>and i get it.</p>
              <p>
                some sounds don’t just remind you of a place. they take you
                back there.
              </p>
              <p>
                so i made train ka safar — a small interactive experiment built
                around that feeling.
              </p>
              <p>
                no big reason.
                <br />
                i just wanted to make something that sounds like a memory.
              </p>
            </div>

            <div className="story-note__attribution">
              <p className="story-note__credit">
                inspired by a few nostalgia-driven internet experiments i came
                across.
              </p>
            </div>

            <section className="story-note__ai" aria-labelledby={`${titleId}-ai`}>
              <h3 id={`${titleId}-ai`} className="story-note__subtitle">
                made with ai, designed as a system
              </h3>
              <div className="story-note__body">
                <p>
                  the visuals for train ka safar were created using gpt image
                  2 and kling 3.0 through kumba ai.
                </p>
                <p>
                  the interesting part wasn't generating a single good-looking
                  image. it was getting multiple ai-generated scenes to feel
                  like they belonged to the same world — the same train,
                  atmosphere, lighting, visual language and nostalgic tone.
                </p>
                <p>
                  i also created mobile-specific assets instead of simply
                  cropping the desktop experience, and designed the experience
                  responsively around them.
                </p>
                <p>
                  keeping that consistency across ai-generated images and
                  videos was probably the hardest part.
                </p>
              </div>
              <p className="story-note__credit">
                generated with ai. directed, designed and stitched together by
                me.
              </p>
              <p className="story-note__tags">
                gpt image 2 · kling 3.0 · kumba ai
              </p>
            </section>
          </div>
        </div>
      ) : null}
    </>
  )
}

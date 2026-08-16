import StoryBehindNote from './StoryBehindNote'
import './AudioSourceControls.css'

export const SOURCE_URL = 'https://youtu.be/gSOtG9zrUVE?si=UMVncTm4YO8gQjCq'

function IconArrowUpRight() {
  return (
    <svg
      className="audio-credits__arrow"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AudioCredits() {
  return (
    <div className="audio-credits-cluster">
      <StoryBehindNote />
      <a
        className="audio-credits-text"
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Audio credits (opens in new tab)"
        title="Audio credits"
      >
        Audio credits
        <IconArrowUpRight />
      </a>
    </div>
  )
}

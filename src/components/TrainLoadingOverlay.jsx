import '../styles/glass.css'
import './TrainLoadingOverlay.css'

function TrainIllustration() {
  return (
    <svg
      className="train-loader__engine"
      width="72"
      height="28"
      viewBox="0 0 72 28"
      fill="none"
      aria-hidden="true"
    >
      <rect x="22" y="8" width="28" height="12" rx="1.5" fill="currentColor" />
      <rect x="48" y="12" width="16" height="8" rx="1" fill="currentColor" />
      <rect x="26" y="4" width="8" height="5" rx="0.75" fill="currentColor" />
      <rect x="4" y="14" width="18" height="6" rx="1" fill="currentColor" opacity="0.85" />
      <circle cx="14" cy="23" r="3.2" fill="currentColor" />
      <circle cx="32" cy="23" r="3.2" fill="currentColor" />
      <circle cx="44" cy="23" r="3.2" fill="currentColor" />
      <circle cx="58" cy="23" r="2.6" fill="currentColor" />
      <rect x="62" y="7" width="2" height="6" rx="0.5" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export default function TrainLoadingOverlay({
  status,
  onRetry,
  message = 'Entering the train...',
  errorMessage = "Couldn't load the train view",
}) {
  const isError = status === 'error'
  const isVisible = status === 'loading' || status === 'error'

  return (
    <div
      className={`train-loader${isVisible ? '' : ' train-loader--hidden'}`}
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <div className="train-loader__content">
        {isError ? (
          <>
            <p className="train-loader__message">{errorMessage}</p>
            <button
              type="button"
              className="glass-button train-loader__retry"
              onClick={onRetry}
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <div className="train-loader__scene">
              <div className="train-loader__train">
                <TrainIllustration />
              </div>
              <div className="train-loader__track" />
            </div>
            <p className="train-loader__message">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}

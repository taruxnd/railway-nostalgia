import { useMemo } from 'react'
import '../styles/glass.css'
import './WeightMachineExperience.css'

const IMAGE_BY_STEP = {
  machine: '/assets/machine.png',
  coin: '/assets/coin-inserted.png',
  ticket: '/assets/ticket.png',
}

export default function WeightMachineExperience({ step, onStepChange }) {
  const cta = useMemo(() => {
    switch (step) {
      case 'machine':
        return {
          title: '₹1 WEIGHT MACHINE',
          description: 'Insert a ₹1 coin to get your ticket.',
          primaryLabel: 'Insert ₹1 coin →',
          onPrimary: () => onStepChange('coin'),
          secondaryLabel: null,
        }
      case 'coin':
        return {
          title: 'COIN ACCEPTED',
          description: 'Now get your weight ticket.',
          primaryLabel: 'Get my ticket →',
          onPrimary: () => onStepChange('ticket'),
          secondaryLabel: null,
        }
      case 'ticket':
        return {
          title: 'YOUR TICKET IS READY',
          description: 'A tiny piece of railway nostalgia.',
          primaryLabel: null,
          onPrimary: null,
          secondaryLabel: 'Try again',
          onSecondary: () => onStepChange('machine'),
        }
      default:
        return null
    }
  }, [step, onStepChange])

  return (
    <div className="weight-machine" aria-live="polite">
      <div className="weight-machine__stage">
        {Object.entries(IMAGE_BY_STEP).map(([id, src]) => (
          <img
            key={id}
            className={`weight-machine__image${step === id ? ' weight-machine__image--visible' : ''}`}
            src={src}
            alt=""
            decoding="async"
            fetchPriority={step === id ? 'high' : 'low'}
          />
        ))}
      </div>

      {cta ? (
        <div className="weight-machine__cta-wrap">
          <div className="weight-machine__cta glass-surface" key={step}>
            <h2 className="weight-machine__cta-title">{cta.title}</h2>
            <p className="weight-machine__cta-description">{cta.description}</p>
            <div className="weight-machine__cta-actions">
              {cta.primaryLabel ? (
                <button
                  type="button"
                  className="glass-button weight-machine__cta-primary"
                  onClick={cta.onPrimary}
                >
                  {cta.primaryLabel}
                </button>
              ) : null}
              {cta.secondaryLabel ? (
                <button
                  type="button"
                  className="glass-button glass-button--secondary"
                  onClick={cta.onSecondary}
                >
                  {cta.secondaryLabel}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

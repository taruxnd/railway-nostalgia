import './PhysicalTicketExperience.css'

/** Use exact filename under public/assets/ (include extension as on disk) */
const PHYSICAL_TICKET_SRC = '/assets/physicalticket.PNG'

export default function PhysicalTicketExperience() {
  return (
    <div className="physical-ticket">
      <div className="physical-ticket__stage">
        <img
          className="physical-ticket__image"
          src={PHYSICAL_TICKET_SRC}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  )
}

/** Fixed-size slot for future card artwork — layout must not change when assets are swapped. */
export default function AssetSlot({ label }) {
  return (
    <div className="asset-slot" aria-hidden="true">
      <span className="asset-slot__hint">{label}</span>
    </div>
  )
}

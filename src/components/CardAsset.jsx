import './CardAsset.css'

export default function CardAsset({ src, video = false }) {
  return (
    <div className="card-asset">
      {video ? (
        <video
          className="card-asset__media"
          src={src}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <img className="card-asset__media" src={src} alt="" decoding="async" />
      )}
    </div>
  )
}

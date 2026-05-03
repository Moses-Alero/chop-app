export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__lines">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

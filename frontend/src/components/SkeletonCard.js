function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-body">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta">
          <div className="skeleton-rating"></div>
          <div className="skeleton-year"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;

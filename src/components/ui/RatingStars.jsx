import { useLanguage } from '../../context/LanguageContext';

function RatingStars({ rating = 0 }) {
  const { language } = useLanguage();
  const normalized = Math.max(0, Math.min(5, Number(rating)));
  const full = Math.floor(normalized);
  const hasHalf = normalized - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const ariaLabel = language === 'ar' ? `${normalized} من 5` : `${normalized} out of 5`;

  return (
    <span className="text-warning d-inline-flex align-items-center gap-1" aria-label={ariaLabel}>
      {Array.from({ length: full }).map((_, idx) => (
        <i key={`full-${idx}`} className="bi bi-star-fill" />
      ))}
      {hasHalf && <i className="bi bi-star-half" />}
      {Array.from({ length: empty }).map((_, idx) => (
        <i key={`empty-${idx}`} className="bi bi-star" />
      ))}
      <span className="text-muted ms-1" style={{ fontSize: '0.85rem' }}>
        {normalized.toFixed(1)}
      </span>
    </span>
  );
}

export default RatingStars;

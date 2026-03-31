import { useLanguage } from '../../context/LanguageContext';

const iconMap = {
  Medicines: 'bi-capsule',
  Vitamins: 'bi-bandaid',
  Baby: 'bi-balloon-heart',
  Cosmetics: 'bi-stars',
  'Medical Devices': 'bi-heart-pulse',
};

function CategorySection({ categories = [] }) {
  const { t, translateCategory } = useLanguage();

  if (!categories.length) return null;

  return (
    <section className="section-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="display-font mb-0">{t('home.shopByCategory')}</h2>
        <span className="text-muted">{t('home.curatedEssentials')}</span>
      </div>
      <div className="row g-3">
        {categories.map((category) => (
          <div key={category} className="col-6 col-md-4 col-lg-2">
            <div className="category-tile p-3 h-100 text-center d-flex flex-column justify-content-center align-items-center">
              <span
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: 48, height: 48, background: 'rgba(4, 120, 87, 0.1)' }}
              >
                <i className={`bi ${iconMap[category] || 'bi-grid'} text-success`} />
              </span>
              <strong>{translateCategory(category)}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;

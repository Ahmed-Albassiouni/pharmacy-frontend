import { useLanguage } from '../../context/LanguageContext';

function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  sortBy,
  onSortChange,
  options,
  maxPrice,
}) {
  const { t, translateCategory } = useLanguage();

  return (
    <div className="card-soft p-3 mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label mb-1">{t('filters.search')}</label>
          <input
            type="text"
            className="form-control"
            placeholder={t('filters.searchPlaceholder')}
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
          />
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label mb-1">{t('filters.category')}</label>
          <select
            className="form-select"
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            {options.categories.map((value) => (
              <option key={value} value={value}>
                {translateCategory(value)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label mb-1">{t('filters.brand')}</label>
          <select
            className="form-select"
            value={filters.brand}
            onChange={(event) => onFilterChange('brand', event.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            {options.brands.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label mb-1">{t('filters.stock')}</label>
          <select
            className="form-select"
            value={filters.stockStatus}
            onChange={(event) => onFilterChange('stockStatus', event.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="available">{t('filters.available')}</option>
            <option value="out-of-stock">{t('filters.outOfStock')}</option>
          </select>
        </div>

        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label mb-1">{t('filters.dosage')}</label>
          <select
            className="form-select"
            value={filters.dosage}
            onChange={(event) => onFilterChange('dosage', event.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            {options.dosages.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <label className="form-label mb-1">{t('filters.sort')}</label>
          <select className="form-select" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            <option value="popularity">{t('filters.popularity')}</option>
            <option value="price-low">{t('filters.priceLow')}</option>
            <option value="price-high">{t('filters.priceHigh')}</option>
            <option value="newest">{t('filters.newest')}</option>
          </select>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <label className="form-label mb-1">{t('filters.maxPrice')}</label>
          <input
            type="range"
            className="form-range"
            min="0"
            max={maxPrice || 2000}
            step="5"
            value={filters.maxPrice}
            onChange={(event) => onFilterChange('maxPrice', Number(event.target.value))}
          />
          <small className="text-muted">{t('filters.upToEgp', { value: filters.maxPrice })}</small>
        </div>

        <div className="col-12 col-md-4 col-lg-2">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={onReset}>
            {t('filters.resetFilters')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;

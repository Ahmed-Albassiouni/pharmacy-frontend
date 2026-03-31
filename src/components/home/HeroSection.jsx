import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

function HeroSection({ onSearch }) {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword);
  };

  return (
    <section className="hero-shell p-4 p-md-5 mt-4 section-shell">
      <div className="row g-4 align-items-center">
        <div className="col-lg-7">
          <span className="glass-chip px-3 py-2 fw-semibold">{t('hero.badge')}</span>
          <h1 className="display-font mt-3 mb-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)' }}>
            {t('hero.title')}
          </h1>
          <p className="mb-4 text-white-50 fs-5">
            {t('hero.subtitle')}
          </p>

          <form className="d-flex gap-2 flex-column flex-sm-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control form-control-lg search-box"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t('hero.searchPlaceholder')}
            />
            <button type="submit" className="btn btn-light btn-lg fw-bold px-4">
              <i className="bi bi-search me-2" />
              {t('hero.searchButton')}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="d-grid gap-3">
            <div className="hero-banner">
              <h5 className="mb-1">{t('hero.expressDeliveryTitle')}</h5>
              <p className="mb-0 text-white-50">{t('hero.expressDeliveryText')}</p>
            </div>
            <div className="hero-banner">
              <h5 className="mb-1">{t('hero.stockAlertsTitle')}</h5>
              <p className="mb-0 text-white-50">{t('hero.stockAlertsText')}</p>
            </div>
            <div className="hero-banner d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{t('hero.supportTitle')}</h5>
                <p className="mb-0 text-white-50">{t('hero.supportText')}</p>
              </div>
              <Link to="/consultation" className="btn btn-warning fw-semibold">
                {t('hero.consultButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const arOffers = {
  'offer-1': {
    title: 'باقة العافية الأسبوعية',
    subtitle: 'وفّر حتى 25% على الفيتامينات ودعم المناعة.',
    cta: 'تسوق الفيتامينات',
  },
  'offer-2': {
    title: 'أسبوع العناية بالرضع',
    subtitle: 'عروض حصرية على الحفاضات ومنتجات العناية بالبشرة.',
    cta: 'تسوق منتجات الرضع',
  },
  'offer-3': {
    title: 'عرض الأجهزة الطبية',
    subtitle: 'احصل على أجهزة طبية موثوقة مع شحن مجاني.',
    cta: 'تسوق الأجهزة',
  },
};

function OffersCarousel({ offers = [] }) {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (offers.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % offers.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [offers]);

  const localizedOffers = useMemo(() => {
    if (language !== 'ar') return offers;

    return offers.map((offer) => {
      const localized = arOffers[offer.id];
      if (!localized) return offer;

      return {
        ...offer,
        title: localized.title,
        subtitle: localized.subtitle,
        cta: localized.cta,
      };
    });
  }, [language, offers]);

  if (!localizedOffers.length) return null;

  const activeOffer = localizedOffers[activeIndex];

  return (
    <section className="section-shell">
      <div className="card-soft p-3 p-md-4">
        <div
          className="offer-slide"
          style={{
            background: activeOffer.color,
          }}
        >
          <small className="text-uppercase fw-semibold opacity-75">{t('home.offersAndDiscounts')}</small>
          <h3 className="display-font mt-2 mb-2">{activeOffer.title}</h3>
          <p className="mb-3 fs-5">{activeOffer.subtitle}</p>
          <button type="button" className="btn btn-light align-self-start fw-semibold">
            {activeOffer.cta}
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex gap-2">
            {localizedOffers.map((offer, idx) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`btn btn-sm rounded-pill ${
                  idx === activeIndex ? 'btn-success' : 'btn-outline-secondary'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? localizedOffers.length - 1 : prev - 1))}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => setActiveIndex((prev) => (prev + 1) % localizedOffers.length)}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OffersCarousel;

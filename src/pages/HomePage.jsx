import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import OffersCarousel from '../components/home/OffersCarousel';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Modal from '../components/ui/Modal';
import RatingStars from '../components/ui/RatingStars';
import { getHomePageData } from '../api/pharmacyApi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    featuredProducts: [],
    offers: [],
    categories: [],
    outOfStock: [],
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getHomePageData();
        setHomeData(response);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (keyword) => {
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  const handleBuyNow = (product) => {
    const added = addToCart(product, 1);
    if (added) {
      navigate('/checkout');
    }
  };

  return (
    <>
      <HeroSection onSearch={handleSearch} />

      <section className="section-shell">
        <div className="card-soft p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="display-font mb-0">{t('home.stockNotifications')}</h2>
            <span className="text-muted">{t('home.updatedRealtime')}</span>
          </div>
          {loading ? (
            <p className="mb-0">{t('home.loadingNotifications')}</p>
          ) : homeData.outOfStock.length ? (
            <div className="row g-2 mt-1">
              {homeData.outOfStock.map((item) => (
                <div className="col-md-4" key={item.id}>
                  <div className="p-2 rounded bg-danger-subtle text-danger-emphasis fw-semibold">
                    {t('home.outOfStockNow', { name: item.name })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-0 text-success fw-semibold">{t('home.allAvailable')}</p>
          )}
        </div>
      </section>

      <OffersCarousel offers={homeData.offers} />
      <CategorySection categories={homeData.categories} />
      <FeaturedProducts
        products={homeData.featuredProducts}
        onQuickView={setQuickViewProduct}
        onBuyNow={handleBuyNow}
      />

      <Modal
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        title={quickViewProduct?.name}
      >
        {quickViewProduct && (
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <img src={quickViewProduct.images?.[0]} alt={quickViewProduct.name} className="img-fluid rounded" />
            </div>
            <div className="col-md-7">
              <p className="mb-1 text-muted">{quickViewProduct.brand}</p>
              <RatingStars rating={quickViewProduct.rating} />
              <p className="mt-3 mb-2">{quickViewProduct.description}</p>
              <p className="fw-bold fs-5 mb-3">{formatCurrency(quickViewProduct.price)}</p>
              <div className="d-flex gap-2">
                <button className="btn btn-brand" onClick={() => addToCart(quickViewProduct)}>
                  {t('common.addToCart')}
                </button>
                <button className="btn btn-accent" onClick={() => handleBuyNow(quickViewProduct)}>
                  {t('common.buyNow')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default HomePage;

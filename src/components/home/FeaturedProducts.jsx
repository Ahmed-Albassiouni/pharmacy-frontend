import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

function FeaturedProducts({ products = [], onQuickView, onBuyNow }) {
  const { t } = useLanguage();

  if (!products.length) return null;

  return (
    <section className="section-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="display-font mb-0">{t('home.featuredProducts')}</h2>
        <Link to="/products" className="btn btn-outline-success">
          {t('home.viewAllProducts')}
        </Link>
      </div>
      <div className="row g-3">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-3">
            <ProductCard
              product={product}
              onQuickView={() => onQuickView(product)}
              onBuyNow={() => onBuyNow(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;

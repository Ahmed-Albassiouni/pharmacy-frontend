import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById, getProducts } from '../api/pharmacyApi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import RatingStars from '../components/ui/RatingStars';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, translateCategory } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const details = await getProductById(id);
        setProduct(details);
        setActiveImage(details.images?.[0] || '');

        const related = await getProducts({ category: details.category, sortBy: 'popularity' });
        setRelatedProducts(related.filter((item) => item.id !== details.id).slice(0, 4));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="section-shell mt-4">
        <div className="card-soft p-4 text-center">{t('productDetails.loading')}</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section-shell mt-4">
        <div className="card-soft p-4 text-center">
          <h4>{t('productDetails.notFound')}</h4>
          <Link to="/products" className="btn btn-outline-success mt-2">
            {t('productDetails.backToProducts')}
          </Link>
        </div>
      </section>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleBuyNow = () => {
    const added = addToCart(product);
    if (added) {
      navigate('/checkout');
    }
  };

  return (
    <section className="section-shell mt-4">
      <div className="card-soft p-3 p-md-4">
        <div className="row g-4">
          <div className="col-lg-6">
            <img src={activeImage || product.images?.[0]} alt={product.name} className="img-fluid rounded-4 mb-3" />
            <div className="d-flex gap-2 flex-wrap">
              {product.images?.map((image) => (
                <button
                  type="button"
                  key={image}
                  className={`btn p-0 border ${activeImage === image ? 'border-success border-2' : 'border-light'}`}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={product.name} style={{ width: 86, height: 76, objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <small className="text-muted">{translateCategory(product.category)} • {product.brand}</small>
            <h1 className="display-font mb-2 mt-1">{product.name}</h1>
            <RatingStars rating={product.rating} />

            <div className="my-3 d-flex align-items-center gap-2">
              <span className={`badge-stock ${isOutOfStock ? 'out' : 'available'}`}>
                {isOutOfStock ? t('common.outOfStock') : t('productDetails.stockAvailable', { count: product.stock })}
              </span>
              <span className="badge text-bg-light">{t('productDetails.dosageLabel', { value: product.dosage })}</span>
            </div>

            <h3 className="mb-3">{formatCurrency(product.price)}</h3>
            <p>{product.description}</p>

            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <div className="p-3 rounded bg-light h-100">
                  <h6>{t('productDetails.usage')}</h6>
                  <p className="small mb-0">{product.usage}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded bg-light h-100">
                  <h6>{t('productDetails.dosage')}</h6>
                  <p className="small mb-0">{product.dosage}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded bg-light h-100">
                  <h6>{t('productDetails.warnings')}</h6>
                  <p className="small mb-0">{product.warnings}</p>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-brand" onClick={() => addToCart(product)} disabled={isOutOfStock}>
                {t('common.addToCart')}
              </button>
              <button className="btn btn-accent" onClick={handleBuyNow} disabled={isOutOfStock}>
                {t('common.buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-3 p-md-4 mt-3">
        <h3 className="display-font mb-3">{t('productDetails.customerReviews')}</h3>
        {product.reviews?.length ? (
          <div className="d-grid gap-3">
            {product.reviews.map((review) => (
              <article key={review.id} className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{review.user}</strong>
                  <small className="text-muted">{formatDate(review.date)}</small>
                </div>
                <RatingStars rating={review.rating} />
                <p className="mb-0 mt-2">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0">{t('productDetails.noReviews')}</p>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="display-font mb-0">{t('productDetails.relatedProducts')}</h3>
            <Link to="/products" className="btn btn-outline-success">
              {t('productDetails.browseAll')}
            </Link>
          </div>

          <div className="row g-3">
            {relatedProducts.map((item) => (
              <div className="col-sm-6 col-lg-3" key={item.id}>
                <ProductCard
                  product={item}
                  onQuickView={() => navigate(`/products/${item.id}`)}
                  onBuyNow={() => {
                    const added = addToCart(item);
                    if (added) navigate('/checkout');
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

export default ProductDetailPage;

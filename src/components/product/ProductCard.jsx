import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import RatingStars from '../ui/RatingStars';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

function ProductCard({ product, onQuickView, onBuyNow }) {
  const { addToCart } = useCart();
  const { currentUser, toggleFavorite } = useUser();
  const { t, translateCategory } = useLanguage();

  const isOutOfStock = product.stock === 0;
  const isFavorite = currentUser.favorites.includes(product.id);

  return (
    <article className="product-card p-3 d-flex flex-column gap-2">
      <div className="position-relative">
        <img src={product.images?.[0]} alt={product.name} className="product-image" loading="lazy" />
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle ${
            isFavorite ? 'btn-danger' : 'btn-light'
          }`}
          title={t('productCard.toggleFavorite')}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} />
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-start">
        <small className="text-muted">{product.brand}</small>
        <span className={`badge-stock ${isOutOfStock ? 'out' : 'available'}`}>
          {isOutOfStock ? t('common.outOfStock') : t('common.available')}
        </span>
      </div>

      <Link to={`/products/${product.id}`} className="fw-bold lh-sm">
        {product.name}
      </Link>

      <small className="text-muted">{translateCategory(product.category)} • {product.dosage}</small>

      <RatingStars rating={product.rating} />

      <div className="d-flex justify-content-between align-items-center mt-auto">
        <strong className="fs-5">{formatCurrency(product.price)}</strong>
        {product.discountLabel && <span className="badge text-bg-warning">{product.discountLabel}</span>}
      </div>

      <div className="d-grid gap-2 mt-2">
        <button
          type="button"
          className="btn btn-brand"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
        >
          {t('common.addToCart')}
        </button>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-accent flex-fill"
            onClick={onBuyNow}
            disabled={isOutOfStock}
          >
            {t('common.buyNow')}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onQuickView} title={t('productCard.quickView')}>
            <i className="bi bi-eye" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

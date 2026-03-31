import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

function CartPage() {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();

  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 45;
  const total = subtotal + shippingFee;

  if (!cartItems.length) {
    return (
      <section className="section-shell mt-4">
        <div className="card-soft p-5 text-center">
          <h2 className="display-font mb-2">{t('cart.emptyTitle')}</h2>
          <p className="text-muted mb-4">{t('cart.emptySubtitle')}</p>
          <Link to="/products" className="btn btn-brand">
            {t('cart.browseProducts')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell mt-4">
      <h1 className="display-font mb-3">{t('cart.title')}</h1>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card-soft p-3">
            {cartItems.map((item) => (
              <div key={item.productId} className="d-flex flex-column flex-md-row gap-3 py-3 border-bottom">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded"
                  style={{ width: 96, height: 82, objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <h5 className="mb-1">{item.name}</h5>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                  <p className="text-muted mb-2">{t('cart.unitPrice', { price: formatCurrency(item.price) })}</p>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: 72 }}
                      min="1"
                      max={item.maxStock}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <small className="text-muted">{t('cart.max', { count: item.maxStock })}</small>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-soft p-3 position-sticky" style={{ top: '90px' }}>
            <h4 className="mb-3">{t('common.orderSummary')}</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>{t('common.subtotal')}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>{t('common.shipping')}</span>
              <span>{shippingFee ? formatCurrency(shippingFee) : t('common.free')}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>{t('common.total')}</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-brand w-100">
              {t('cart.proceedCheckout')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartPage;

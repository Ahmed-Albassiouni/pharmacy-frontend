import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkoutOrder } from '../api/pharmacyApi';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { currentUser, authToken, appendOrder, refreshUserOrders } = useUser();
  const { showToast } = useToast();
  const { t, language } = useLanguage();

  const paymentMethods = useMemo(
    () => [
      { value: 'credit_card', label: t('checkout.creditCard') },
      { value: 'vodafone_cash', label: t('checkout.vodafoneCash') },
      { value: 'cash_on_delivery', label: t('checkout.cashOnDelivery') },
    ],
    [t],
  );

  const [form, setForm] = useState({
    fullName: currentUser.name,
    phone: currentUser.phone,
    shippingAddress: currentUser.addresses[0] || '',
    city: 'Cairo',
    notes: '',
    paymentMethod: 'credit_card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const shippingFee = subtotal >= 500 || subtotal === 0 ? 0 : 45;
  const total = subtotal + shippingFee;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cartItems.length) {
      showToast(t('checkout.cartEmptyToast'), 'error');
      return;
    }

    if (!authToken) {
      showToast(t('checkout.loginRequiredToast'), 'warning');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId: currentUser.id,
      customerName: form.fullName,
      shippingAddress: `${form.shippingAddress}, ${form.city}`,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      totalPrice: total,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const serverOrder = await checkoutOrder(payload, authToken);

      appendOrder(serverOrder);
      await refreshUserOrders();
      clearCart();
      setConfirmedOrder(serverOrder);
      showToast(t('checkout.orderPlacedToast'), 'success');
    } catch (error) {
      showToast(error?.response?.data?.message || t('checkout.orderFailedToast'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <section className="section-shell mt-4">
        <div className="card-soft p-5 text-center">
          <h1 className="display-font">{t('checkout.confirmedTitle')}</h1>
          <p className="text-muted mb-3">
            {language === 'ar'
              ? `طلبك رقم ${confirmedOrder.id} تم بتاريخ ${formatDate(confirmedOrder.createdAt)}.`
              : `Your order ${confirmedOrder.id} was placed on ${formatDate(confirmedOrder.createdAt)}.`}
          </p>
          <p className="mb-4">{t('checkout.confirmedSubtext')}</p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link to="/account" className="btn btn-brand">
              {t('checkout.viewAccount')}
            </Link>
            <Link to="/products" className="btn btn-outline-secondary">
              {t('checkout.continueShopping')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!cartItems.length) {
    return (
      <section className="section-shell mt-4">
        <div className="card-soft p-5 text-center">
          <h2 className="display-font mb-2">{t('checkout.noItemsTitle')}</h2>
          <p className="text-muted mb-4">{t('checkout.noItemsSubtitle')}</p>
          <Link to="/products" className="btn btn-brand">
            {t('cart.browseProducts')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell mt-4">
      <h1 className="display-font mb-3">{t('checkout.title')}</h1>
      <div className="row g-3">
        <div className="col-lg-7">
          <form className="card-soft p-3 p-md-4" onSubmit={handleSubmit}>
            <h5 className="mb-3">{t('checkout.shippingDetails')}</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">{t('checkout.fullName')}</label>
                <input
                  className="form-control"
                  value={form.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('checkout.phone')}</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">{t('checkout.address')}</label>
                <input
                  className="form-control"
                  value={form.shippingAddress}
                  onChange={(event) => handleChange('shippingAddress', event.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('checkout.city')}</label>
                <input
                  className="form-control"
                  value={form.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">{t('checkout.orderNotes')}</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder={t('checkout.orderNotesPlaceholder')}
                  value={form.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                />
              </div>
            </div>

            <h5 className="my-3">{t('checkout.paymentMethod')}</h5>
            <div className="d-grid gap-2 mb-4">
              {paymentMethods.map((method) => (
                <label key={method.value} className="border rounded-3 p-2 d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={form.paymentMethod === method.value}
                    onChange={() => handleChange('paymentMethod', method.value)}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>

            <button className="btn btn-brand w-100" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('checkout.placingOrder') : t('checkout.confirmOrder')}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card-soft p-3 p-md-4 position-sticky" style={{ top: '90px' }}>
            <h5 className="mb-3">{t('common.orderSummary')}</h5>
            <div className="d-grid gap-2 mb-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="d-flex justify-content-between small">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-1">
              <span>{t('common.subtotal')}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>{t('common.shipping')}</span>
              <span>{shippingFee ? formatCurrency(shippingFee) : t('common.free')}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>{t('common.total')}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;

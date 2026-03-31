import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

function AccountPage() {
  const navigate = useNavigate();
  const { currentUser, userOrders, updateProfile, addAddress } = useUser();
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const { t, translateStatus } = useLanguage();

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });
  const [addressInput, setAddressInput] = useState('');

  const favorites = useMemo(
    () => products.filter((product) => currentUser.favorites.includes(product.id)),
    [products, currentUser.favorites],
  );

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });
  };

  const handleAddAddress = () => {
    if (!addressInput.trim()) return;
    addAddress(addressInput);
    setAddressInput('');
  };

  return (
    <section className="section-shell mt-4">
      <h1 className="display-font mb-3">{t('account.title')}</h1>
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card-soft p-3 mb-3">
            <h5 className="mb-3">{t('account.personalInformation')}</h5>
            <form onSubmit={handleProfileSubmit} className="d-grid gap-2">
              <input
                className="form-control"
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                type="email"
                className="form-control"
                value={profileForm.email}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                className="form-control"
                value={profileForm.phone}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <button className="btn btn-brand" type="submit">
                {t('account.saveProfile')}
              </button>
            </form>
          </div>

          <div className="card-soft p-3">
            <h5 className="mb-3">{t('account.addresses')}</h5>
            <div className="d-grid gap-2 mb-3">
              {currentUser.addresses.map((address, index) => (
                <div className="border rounded p-2 small" key={`${address}-${index}`}>
                  {address}
                </div>
              ))}
            </div>
            <div className="input-group">
              <input
                className="form-control"
                placeholder={t('account.addNewAddress')}
                value={addressInput}
                onChange={(event) => setAddressInput(event.target.value)}
              />
              <button className="btn btn-outline-success" type="button" onClick={handleAddAddress}>
                {t('account.addAddress')}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-soft p-3 mb-3">
            <h5 className="mb-3">{t('account.orderHistory')}</h5>
            {userOrders.length ? (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>{t('account.orderId')}</th>
                      <th>{t('account.date')}</th>
                      <th>{t('account.status')}</th>
                      <th>{t('common.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-semibold">{order.id}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <span className={`status-pill ${order.status}`}>{translateStatus(order.status)}</span>
                        </td>
                        <td>{formatCurrency(order.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted mb-0">{t('account.noOrders')}</p>
            )}
          </div>

          <div className="card-soft p-3">
            <h5 className="mb-3">{t('account.favoriteProducts')}</h5>
            {favorites.length ? (
              <div className="row g-2">
                {favorites.map((product) => (
                  <div key={product.id} className="col-sm-6">
                    <div className="border rounded p-2 h-100 d-flex gap-2">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        style={{ width: 72, height: 72, objectFit: 'cover' }}
                        className="rounded"
                      />
                      <div className="flex-grow-1">
                        <strong className="d-block lh-sm mb-1">{product.name}</strong>
                        <small className="text-muted d-block mb-1">{formatCurrency(product.price)}</small>
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {t('account.actionAdd')}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              const added = addToCart(product);
                              if (added) navigate('/checkout');
                            }}
                            disabled={product.stock === 0}
                          >
                            {t('common.buyNow')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">{t('account.noFavorites')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;

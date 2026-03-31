import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

const initialForm = {
  name: '',
  email: '',
  address: '',
  password: '',
  confirmPassword: '',
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, currentUser } = useUser();
  const { t } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fallbackPath = currentUser.role === 'admin' ? '/admin/dashboard' : '/account';
    navigate(fallbackPath, { replace: true });
  }, [isAuthenticated, currentUser.role, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (form.password.length < 6) {
      setLocalError(t('auth.passwordTooShort'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLocalError('');
    setIsSubmitting(true);

    const result = await register({
      name: form.name,
      email: form.email,
      address: form.address,
      password: form.password,
    });

    setIsSubmitting(false);

    if (!result.ok) return;

    const nextPath = result.user.role === 'admin' ? '/admin/dashboard' : '/account';
    navigate(nextPath, { replace: true });
  };

  return (
    <section className="section-shell auth-shell mt-4">
      <div className="auth-grid card-soft overflow-hidden">
        <aside className="auth-brand-panel d-none d-lg-flex auth-brand-panel-register">
          <div className="auth-brand-overlay" />
          <div className="auth-brand-content">
            <div className="auth-logo-lockup">
              <span className="auth-logo-mark">
                <i className="bi bi-heart-pulse" />
              </span>
              <div>
                <h2 className="display-font mb-1">{t('brand.name')}</h2>
                <p className="mb-0 auth-slogan">{t('brand.registerSlogan')}</p>
              </div>
            </div>

            <p className="auth-brand-text">{t('auth.registerBrandText')}</p>

            <div className="d-grid gap-2 mt-4 auth-feature-list">
              <div><i className="bi bi-stars" /> {t('auth.registerFeature1')}</div>
              <div><i className="bi bi-clock-history" /> {t('auth.registerFeature2')}</div>
              <div><i className="bi bi-headset" /> {t('auth.registerFeature3')}</div>
            </div>
          </div>
        </aside>

        <div className="auth-form-panel p-3 p-md-4 p-xl-5">
          <div className="auth-form-head mb-4">
            <span className="badge rounded-pill text-bg-warning-subtle text-warning-emphasis">{t('auth.registerBadge')}</span>
            <h1 className="display-font mt-2 mb-1">{t('auth.registerTitle')}</h1>
            <p className="text-muted mb-0">{t('auth.registerSubtitle')}</p>
          </div>

          <form className="d-grid gap-3" onSubmit={handleSubmit}>
            <label className="auth-input-wrap">
              <span>{t('auth.fullName')}</span>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person" /></span>
                <input
                  className="form-control"
                  placeholder={t('auth.namePlaceholder')}
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
            </label>

            <label className="auth-input-wrap">
              <span>{t('auth.emailAddress')}</span>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope" /></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder={t('auth.emailPlaceholder')}
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
            </label>

            <label className="auth-input-wrap">
              <span>{t('auth.address')}</span>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-geo-alt" /></span>
                <input
                  className="form-control"
                  placeholder={t('auth.addressPlaceholder')}
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </div>
            </label>

            <div className="row g-2">
              <div className="col-md-6">
                <label className="auth-input-wrap w-100">
                  <span>{t('auth.password')}</span>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock" /></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={t('auth.passwordMinPlaceholder')}
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="col-md-6">
                <label className="auth-input-wrap w-100">
                  <span>{t('auth.confirmPassword')}</span>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-shield-lock" /></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={t('auth.repeatPasswordPlaceholder')}
                      value={form.confirmPassword}
                      onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            {localError && <p className="text-danger small mb-0">{localError}</p>}

            <button className="btn btn-brand auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          <div className="auth-switch mt-4">
            <span className="text-muted">{t('auth.registerSwitchText')}</span>
            <Link to="/login" className="btn btn-outline-success">{t('auth.signInAction')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;

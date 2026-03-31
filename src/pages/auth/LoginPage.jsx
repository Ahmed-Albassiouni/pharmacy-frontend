import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

const initialForm = {
  email: '',
  password: '',
};

function resolveRedirectPath(role, requestedPath) {
  const defaultPath = role === 'admin' ? '/admin/dashboard' : '/account';

  if (!requestedPath) return defaultPath;
  if (requestedPath.startsWith('/admin') && role !== 'admin') return defaultPath;

  return requestedPath;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, currentUser } = useUser();
  const { t } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const nextPath = resolveRedirectPath(currentUser.role, location.state?.from);
    navigate(nextPath, { replace: true });
  }, [isAuthenticated, currentUser.role, location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const result = await login(form);
    setIsSubmitting(false);

    if (!result.ok) return;

    const nextPath = resolveRedirectPath(result.user.role, location.state?.from);
    navigate(nextPath, { replace: true });
  };

  return (
    <section className="section-shell auth-shell mt-4">
      <div className="auth-grid card-soft overflow-hidden">
        <aside className="auth-brand-panel d-none d-lg-flex">
          <div className="auth-brand-overlay" />
          <div className="auth-brand-content">
            <div className="auth-logo-lockup">
              <span className="auth-logo-mark">
                <i className="bi bi-capsule-pill" />
              </span>
              <div>
                <h2 className="display-font mb-1">{t('brand.name')}</h2>
                <p className="mb-0 auth-slogan">{t('brand.slogan')}</p>
              </div>
            </div>

            <p className="auth-brand-text">{t('auth.loginBrandText')}</p>

            <div className="d-grid gap-2 mt-4 auth-feature-list">
              <div><i className="bi bi-shield-check" /> {t('auth.loginFeature1')}</div>
              <div><i className="bi bi-truck" /> {t('auth.loginFeature2')}</div>
              <div><i className="bi bi-clipboard2-pulse" /> {t('auth.loginFeature3')}</div>
            </div>
          </div>
        </aside>

        <div className="auth-form-panel p-3 p-md-4 p-xl-5">
          <div className="auth-form-head mb-4">
            <span className="badge rounded-pill text-bg-success-subtle text-success-emphasis">{t('auth.loginBadge')}</span>
            <h1 className="display-font mt-2 mb-1">{t('auth.loginTitle')}</h1>
            <p className="text-muted mb-0">{t('auth.loginSubtitle')}</p>
          </div>

          <form className="d-grid gap-3" onSubmit={handleSubmit}>
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
              <span>{t('auth.password')}</span>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>
            </label>

            <button className="btn btn-brand auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          <div className="auth-switch mt-4">
            <span className="text-muted">{t('auth.loginSwitchText')}</span>
            <Link to="/register" className="btn btn-outline-success">{t('auth.createAccountAction')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

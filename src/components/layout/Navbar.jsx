import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, isAuthenticated, isAdmin, logout } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const baseLinks = [
    { to: '/', label: t('common.home') },
    { to: '/products', label: t('common.products') },
    { to: '/consultation', label: t('common.consultation') },
  ];

  const publicLinks = isAuthenticated
    ? [...baseLinks, { to: '/account', label: t('common.myAccount') }]
    : baseLinks;

  const firstName = currentUser?.name?.split(' ')?.[0] || '';

  return (
    <nav className="navbar navbar-expand-lg sticky-top nav-surface">
      <div className="container-xl py-2">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span className="brand-mark">
            <i className="bi bi-capsule-pill" />
          </span>
          <span>
            {t('brand.name')}
            <small className="d-block text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>
              {t('brand.slogan')}
            </small>
          </span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
          aria-controls="publicNav"
          aria-expanded="false"
          aria-label={t('navbar.toggleNavigation')}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="publicNav">
          <div className="navbar-nav ms-auto gap-2 align-items-lg-center">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link nav-link-pill ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleLanguage}
              title={language === 'ar' ? t('language.switchToEnglish') : t('language.switchToArabic')}
              aria-label={language === 'ar' ? t('language.switchToEnglish') : t('language.switchToArabic')}
            >
              <i className="bi bi-translate me-2" />
              {t('language.current')}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleTheme}
              title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
              aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
            >
              <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'} me-2`} />
              {isDark ? t('theme.light') : t('theme.dark')}
            </button>

            <NavLink className="btn btn-outline-success position-relative" to="/cart">
              <i className="bi bi-cart3 me-2" />
              {t('common.cart')}
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <>
                <span className="small text-muted fw-semibold d-none d-lg-inline">
                  {t('navbar.greeting', { name: firstName })}
                </span>
                <button type="button" className="btn btn-outline-dark btn-logout" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2" />
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-dark" to="/login">
                  <i className="bi bi-person me-2" />
                  {t('common.login')}
                </NavLink>
                <NavLink className="btn btn-brand" to="/register">
                  <i className="bi bi-person-plus me-2" />
                  {t('common.register')}
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink className="btn btn-dark" to="/admin/dashboard">
                <i className="bi bi-speedometer2 me-2" />
                {t('common.admin')}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

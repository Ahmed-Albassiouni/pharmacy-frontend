import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

function AdminSidebar({ open, onClose }) {
  const { t } = useLanguage();

  const links = [
    { to: '/admin/dashboard', label: t('admin.dashboard'), icon: 'bi-speedometer2' },
    { to: '/admin/orders', label: t('admin.orders'), icon: 'bi-bag-check' },
    { to: '/admin/products', label: t('admin.products'), icon: 'bi-capsule' },
    { to: '/admin/users', label: t('admin.users'), icon: 'bi-people' },
    { to: '/admin/reports', label: t('admin.reports'), icon: 'bi-graph-up-arrow' },
  ];

  return (
    <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-white">{t('admin.sidebarTitle')}</h4>
        <button className="btn btn-sm btn-outline-light d-lg-none" onClick={onClose} type="button">
          <i className="bi bi-x-lg" />
        </button>
      </div>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `dashboard-link ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${link.icon}`} />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}

export default AdminSidebar;

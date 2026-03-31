import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useLanguage } from '../../context/LanguageContext';

function AdminLayout() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-wrap">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          className="btn position-fixed top-0 bottom-0 start-0 end-0 d-lg-none"
          style={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
          onClick={() => setSidebarOpen(false)}
          aria-label={t('admin.closeSidebar')}
        />
      )}

      <div className="dashboard-main">
        <header className="card-soft p-3 mb-3 d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-outline-dark d-lg-none me-2" onClick={() => setSidebarOpen(true)} type="button">
              <i className="bi bi-list" />
            </button>
            <strong>{t('admin.headerTitle')}</strong>
          </div>

          <Link className="btn btn-sm btn-outline-success" to="/">
            <i className="bi bi-shop me-2" />
            {t('admin.backToStore')}
          </Link>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

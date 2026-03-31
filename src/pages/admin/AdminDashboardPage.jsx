import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/currency';

function AdminDashboardPage() {
  const { dashboardStats, revenueReports, products, fetchAdminData } = useAdmin();
  const { t, translatePeriod } = useLanguage();
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const chartData = revenueReports[period] || [];
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  const lowStock = useMemo(() => products.filter((product) => product.stock > 0 && product.stock <= 10), [products]);
  const outOfStock = useMemo(() => products.filter((product) => product.stock === 0), [products]);

  return (
    <section>
      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title={t('admin.totalOrders')}
            value={dashboardStats.totalOrders}
            icon="bi-bag-check"
            background="linear-gradient(135deg, #0f766e, #14b8a6)"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title={t('admin.totalSales')}
            value={formatCurrency(dashboardStats.totalSales)}
            icon="bi-currency-dollar"
            background="linear-gradient(135deg, #1d4ed8, #0284c7)"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title={t('admin.outOfStock')}
            value={dashboardStats.outOfStockMedicines}
            icon="bi-exclamation-triangle"
            background="linear-gradient(135deg, #b91c1c, #ef4444)"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title={t('admin.registeredUsers')}
            value={dashboardStats.totalUsers}
            icon="bi-people"
            background="linear-gradient(135deg, #4f46e5, #7c3aed)"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="chart-shell">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{t('admin.revenueTrend')}</h5>
              <div className="btn-group btn-group-sm">
                {['daily', 'weekly', 'monthly'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn ${item === period ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setPeriod(item)}
                  >
                    {translatePeriod(item)}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length ? (
              chartData.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span style={{ width: 90 }} className="small text-muted">
                    {item.label}
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(item.value / maxValue) * 100}%` }} />
                  </div>
                  <strong className="small">{formatCurrency(item.value)}</strong>
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">{t('admin.noRevenue')}</p>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="chart-shell mb-3">
            <h6 className="mb-3">{t('admin.lowStockMedicines')}</h6>
            {lowStock.length ? (
              <div className="d-grid gap-2">
                {lowStock.map((product) => (
                  <div key={product.id} className="d-flex justify-content-between small border rounded p-2">
                    <span>{product.name}</span>
                    <strong className="text-warning">{t('admin.left', { count: product.stock })}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">{t('admin.noLowStock')}</p>
            )}
          </div>

          <div className="chart-shell">
            <h6 className="mb-3">{t('admin.outOfStockList')}</h6>
            {outOfStock.length ? (
              <ul className="list-group list-group-flush">
                {outOfStock.map((product) => (
                  <li key={product.id} className="list-group-item px-0 d-flex justify-content-between">
                    <span>{product.name}</span>
                    <span className="text-danger fw-semibold">{t('admin.out')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">{t('admin.allInStock')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;

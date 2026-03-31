import { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/currency';

function AdminReportsPage() {
  const { revenueReports, products, fetchAdminData } = useAdmin();
  const { t, translatePeriod } = useLanguage();
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const chartData = revenueReports[period] || [];
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  const stockOverview = useMemo(
    () => products.filter((product) => product.stock <= 10),
    [products],
  );

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{t('admin.reportsTitle')}</h2>
        <div className="btn-group btn-group-sm">
          {['daily', 'weekly', 'monthly'].map((value) => (
            <button
              key={value}
              className={`btn ${period === value ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setPeriod(value)}
            >
              {translatePeriod(value)}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="chart-shell">
            <h5 className="mb-3">{t('admin.salesOverview', { period: translatePeriod(period) })}</h5>
            {chartData.length ? (
              chartData.map((entry) => (
                <div className="bar-row" key={entry.label}>
                  <span style={{ width: 90 }} className="small text-muted">
                    {entry.label}
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(entry.value / maxValue) * 100}%` }} />
                  </div>
                  <strong className="small">{formatCurrency(entry.value)}</strong>
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">{t('admin.noSalesData')}</p>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="chart-shell">
            <h5 className="mb-3">{t('admin.stockOverview')}</h5>
            {stockOverview.length ? (
              <div className="d-grid gap-2">
                {stockOverview.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded p-2 d-flex justify-content-between align-items-center ${
                      product.stock === 0 ? 'bg-danger-subtle' : 'bg-warning-subtle'
                    }`}
                  >
                    <span className="small">{product.name}</span>
                    <strong className="small">{product.stock === 0 ? t('admin.out') : t('admin.left', { count: product.stock })}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">{t('admin.noLowStockRecords')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminReportsPage;

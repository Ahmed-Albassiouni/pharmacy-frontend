import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { useLanguage } from '../../context/LanguageContext';

const statuses = ['pending', 'completed', 'canceled'];

function OrdersTable({ orders, onStatusChange, onViewDetails }) {
  const { t, translateStatus } = useLanguage();

  return (
    <div className="table-wrap">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('admin.orderId')}</th>
              <th>{t('admin.customerName')}</th>
              <th>{t('admin.status')}</th>
              <th>{t('common.total')}</th>
              <th>{t('admin.date')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="fw-semibold">{order.id}</td>
                <td>{order.customerName}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(event) => onStatusChange(order.id, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {translateStatus(status)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onViewDetails(order)}>
                    {t('admin.viewDetails')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;

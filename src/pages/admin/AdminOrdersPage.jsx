import { useEffect, useMemo, useState } from 'react';
import OrdersTable from '../../components/admin/OrdersTable';
import Modal from '../../components/ui/Modal';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/currency';

function AdminOrdersPage() {
  const { orders, updateOrderStatus, fetchAdminData } = useAdmin();
  const { t, translateStatus, translatePaymentMethod } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const orderedRecords = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  );

  const stats = useMemo(() => {
    const pending = orders.filter((item) => item.status === 'pending').length;
    const completed = orders.filter((item) => item.status === 'completed').length;
    const canceled = orders.filter((item) => item.status === 'canceled').length;
    return { pending, completed, canceled };
  }, [orders]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{t('admin.ordersManagement')}</h2>
        <span className="text-muted">{t('admin.totalOrdersCount', { count: orders.length })}</span>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-sm-4">
          <div className="card-soft p-2 text-center">
            <strong className="text-warning">{t('admin.pendingCount', { count: stats.pending })}</strong>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-soft p-2 text-center">
            <strong className="text-success">{t('admin.completedCount', { count: stats.completed })}</strong>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-soft p-2 text-center">
            <strong className="text-danger">{t('admin.canceledCount', { count: stats.canceled })}</strong>
          </div>
        </div>
      </div>

      <OrdersTable
        orders={orderedRecords}
        onStatusChange={updateOrderStatus}
        onViewDetails={setSelectedOrder}
      />

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={t('admin.orderDetailsTitle', { id: selectedOrder?.id || '' })}
      >
        {selectedOrder && (
          <>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <strong>{t('admin.customer')}:</strong> {selectedOrder.customerName}
              </div>
              <div className="col-md-6">
                <strong>{t('admin.status')}:</strong>{' '}
                <span className={`status-pill ${selectedOrder.status}`}>{translateStatus(selectedOrder.status)}</span>
              </div>
              <div className="col-md-6">
                <strong>{t('admin.payment')}:</strong> {translatePaymentMethod(selectedOrder.paymentMethod)}
              </div>
              <div className="col-md-6">
                <strong>{t('common.total')}:</strong> {formatCurrency(selectedOrder.totalPrice)}
              </div>
              <div className="col-12">
                <strong>{t('admin.shippingAddress')}:</strong> {selectedOrder.shippingAddress || t('admin.notProvided')}
              </div>
            </div>

            <h6>{t('admin.items')}</h6>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>{t('admin.product')}</th>
                    <th>{t('admin.qty')}</th>
                    <th>{t('admin.unitPrice')}</th>
                    <th>{t('admin.lineTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={`${selectedOrder.id}-${item.productId}`}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}

export default AdminOrdersPage;

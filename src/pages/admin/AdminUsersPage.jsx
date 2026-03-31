import { useEffect, useMemo, useState } from 'react';
import UsersTable from '../../components/admin/UsersTable';
import Modal from '../../components/ui/Modal';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

function AdminUsersPage() {
  const { users, orders, fetchAdminData } = useAdmin();
  const { t, translateRole, translateStatus } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const selectedUserOrders = useMemo(() => {
    if (!selectedUser) return [];
    return orders.filter((order) => order.userId === selectedUser.id);
  }, [orders, selectedUser]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{t('admin.usersManagement')}</h2>
        <span className="text-muted">{t('admin.registeredUsersCount', { count: users.length })}</span>
      </div>

      <UsersTable users={users} onViewOrders={setSelectedUser} />

      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={t('admin.ordersOfUser', { name: selectedUser?.name || '' })}
      >
        {selectedUser && (
          <>
            <p className="mb-1">
              <strong>{t('admin.email')}:</strong> {selectedUser.email}
            </p>
            <p className="mb-3">
              <strong>{t('admin.role')}:</strong> {translateRole(selectedUser.role)}
            </p>

            {selectedUserOrders.length ? (
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>{t('admin.orderId')}</th>
                      <th>{t('admin.date')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('common.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
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
              <p className="text-muted mb-0">{t('admin.noOrdersForUser')}</p>
            )}
          </>
        )}
      </Modal>
    </section>
  );
}

export default AdminUsersPage;

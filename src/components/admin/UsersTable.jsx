import { useLanguage } from '../../context/LanguageContext';

function UsersTable({ users, onToggleStatus, onViewOrders }) {
  const { t, translateRole } = useLanguage();

  return (
    <div className="table-wrap">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.ordersCount')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="fw-semibold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-pill ${user.role === 'admin' ? 'pending' : 'active'}`}>
                    {translateRole(user.role)}
                  </span>
                </td>
                <td>{user.ordersCount}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => onViewOrders?.(user)}>
                      {t('admin.viewOrders')}
                    </button>
                    {onToggleStatus && (
                      <button className="btn btn-sm btn-outline-warning" onClick={() => onToggleStatus(user.id)}>
                        {user.status === 'active' ? t('admin.block') : t('admin.unblock')}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;


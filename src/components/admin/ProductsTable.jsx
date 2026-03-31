import { formatCurrency } from '../../utils/currency';
import { useLanguage } from '../../context/LanguageContext';

function ProductsTable({ products, onEdit, onDelete }) {
  const { t, translateCategory } = useLanguage();

  return (
    <div className="table-wrap products-table">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.category')}</th>
              <th>{t('admin.price')}</th>
              <th>{t('admin.stockQty')}</th>
              <th>{t('admin.status')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.stock === 0 ? 'table-danger' : ''}>
                <td className="fw-semibold">{product.name}</td>
                <td>{translateCategory(product.category)}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-pill ${product.stock > 0 ? 'available' : 'canceled'}`}>
                    {product.stock > 0 ? t('common.available') : t('common.outOfStock')}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(product)}>
                      {t('admin.edit')}
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product)}>
                      {t('admin.delete')}
                    </button>
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

export default ProductsTable;

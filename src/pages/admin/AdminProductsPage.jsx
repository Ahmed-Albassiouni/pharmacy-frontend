import { useMemo, useState } from 'react';
import ProductsTable from '../../components/admin/ProductsTable';
import Modal from '../../components/ui/Modal';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import { productCategories } from '../../data/mockProducts';

const emptyForm = {
  name: '',
  category: 'Medicines',
  brand: '',
  dosage: '',
  price: 0,
  stock: 0,
  description: '',
  usage: '',
  warnings: '',
  imagesInput: '',
};

function AdminProductsPage() {
  const { products, addProduct, editProduct, deleteProduct } = useAdmin();
  const { t, translateCategory } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(a.stock) - Number(b.stock)),
    [products],
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      dosage: product.dosage,
      price: product.price,
      stock: product.stock,
      description: product.description,
      usage: product.usage,
      warnings: product.warnings,
      imagesInput: product.images?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      dosage: form.dosage.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      usage: form.usage.trim(),
      warnings: form.warnings.trim(),
      images: form.imagesInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const success = editingProduct
      ? await editProduct(editingProduct.id, payload)
      : await addProduct(payload);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      const success = await deleteProduct(selectedProduct.id);
      if (!success) return;
    }
    setSelectedProduct(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{t('admin.productsManagement')}</h2>
        <button className="btn btn-success" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-2" />{t('admin.addProduct')}
        </button>
      </div>

      <ProductsTable products={sortedProducts} onEdit={openEditModal} onDelete={openDeleteModal} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? t('admin.editProduct') : t('admin.addNewProduct')}
      >
        <form onSubmit={handleSave} className="row g-2">
          <div className="col-md-6">
            <label className="form-label">{t('admin.name')}</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('admin.category')}</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {translateCategory(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('filters.brand')}</label>
            <input
              className="form-control"
              value={form.brand}
              onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('filters.dosage')}</label>
            <input
              className="form-control"
              value={form.dosage}
              onChange={(event) => setForm((prev) => ({ ...prev, dosage: event.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('admin.priceEgp')}</label>
            <input
              type="number"
              className="form-control"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              min="0"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('admin.stockQuantity')}</label>
            <input
              type="number"
              className="form-control"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              min="0"
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">{t('admin.imageUrls')}</label>
            <input
              className="form-control"
              value={form.imagesInput}
              onChange={(event) => setForm((prev) => ({ ...prev, imagesInput: event.target.value }))}
              placeholder={t('admin.imagePlaceholder')}
            />
          </div>
          <div className="col-12">
            <label className="form-label">{t('admin.description')}</label>
            <textarea
              className="form-control"
              rows="2"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('admin.usage')}</label>
            <textarea
              className="form-control"
              rows="2"
              value={form.usage}
              onChange={(event) => setForm((prev) => ({ ...prev, usage: event.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('admin.warnings')}</label>
            <textarea
              className="form-control"
              rows="2"
              value={form.warnings}
              onChange={(event) => setForm((prev) => ({ ...prev, warnings: event.target.value }))}
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-success">
              {editingProduct ? t('admin.saveChanges') : t('admin.createProduct')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('admin.deleteProduct')}
        width="460px"
      >
        <p>
          {t('admin.confirmDelete', { name: selectedProduct?.name || '' })}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => setIsDeleteModalOpen(false)}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>
            {t('common.delete')}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default AdminProductsPage;

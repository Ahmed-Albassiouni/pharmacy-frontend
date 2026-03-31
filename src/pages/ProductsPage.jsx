import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Modal from '../components/ui/Modal';
import RatingStars from '../components/ui/RatingStars';
import { getProducts } from '../api/pharmacyApi';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, translateStatus, translateCategory } = useLanguage();

  const initialSearch = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    stockStatus: 'all',
    dosage: 'all',
    maxPrice: 2000,
    search: initialSearch,
  });
  const [maxPrice, setMaxPrice] = useState(2000);
  const [options, setOptions] = useState({ categories: [], brands: [], dosages: [] });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      const allProducts = await getProducts();
      const categories = [...new Set(allProducts.map((item) => item.category))];
      const brands = [...new Set(allProducts.map((item) => item.brand))];
      const dosages = [...new Set(allProducts.map((item) => item.dosage))];
      const maxProductPrice = Math.max(...allProducts.map((item) => item.price));

      setOptions({ categories, brands, dosages });
      setMaxPrice(maxProductPrice);
      setFilters((prev) => ({ ...prev, maxPrice: maxProductPrice }));
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: initialSearch }));
  }, [initialSearch]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const response = await getProducts({ ...filters, sortBy, minPrice: 0 });
      setProducts(response);
      setLoading(false);
    };

    loadProducts();
  }, [filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      stockStatus: 'all',
      dosage: 'all',
      maxPrice,
      search: '',
    });
    setSortBy('popularity');
  };

  const productCountLabel = useMemo(() => {
    if (loading) return t('productsPage.loadingProducts');
    if (!products.length) return t('productsPage.noMatchingProducts');
    return t('productsPage.productsFound', { count: products.length });
  }, [loading, products.length, t]);

  const handleBuyNow = (product) => {
    const added = addToCart(product);
    if (added) navigate('/checkout');
  };

  return (
    <section className="section-shell mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h1 className="display-font mb-1">{t('productsPage.title')}</h1>
          <p className="mb-0 text-muted">{productCountLabel}</p>
        </div>
        <span className="badge bg-success-subtle text-success-emphasis px-3 py-2">
          {t('productsPage.dynamicStockBadge')}
        </span>
      </div>

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        options={options}
        maxPrice={maxPrice}
      />

      {loading ? (
        <div className="card-soft p-4 text-center">{t('productsPage.loadingProducts')}</div>
      ) : (
        <div className="row g-3">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
              <ProductCard
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
                onBuyNow={() => handleBuyNow(product)}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !products.length && (
        <div className="card-soft p-4 mt-3 text-center">
          <h5>{t('productsPage.noProductsMatchedTitle')}</h5>
          <p className="mb-3 text-muted">{t('productsPage.noProductsMatchedHint')}</p>
          <button className="btn btn-outline-secondary" onClick={handleResetFilters}>
            {t('productsPage.resetButton')}
          </button>
        </div>
      )}

      <Modal
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        title={quickViewProduct?.name}
      >
        {quickViewProduct && (
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <img src={quickViewProduct.images?.[0]} alt={quickViewProduct.name} className="img-fluid rounded" />
            </div>
            <div className="col-md-7">
              <small className="text-muted">{translateCategory(quickViewProduct.category)}</small>
              <RatingStars rating={quickViewProduct.rating} />
              <p className="mt-3 mb-2">{quickViewProduct.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <strong className="fs-5">{formatCurrency(quickViewProduct.price)}</strong>
                <span className={`badge-stock ${quickViewProduct.stock > 0 ? 'available' : 'out'}`}>
                  {quickViewProduct.stock > 0
                    ? t('productsPage.inStockCount', { count: quickViewProduct.stock })
                    : translateStatus('out_of_stock')}
                </span>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-brand" onClick={() => addToCart(quickViewProduct)}>
                  {t('common.addToCart')}
                </button>
                <button className="btn btn-accent" onClick={() => handleBuyNow(quickViewProduct)}>
                  {t('common.buyNow')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default ProductsPage;

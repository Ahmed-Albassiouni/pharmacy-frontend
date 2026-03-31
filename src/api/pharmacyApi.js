import apiClient from './client';
import { mockProducts, productCategories, homeOffers } from '../data/mockProducts';
import { mockUsers } from '../data/mockUsers';
import { mockRevenueReports } from '../data/mockReports';

const wait = (delay = 260) => new Promise((resolve) => setTimeout(resolve, delay));
const clone = (data) => JSON.parse(JSON.stringify(data));
const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=900&q=80';

const sortHandlers = {
  popularity: (a, b) => b.popularity - a.popularity,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
};

function normalizeProduct(product) {
  const primaryImage = product?.image || product?.images?.[0] || DEFAULT_PRODUCT_IMAGE;

  return {
    ...product,
    id: product?.id || product?._id,
    image: primaryImage,
    images: Array.isArray(product?.images) && product.images.length ? product.images : [primaryImage],
    brand: product?.brand || 'Generic',
    dosage: product?.dosage || 'N/A',
    usage: product?.usage || '',
    warnings: product?.warnings || '',
    popularity: Number(product?.popularity) || 1,
    isFeatured: Boolean(product?.isFeatured),
    reviews: Array.isArray(product?.reviews) ? product.reviews : [],
    rating: Number(product?.rating) || 0,
    createdAt: product?.createdAt || new Date().toISOString(),
  };
}

function normalizeOrder(order) {
  const userObj = order?.userId && typeof order.userId === 'object' ? order.userId : null;
  const itemsSource = Array.isArray(order?.products)
    ? order.products
    : Array.isArray(order?.items)
      ? order.items
      : [];

  const items = itemsSource.map((item) => {
    const productObj = item?.productId && typeof item.productId === 'object' ? item.productId : null;

    return {
      productId: productObj?._id || item?.productId || '',
      name: productObj?.name || item?.name || 'Unknown Product',
      quantity: Number(item?.quantity) || 0,
      price: Number(productObj?.price ?? item?.price ?? 0),
      image: productObj?.image || '',
      category: productObj?.category || '',
    };
  });

  return {
    id: order?._id || order?.id || `ord-${Date.now()}`,
    userId: String(userObj?._id || order?.userId || ''),
    customerName: userObj?.name || order?.customerName || 'Customer',
    customerEmail: userObj?.email || order?.customerEmail || '',
    paymentMethod: order?.paymentMethod || 'cash_on_delivery',
    paymentStatus: order?.paymentStatus || 'pending',
    shippingAddress: order?.shippingAddress || 'Not provided',
    status: order?.status || 'pending',
    totalPrice: Number(order?.totalPrice) || 0,
    createdAt: order?.createdAt || new Date().toISOString(),
    items,
  };
}

function mapPaymentMethodToApi(paymentMethod) {
  const value = String(paymentMethod || '').toLowerCase().replaceAll(' ', '_');

  if (value === 'credit_card') return 'credit_card';
  if (value === 'vodafone_cash') return 'vodafone_cash';
  return 'cash_on_delivery';
}

function filterAndSortProducts(records, filters = {}) {
  const {
    category = 'all',
    brand = 'all',
    stockStatus = 'all',
    dosage = 'all',
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    search = '',
    sortBy = 'popularity',
  } = filters;

  const searchKeyword = String(search).trim().toLowerCase();

  let filtered = records.filter((product) => {
    const byCategory = category === 'all' || product.category === category;
    const byBrand = brand === 'all' || product.brand === brand;
    const byDosage = dosage === 'all' || product.dosage === dosage;
    const byStock =
      stockStatus === 'all' ||
      (stockStatus === 'available' ? product.stock > 0 : product.stock === 0);
    const byPrice = product.price >= Number(minPrice) && product.price <= Number(maxPrice);
    const bySearch =
      !searchKeyword ||
      product.name.toLowerCase().includes(searchKeyword) ||
      product.brand.toLowerCase().includes(searchKeyword) ||
      product.category.toLowerCase().includes(searchKeyword);

    return byCategory && byBrand && byDosage && byStock && byPrice && bySearch;
  });

  const sortFn = sortHandlers[sortBy] || sortHandlers.popularity;
  filtered = [...filtered].sort(sortFn);

  return filtered;
}

export async function getHomePageData() {
  try {
    const records = await getProducts({ sortBy: 'newest' });
    const categories = [...new Set(records.map((item) => item.category))];

    return clone({
      featuredProducts: records.slice(0, 8),
      offers: homeOffers,
      categories: categories.length ? categories : productCategories,
      outOfStock: records.filter((item) => item.stock === 0),
    });
  } catch {
    await wait();

    const featuredProducts = mockProducts.filter((item) => item.isFeatured).slice(0, 8);
    const outOfStock = mockProducts.filter((item) => item.stock === 0);

    return clone({
      featuredProducts,
      offers: homeOffers,
      categories: productCategories,
      outOfStock,
    });
  }
}

export async function getProducts(filters = {}) {
  try {
    const {
      category = 'all',
      stockStatus = 'all',
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      search = '',
      sortBy = 'popularity',
    } = filters;

    const sortMap = {
      newest: 'newest',
      popularity: 'newest',
      'price-low': 'price_asc',
      'price-high': 'price_desc',
    };

    const params = {
      search,
      sort: sortMap[sortBy] || 'newest',
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
    };

    if (category !== 'all') params.category = category;
    if (stockStatus !== 'all') params.status = stockStatus;

    const { data } = await apiClient.get('/products', { params });
    const records = Array.isArray(data?.products) ? data.products.map(normalizeProduct) : [];

    return clone(filterAndSortProducts(records, filters));
  } catch {
    await wait();

    const records = mockProducts.map(normalizeProduct);
    return clone(filterAndSortProducts(records, filters));
  }
}

export async function getProductById(productId) {
  try {
    const { data } = await apiClient.get(`/products/${productId}`);
    return clone(normalizeProduct(data));
  } catch {
    await wait();

    const record = mockProducts.find((product) => product.id === productId);
    if (!record) {
      throw new Error('Product not found');
    }

    return clone(normalizeProduct(record));
  }
}

export async function getUserOrders(userId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const { data } = await apiClient.get(`/orders/user/${userId}`, { headers });
  const orders = Array.isArray(data?.orders) ? data.orders.map(normalizeOrder) : [];
  return clone(orders);
}

export async function submitConsultation(payload) {
  // Backend integration placeholder:
  // const { data } = await apiClient.post('/consultation', payload, {
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // });
  // return data;
  await wait(420);

  return clone({
    ticketId: `cs-${Date.now()}`,
    message: 'Your request has been sent to the pharmacist.',
    receivedAt: new Date().toISOString(),
    payload,
  });
}

export async function checkoutOrder(payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const requestBody = {
    products: (payload.items || []).map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    })),
    paymentMethod: mapPaymentMethodToApi(payload.paymentMethod),
    userId: payload.userId,
    customerName: payload.customerName,
    shippingAddress: payload.shippingAddress,
    notes: payload.notes,
  };

  const { data } = await apiClient.post('/orders', requestBody, { headers });

  if (!data?.order) {
    throw new Error('Order was not returned from server.');
  }

  return clone(normalizeOrder(data.order));
}

export async function getDashboardSeed() {
  // Backend integration placeholder:
  // const { data } = await apiClient.get('/admin/dashboard');
  // return data;
  await wait();

  return clone({
    users: mockUsers,
    orders: [],
    products: mockProducts,
    reports: mockRevenueReports,
  });
}

export { apiClient };

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';
import { mockProducts } from '../data/mockProducts';
import { useLanguage } from './LanguageContext';
import { useToast } from './ToastContext';
import { useUser } from './UserContext';

const AdminContext = createContext(null);
const ADMIN_TOKEN_STORAGE_KEY = 'pharma_admin_token_v1';
const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=900&q=80';

const emptyRevenueReports = {
  daily: [],
  weekly: [],
  monthly: [],
};

const defaultDashboardStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalSales: 0,
  outOfStockMedicines: 0,
  availableMedicines: 0,
  pendingPrescriptions: 0,
};

function normalizeProduct(product) {
  const primaryImage = product?.image || product?.images?.[0] || DEFAULT_PRODUCT_IMAGE;
  const createdAt = product?.createdAt
    ? new Date(product.createdAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return {
    ...product,
    id: product?.id || product?._id || `p-${Date.now()}`,
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
    createdAt,
  };
}

function normalizeOrder(order) {
  const userObj = order?.userId && typeof order.userId === 'object' ? order.userId : null;
  const userId = userObj?._id || order?.userId || '';
  const itemsSource = Array.isArray(order?.products) ? order.products : Array.isArray(order?.items) ? order.items : [];

  const items = itemsSource.map((item) => {
    const productObj = item?.productId && typeof item.productId === 'object' ? item.productId : null;

    return {
      productId: productObj?._id || item?.productId || '',
      name: productObj?.name || item?.name || 'Unknown Product',
      quantity: Number(item?.quantity) || 0,
      price: Number(productObj?.price ?? item?.price ?? 0),
      category: productObj?.category || '',
      image: productObj?.image || '',
      status: productObj?.status || '',
    };
  });

  return {
    id: order?._id || order?.id || `ord-${Date.now()}`,
    userId: String(userId),
    customerName: userObj?.name || order?.customerName || 'Unknown',
    customerEmail: userObj?.email || order?.customerEmail || '',
    status: order?.status || 'pending',
    paymentMethod: order?.paymentMethod || 'cash_on_delivery',
    paymentStatus: order?.paymentStatus || 'pending',
    shippingAddress: order?.shippingAddress || 'Not provided',
    totalPrice: Number(order?.totalPrice) || 0,
    createdAt: order?.createdAt || new Date().toISOString(),
    items,
  };
}

function normalizeUsersWithOrders(userRecords, orderRecords) {
  const ordersCountByUser = orderRecords.reduce((acc, order) => {
    if (!order.userId) return acc;
    acc[order.userId] = (acc[order.userId] || 0) + 1;
    return acc;
  }, {});

  return userRecords.map((user) => {
    const id = String(user?._id || user?.id || '');
    const address = user?.address || '';

    return {
      id,
      name: user?.name || 'Unknown',
      email: user?.email || '',
      role: user?.role || 'user',
      status: 'active',
      ordersCount: ordersCountByUser[id] || 0,
      addresses: address ? [address] : [],
      favorites: [],
    };
  });
}

function normalizeRevenueReports(revenue) {
  const normalize = (records) =>
    Array.isArray(records)
      ? records.map((item) => ({
          label: item?.label || '-',
          value: Number(item?.value) || 0,
        }))
      : [];

  return {
    daily: normalize(revenue?.daily),
    weekly: normalize(revenue?.weekly),
    monthly: normalize(revenue?.monthly),
  };
}

function normalizeDashboardStats(overview) {
  return {
    totalUsers: Number(overview?.totalUsers) || 0,
    totalProducts: Number(overview?.totalProducts) || 0,
    totalOrders: Number(overview?.totalOrders) || 0,
    totalSales: Number(overview?.totalSales) || 0,
    outOfStockMedicines: Number(overview?.outOfStockMedicines) || 0,
    availableMedicines: Number(overview?.availableMedicines) || 0,
    pendingPrescriptions: Number(overview?.pendingPrescriptions) || 0,
  };
}

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

export function AdminProvider({ children }) {
  const { showToast } = useToast();
  const { authToken, isAdmin } = useUser();
  const { t, translateStatus } = useLanguage();

  const [products, setProducts] = useState(() => mockProducts.map(normalizeProduct));
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueReports, setRevenueReports] = useState(emptyRevenueReports);
  const [dashboardStats, setDashboardStats] = useState(defaultDashboardStats);

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const { data } = await apiClient.get('/products');
        const records = Array.isArray(data?.products) ? data.products.map(normalizeProduct) : [];
        if (!ignore) {
          setProducts(records);
        }
      } catch {
        if (!ignore) {
          setProducts(mockProducts.map(normalizeProduct));
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const runWithAdminAuth = async (requestFn) => {
    const token = authToken || localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

    if (!token) {
      throw new Error('Admin authentication is required.');
    }

    try {
      return await requestFn(token);
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      }
      throw error;
    }
  };

  const fetchAdminData = async () => {
    if (!isAdmin || !authToken) {
      setUsers([]);
      setOrders([]);
      setRevenueReports(emptyRevenueReports);
      setDashboardStats(defaultDashboardStats);
      return;
    }

    try {
      await runWithAdminAuth(async (token) => {
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, ordersRes, dashboardRes] = await Promise.all([
          apiClient.get('/users', { headers }),
          apiClient.get('/orders', { headers }),
          apiClient.get('/dashboard', { headers }),
        ]);

        const normalizedOrders = Array.isArray(ordersRes?.data?.orders)
          ? ordersRes.data.orders.map(normalizeOrder)
          : [];

        const normalizedUsers = Array.isArray(usersRes?.data?.users)
          ? normalizeUsersWithOrders(usersRes.data.users, normalizedOrders)
          : [];

        setOrders(normalizedOrders);
        setUsers(normalizedUsers);
        setRevenueReports(normalizeRevenueReports(dashboardRes?.data?.revenue));
        setDashboardStats(normalizeDashboardStats(dashboardRes?.data?.overview));
      });
    } catch {
      setUsers([]);
      setOrders([]);
      setRevenueReports(emptyRevenueReports);
      setDashboardStats(defaultDashboardStats);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [isAdmin, authToken]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await runWithAdminAuth((token) =>
        apiClient.put(
          `/orders/${orderId}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      const updatedOrder = normalizeOrder(data?.order || { id: orderId, status });

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, ...updatedOrder } : order)),
      );

      showToast(t('notifications.orderUpdated', { orderId, status: translateStatus(updatedOrder.status) }), 'success');
      fetchAdminData();
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, t('notifications.orderUpdateFailed')), 'error');
      return false;
    }
  };

  const addProduct = async (payload) => {
    const requestBody = {
      name: payload.name,
      category: payload.category,
      price: Number(payload.price),
      stock: Number(payload.stock),
      description: payload.description || '',
      image: payload.images?.[0] || '',
    };

    try {
      const { data } = await runWithAdminAuth((token) =>
        apiClient.post('/products', requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      const createdProduct = normalizeProduct(data?.product || requestBody);

      setProducts((prev) => [createdProduct, ...prev]);
      showToast(t('notifications.productCreated'), 'success');
      fetchAdminData();
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, t('notifications.productCreateFailed')), 'error');
      return false;
    }
  };

  const editProduct = async (productId, payload) => {
    const requestBody = {
      name: payload.name,
      category: payload.category,
      price: Number(payload.price),
      stock: Number(payload.stock),
      description: payload.description || '',
      image: payload.images?.[0] || '',
    };

    try {
      const { data } = await runWithAdminAuth((token) =>
        apiClient.put(`/products/${productId}`, requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      const updatedProduct = normalizeProduct(data?.product || { ...requestBody, id: productId });

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...updatedProduct,
                images: payload.images?.length ? payload.images : [updatedProduct.image],
                brand: payload.brand || product.brand,
                dosage: payload.dosage || product.dosage,
                usage: payload.usage || product.usage,
                warnings: payload.warnings || product.warnings,
              }
            : product,
        ),
      );
      showToast(t('notifications.productUpdated'), 'success');
      fetchAdminData();
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, t('notifications.productUpdateFailed')), 'error');
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await runWithAdminAuth((token) =>
        apiClient.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      showToast(t('notifications.productDeleted'), 'info');
      fetchAdminData();
      return true;
    } catch (error) {
      showToast(getErrorMessage(error, t('notifications.productDeleteFailed')), 'error');
      return false;
    }
  };

  const createOrder = (payload) => {
    const order = {
      id: `ord-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      ...payload,
    };

    setOrders((prev) => [order, ...prev]);

    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = order.items.find((item) => item.productId === product.id);
        if (!orderedItem) return product;

        return {
          ...product,
          stock: Math.max(0, product.stock - orderedItem.quantity),
        };
      }),
    );

    return order;
  };

  const value = useMemo(
    () => ({
      products,
      users,
      orders,
      revenueReports,
      dashboardStats,
      fetchAdminData,
      updateOrderStatus,
      addProduct,
      editProduct,
      deleteProduct,
      createOrder,
    }),
    [products, users, orders, revenueReports, dashboardStats, t, translateStatus],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }

  return context;
}

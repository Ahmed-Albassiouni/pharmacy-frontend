import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';
import { useLanguage } from './LanguageContext';
import { useToast } from './ToastContext';

const USER_STORAGE_KEY = 'pharma_user_v2';
const TOKEN_STORAGE_KEY = 'pharma_auth_token_v1';
const ADMIN_TOKEN_STORAGE_KEY = 'pharma_admin_token_v1';
const UserContext = createContext(null);

const guestUser = {
  id: 'guest',
  name: 'Guest',
  email: '',
  role: 'guest',
  address: '',
  phone: '',
  status: 'active',
  ordersCount: 0,
  addresses: [],
  favorites: [],
};

function normalizeUser(user = {}) {
  const normalizedAddress = user.address || user.addresses?.[0] || '';

  return {
    id: user._id || user.id || guestUser.id,
    name: user.name || guestUser.name,
    email: user.email || guestUser.email,
    role: user.role || 'user',
    address: normalizedAddress,
    phone: user.phone || '',
    status: user.status || 'active',
    ordersCount: Number(user.ordersCount) || 0,
    addresses: Array.isArray(user.addresses)
      ? user.addresses
      : normalizedAddress
        ? [normalizedAddress]
        : [],
    favorites: Array.isArray(user.favorites) ? user.favorites : [],
  };
}

function normalizeOrder(order = {}) {
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

function getInitialAuthState() {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!token || !rawUser) {
      return { token: '', user: guestUser };
    }

    return { token, user: normalizeUser(JSON.parse(rawUser)) };
  } catch {
    return { token: '', user: guestUser };
  }
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export function UserProvider({ children }) {
  const initialAuth = getInitialAuthState();
  const [authToken, setAuthToken] = useState(initialAuth.token);
  const [currentUser, setCurrentUser] = useState(initialAuth.user);
  const [userOrders, setUserOrders] = useState([]);
  const { t } = useLanguage();
  const { showToast } = useToast();

  const isAuthenticated = Boolean(authToken && currentUser.id !== guestUser.id);
  const isAdmin = isAuthenticated && currentUser.role === 'admin';

  const refreshUserOrders = async () => {
    if (!isAuthenticated || !authToken || !currentUser.id || currentUser.id === guestUser.id) {
      setUserOrders([]);
      return;
    }

    try {
      const { data } = await apiClient.get(`/orders/user/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const orders = Array.isArray(data?.orders) ? data.orders.map(normalizeOrder) : [];
      setUserOrders(orders);
    } catch {
      setUserOrders([]);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
  }, [isAuthenticated, currentUser, authToken]);

  useEffect(() => {
    refreshUserOrders();
  }, [isAuthenticated, authToken, currentUser.id]);

  const login = async ({ email, password }) => {
    try {
      const { data } = await apiClient.post('/auth/login', {
        email: String(email).trim(),
        password,
      });

      if (!data?.token || !data?.user) {
        throw new Error(t('notifications.loginFailed'));
      }

      const normalizedUser = normalizeUser(data.user);
      setAuthToken(data.token);
      setCurrentUser(normalizedUser);
      showToast(t('notifications.welcomeBack', { name: normalizedUser.name.split(' ')[0] }), 'success');

      return { ok: true, user: normalizedUser };
    } catch (error) {
      const message = getErrorMessage(error, t('notifications.loginFailed'));
      showToast(message, 'error');
      return { ok: false, message };
    }
  };

  const register = async ({ name, email, password, address }) => {
    try {
      const { data } = await apiClient.post('/auth/register', {
        name: String(name).trim(),
        email: String(email).trim(),
        password,
        address: String(address || '').trim(),
      });

      if (!data?.token || !data?.user) {
        throw new Error(t('notifications.registerFailed'));
      }

      const normalizedUser = normalizeUser(data.user);
      setAuthToken(data.token);
      setCurrentUser(normalizedUser);
      showToast(t('notifications.accountCreated'), 'success');

      return { ok: true, user: normalizedUser };
    } catch (error) {
      const message = getErrorMessage(error, t('notifications.registerFailed'));
      showToast(message, 'error');
      return { ok: false, message };
    }
  };

  const logout = () => {
    setAuthToken('');
    setCurrentUser(guestUser);
    setUserOrders([]);
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    showToast(t('notifications.loggedOut'), 'info');
  };

  const toggleFavorite = (productId) => {
    if (!isAuthenticated) {
      showToast(t('notifications.loginForFavorites'), 'warning');
      return false;
    }

    setCurrentUser((prev) => {
      const alreadyFavorite = prev.favorites.includes(productId);
      const favorites = alreadyFavorite
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];

      showToast(
        alreadyFavorite ? t('notifications.removedFavorite') : t('notifications.addedFavorite'),
        alreadyFavorite ? 'info' : 'success',
      );

      return { ...prev, favorites };
    });

    return true;
  };

  const updateProfile = (payload) => {
    if (!isAuthenticated) {
      showToast(t('notifications.loginFirst'), 'warning');
      return;
    }

    setCurrentUser((prev) => ({ ...prev, ...payload }));
    showToast(t('notifications.profileUpdated'), 'success');
  };

  const addAddress = (address) => {
    if (!isAuthenticated) {
      showToast(t('notifications.loginFirst'), 'warning');
      return;
    }

    if (!address?.trim()) return;

    setCurrentUser((prev) => {
      const nextAddresses = [...prev.addresses, address.trim()];

      return {
        ...prev,
        addresses: nextAddresses,
        address: nextAddresses[0] || '',
      };
    });

    showToast(t('notifications.addressAdded'), 'success');
  };

  const appendOrder = (order) => {
    if (!isAuthenticated) return;

    const normalizedOrder = normalizeOrder(order);

    setUserOrders((prev) => [normalizedOrder, ...prev.filter((item) => item.id !== normalizedOrder.id)]);
    setCurrentUser((prev) => ({
      ...prev,
      ordersCount: prev.ordersCount + 1,
    }));
  };

  const value = useMemo(
    () => ({
      currentUser,
      authToken,
      isAuthenticated,
      isAdmin,
      userOrders,
      login,
      register,
      logout,
      refreshUserOrders,
      toggleFavorite,
      updateProfile,
      addAddress,
      appendOrder,
    }),
    [currentUser, authToken, isAuthenticated, isAdmin, userOrders, t],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }

  return context;
}

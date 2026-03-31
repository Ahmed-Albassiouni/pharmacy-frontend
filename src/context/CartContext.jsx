import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useToast } from './ToastContext';

const CART_STORAGE_KEY = 'pharma_cart_v1';
const CartContext = createContext(null);

function getInitialCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const { t } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showToast(t('notifications.outOfStock'), 'error');
      return false;
    }

    let didAdd = false;

    setCartItems((prev) => {
      const found = prev.find((item) => item.productId === product.id);

      if (!found) {
        didAdd = true;
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity,
            maxStock: product.stock,
          },
        ];
      }

      const nextQuantity = Math.min(found.quantity + quantity, found.maxStock);
      if (nextQuantity === found.quantity) {
        showToast(t('notifications.maxQuantity'), 'warning');
        return prev;
      }

      didAdd = true;
      return prev.map((item) =>
        item.productId === product.id ? { ...item, quantity: nextQuantity } : item,
      );
    });

    if (didAdd) {
      showToast(t('notifications.addedToCart', { name: product.name }), 'success');
    }

    return didAdd;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    showToast(t('notifications.removedFromCart'), 'info');
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;

        const safeQuantity = Math.max(1, Math.min(Number(quantity), item.maxStock));
        return { ...item, quantity: safeQuantity };
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, cartCount, subtotal, t],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}

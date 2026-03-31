import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'pharma_language_v1';
const LanguageContext = createContext(null);

const CATEGORY_KEYS = {
  Medicines: 'values.categories.medicines',
  Vitamins: 'values.categories.vitamins',
  Baby: 'values.categories.baby',
  Cosmetics: 'values.categories.cosmetics',
  'Medical Devices': 'values.categories.medicalDevices',
};

const STATUS_KEYS = {
  pending: 'values.status.pending',
  completed: 'values.status.completed',
  canceled: 'values.status.canceled',
  delivered: 'values.status.delivered',
  active: 'values.status.active',
  blocked: 'values.status.blocked',
  available: 'values.status.available',
  'out-of-stock': 'values.status.outOfStock',
  out_of_stock: 'values.status.outOfStock',
  outofstock: 'values.status.outOfStock',
};

const ROLE_KEYS = {
  admin: 'values.roles.admin',
  user: 'values.roles.user',
  guest: 'values.roles.guest',
};

const PERIOD_KEYS = {
  daily: 'values.periods.daily',
  weekly: 'values.periods.weekly',
  monthly: 'values.periods.monthly',
};

const PAYMENT_KEYS = {
  credit_card: 'values.paymentMethods.creditCard',
  vodafone_cash: 'values.paymentMethods.vodafoneCash',
  cash_on_delivery: 'values.paymentMethods.cashOnDelivery',
};

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;

    const browserLang = window.navigator?.language?.toLowerCase() || 'en';
    return browserLang.startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function interpolate(template, values = {}) {
  if (typeof template !== 'string') return template;

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    if (values[key] === undefined || values[key] === null) return '';
    return String(values[key]);
  });
}

function normalizeLookupValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll('-', '_');
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    const direction = language === 'ar' ? 'rtl' : 'ltr';

    root.setAttribute('lang', language);
    root.setAttribute('dir', direction);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = (key, values = {}) => {
    const locale = translations[language] || translations.en;
    const fallback = translations.en;
    const value = getNestedValue(locale, key) ?? getNestedValue(fallback, key) ?? key;
    return interpolate(value, values);
  };

  const translateCategory = (category) => {
    const key = CATEGORY_KEYS[category];
    return key ? t(key) : category;
  };

  const translateStatus = (status) => {
    const normalized = normalizeLookupValue(status);
    const key = STATUS_KEYS[normalized];
    return key ? t(key) : status;
  };

  const translateRole = (role) => {
    const normalized = normalizeLookupValue(role);
    const key = ROLE_KEYS[normalized];
    return key ? t(key) : role;
  };

  const translatePeriod = (period) => {
    const normalized = normalizeLookupValue(period);
    const key = PERIOD_KEYS[normalized];
    return key ? t(key) : period;
  };

  const translatePaymentMethod = (paymentMethod) => {
    const normalized = normalizeLookupValue(paymentMethod);
    const key = PAYMENT_KEYS[normalized];
    return key ? t(key) : paymentMethod;
  };

  const value = useMemo(
    () => ({
      language,
      isArabic: language === 'ar',
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar')),
      t,
      translateCategory,
      translateStatus,
      translateRole,
      translatePeriod,
      translatePaymentMethod,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}

function getLocale() {
  if (typeof document !== 'undefined') {
    const current = document.documentElement.lang;
    if (current === 'ar') return 'ar-EG';
  }

  return 'en-EG';
}

export function formatCurrency(value) {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

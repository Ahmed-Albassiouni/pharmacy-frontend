function getLocale() {
  if (typeof document !== 'undefined') {
    const current = document.documentElement.lang;
    if (current === 'ar') return 'ar-EG';
  }

  return 'en-GB';
}

export function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat(getLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

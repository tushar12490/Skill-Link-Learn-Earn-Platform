const DEFAULT_LOCALE = 'en-IN';
const DEFAULT_OPTIONS = {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
};

const formatterCache = new Map();

const getFormatter = (options = {}) => {
  const key = JSON.stringify(options);
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat(DEFAULT_LOCALE, { ...DEFAULT_OPTIONS, ...options }));
  }
  return formatterCache.get(key);
};

const coerceToNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const sanitized = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    if (!sanitized) {
      return null;
    }
    const parsed = Number.parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const formatCurrencyInr = (value, options = {}) => {
  if (value == null || value === '') {
    return getFormatter(options).format(0);
  }

  const numericValue = coerceToNumber(value);
  if (numericValue == null) {
    return typeof value === 'string' ? value.replace(/\$/g, '₹') : getFormatter(options).format(0);
  }

  const fractionDigits = numericValue % 1 === 0 ? 0 : 2;
  const formatter = getFormatter({ maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits, ...options });
  return formatter.format(numericValue);
};

export const formatCurrencyRangeInr = (value, options = {}) => {
  if (value == null || value === '') {
    return formatCurrencyInr(value, options);
  }

  if (typeof value === 'string' && value.includes('-')) {
    const [min, max] = value.split('-').map((part) => part.trim());
    if (min && max) {
      return `${formatCurrencyInr(min, options)} - ${formatCurrencyInr(max, options)}`;
    }
  }

  return formatCurrencyInr(value, options);
};

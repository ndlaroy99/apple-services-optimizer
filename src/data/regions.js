export const REGION_CONFIG = {
  US: { countryName: 'United States', defaultCurrency: 'USD', taxRate: 0.08, taxMode: 'exclusive' },
  CA: { countryName: 'Canada', defaultCurrency: 'CAD', taxRate: 0.13, taxMode: 'exclusive' },
  AU: { countryName: 'Australia', defaultCurrency: 'AUD', taxRate: 0.1, taxMode: 'inclusive' },
  EU: { countryName: 'European Union', defaultCurrency: 'EUR', taxRate: 0.2, taxMode: 'inclusive' },
  GB: { countryName: 'United Kingdom', defaultCurrency: 'GBP', taxRate: 0.2, taxMode: 'inclusive' },
  IN: { countryName: 'India', defaultCurrency: 'INR', taxRate: 0.18, taxMode: 'inclusive' },
  MX: { countryName: 'Mexico', defaultCurrency: 'MXN', taxRate: 0.16, taxMode: 'inclusive' },
  JP: { countryName: 'Japan', defaultCurrency: 'JPY', taxRate: 0.1, taxMode: 'inclusive' },
  CN: { countryName: 'China', defaultCurrency: 'CNY', taxRate: 0.13, taxMode: 'inclusive' }
};

export const SUPPORTED_COUNTRIES = Object.entries(REGION_CONFIG).map(([code, cfg]) => ({
  code,
  name: cfg.countryName
}));

export const CURRENCY_SYMBOLS = {
  USD: '$',
  CAD: 'C$',
  AUD: 'A$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  MXN: 'MX$',
  JPY: '¥',
  CNY: '¥'
};

// Approximate display conversion rates from USD.
export const FX_FROM_USD = {
  USD: 1,
  CAD: 1.35,
  AUD: 1.53,
  EUR: 0.93,
  GBP: 0.79,
  INR: 83.2,
  MXN: 17.0,
  JPY: 151.0,
  CNY: 7.2
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_SYMBOLS);

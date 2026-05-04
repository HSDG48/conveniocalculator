const eurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pctFormatter = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const compactEurFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatEuro(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return eurFormatter.format(value);
}

export function formatEuroCompact(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return compactEurFormatter.format(value);
}

export function formatPercent(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return pctFormatter.format(value);
}

export function formatNumber(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return value.toLocaleString('es-ES');
}

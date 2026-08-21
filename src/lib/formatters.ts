const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

export function formatCurrency(valueInCents: number): string {
  return currencyFormatter.format(valueInCents / 100).replace(/\u00a0/g, ' ');
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export type ContractTerm =
  | { kind: 'upcoming'; daysUntilStart: number; label: string }
  | { kind: 'active'; daysRemaining: number; label: string }
  | { kind: 'ended'; daysSinceEnd: number; label: string };

function toUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function parseIsoDay(value: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Data de vigência inválida: ${value}`);

  const [, year, month, day] = match;
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

function pluralize(days: number, singular: string, plural: string): string {
  return `${days} ${days === 1 ? singular : plural}`;
}

export function getContractTerm(startsAt: string, endsAt: string, now = new Date()): ContractTerm {
  const today = toUtcDay(now);
  const start = parseIsoDay(startsAt);
  const end = parseIsoDay(endsAt);

  if (today < start) {
    const daysUntilStart = Math.round((start - today) / DAY_IN_MILLISECONDS);
    return {
      kind: 'upcoming',
      daysUntilStart,
      label: `Inicia em ${pluralize(daysUntilStart, 'dia', 'dias')}`,
    };
  }

  if (today > end) {
    const daysSinceEnd = Math.round((today - end) / DAY_IN_MILLISECONDS);
    return {
      kind: 'ended',
      daysSinceEnd,
      label: 'Vigência encerrada',
    };
  }

  const daysRemaining = Math.round((end - today) / DAY_IN_MILLISECONDS);
  return {
    kind: 'active',
    daysRemaining,
    label:
      daysRemaining === 0
        ? 'Último dia de vigência'
        : pluralize(daysRemaining, 'dia restante', 'dias restantes'),
  };
}

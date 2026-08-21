import { describe, expect, it } from 'vitest';

import { getContractTerm } from './contract-term';

describe('getContractTerm', () => {
  it('calcula os dias restantes durante a vigência', () => {
    expect(
      getContractTerm('2026-01-01', '2026-12-31', new Date('2026-08-21T18:00:00-03:00')),
    ).toEqual({
      kind: 'active',
      daysRemaining: 132,
      label: '132 dias restantes',
    });
  });

  it('apresenta um estado coerente no último dia', () => {
    expect(getContractTerm('2026-01-01', '2026-12-31', new Date('2026-12-31T12:00:00Z'))).toEqual({
      kind: 'active',
      daysRemaining: 0,
      label: 'Último dia de vigência',
    });
  });

  it('não retorna número negativo após o encerramento', () => {
    expect(getContractTerm('2026-01-01', '2026-12-31', new Date('2027-01-05T12:00:00Z'))).toEqual({
      kind: 'ended',
      daysSinceEnd: 5,
      label: 'Vigência encerrada',
    });
  });
});

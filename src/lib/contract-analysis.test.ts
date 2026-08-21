import { describe, expect, it } from 'vitest';

import { parseContractAnalysis } from './contract-analysis';

const validAnalysis = {
  summary: 'Serviços de manutenção predial durante 2026.',
  obligations: [
    {
      title: 'Entregar relatório',
      description: 'Apresentar relatório mensal.',
      clause: '8.3',
      deadline: '5º dia útil do mês subsequente',
    },
  ],
  deadlines: [
    {
      title: 'Vigência',
      description: 'Período contratual.',
      value: '01/01/2026 a 31/12/2026',
      clause: '2.1',
    },
  ],
  guarantees: [],
  adjustments: [],
  attentionPoints: [],
  recommendedActions: [],
};

describe('parse da análise contratual', () => {
  it('aceita uma análise estruturada e coleções vazias para informações ausentes', () => {
    expect(parseContractAnalysis(JSON.stringify(validAnalysis))).toEqual(validAnalysis);
    expect(parseContractAnalysis(validAnalysis)).toEqual(validAnalysis);
  });

  it('não aceita informação inventada fora do contrato de saída', () => {
    expect(() =>
      parseContractAnalysis(JSON.stringify({ ...validAnalysis, penalty: 'Multa de 10%' })),
    ).toThrow('does not match');
  });

  it('rejeita JSON inválido, cláusula ausente e enum desconhecido', () => {
    expect(() => parseContractAnalysis('não é JSON')).toThrow('valid JSON');
    expect(() =>
      parseContractAnalysis(
        JSON.stringify({
          ...validAnalysis,
          guarantees: [{ title: 'Garantia', description: 'Válida durante a vigência.' }],
        }),
      ),
    ).toThrow('does not match');
    expect(() =>
      parseContractAnalysis(
        JSON.stringify({
          ...validAnalysis,
          attentionPoints: [
            {
              title: 'Garantia',
              description: 'Acompanhar validade.',
              clause: '11.2',
              severity: 'irregularity',
            },
          ],
        }),
      ),
    ).toThrow('does not match');
  });
});

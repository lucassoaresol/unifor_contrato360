import { describe, expect, it } from 'vitest';

import { contracts } from './data/contracts';
import { createApp } from './index';
import { CONTRACT_ANALYSIS_MODEL } from './lib/contract-analysis';

const demoDate = new Date('2026-08-21T12:00:00Z');

describe('rotas da casca navegável', () => {
  const app = createApp({ now: () => demoDate });

  it('apresenta a priorização de atenção no dashboard', async () => {
    const response = await app.request('/');
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('Visão geral');
    expect(html).toContain('Requer sua atenção');
    expect(html).toContain('12');
    expect(html).toContain('Contratos ativos');
    expect(html).toContain('4');
    expect(html).toContain('Pendências abertas');
    expect(html).toContain('2');
    expect(html).toContain('Alertas críticos');
    expect(html).toContain('3');
    expect(html).toContain('Prazos próximos');
    expect(html).toContain('Garantia contratual requer verificação nos próximos dias.');
    expect(html).toContain('Certidão da contratada vence em 5 dias.');
    expect(html).toContain('Entrega de relatório mensal');
    expect(html).toContain('Medição mensal');
    expect(html).toContain('Verificação de garantia');
    expect(html).toContain('href="/contratos/023-2026"');
  });

  it('conecta alerta, próxima ação e obrigação no detalhe principal', async () => {
    const response = await app.request('/contratos/023-2026');
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('Contrato 023/2026');
    expect(html).toContain('Tech Serviços Ltda.');
    expect(html).toContain('R$ 480.000,00');
    expect(html).toContain('01/01/2026 — 31/12/2026');
    expect(html).toContain('132 dias restantes');
    expect(html).toContain('Verificar validade da garantia contratual');
    expect(html).toContain('Prioridade alta');
    expect(html).toContain('Garantia contratual');
    expect(html).toContain('Requer atenção');
    expect(html).toContain('Análise inteligente');
    expect(html).toContain('Analisar contrato com IA');
    expect(html).toContain('data-endpoint="/api/contracts/023-2026/analyze"');
    expect(html).toContain('Analisando contrato...');
    expect(html).toContain('Não foi possível concluir a análise');
    expect(html).toContain('src="/analysis.js"');
  });

  it('responde de forma amigável para um contrato inexistente', async () => {
    const response = await app.request('/contratos/999-2026');
    const html = await response.text();

    expect(response.status).toBe(404);
    expect(html).toContain('Contrato não encontrado');
    expect(html).toContain('Não encontramos o contrato solicitado.');
    expect(html).toContain('Voltar para visão geral');
  });

  it('responde de forma amigável para outra rota inexistente', async () => {
    const response = await app.request('/area-inexistente');
    const html = await response.text();

    expect(response.status).toBe(404);
    expect(html).toContain('Página não encontrada');
    expect(html).not.toContain('stack');
  });
});

describe('dados fictícios', () => {
  it('mantém pelo menos quatro contratos administrativos plausíveis', () => {
    expect(contracts).toHaveLength(4);
    expect(
      contracts.every(
        (contract) => !/xyz|lorem|placeholder/i.test(`${contract.contractor} ${contract.object}`),
      ),
    ).toBe(true);
  });
});

const validAnalysis = {
  summary: 'Manutenção predial preventiva e corretiva durante 2026.',
  obligations: [
    {
      title: 'Entregar relatório mensal',
      description: 'Apresentar o relatório até o quinto dia útil.',
      clause: '8.3',
      deadline: '5º dia útil do mês subsequente',
    },
  ],
  deadlines: [
    {
      title: 'Vigência',
      description: 'Período de execução contratual.',
      value: '01/01/2026 a 31/12/2026',
      clause: '2.1',
    },
  ],
  guarantees: [
    {
      title: 'Garantia contratual',
      description: 'Deve permanecer válida durante a vigência.',
      clause: '11.2',
    },
  ],
  adjustments: [],
  attentionPoints: [],
  recommendedActions: [],
};

function bindingFromRun(run: (...arguments_: unknown[]) => Promise<Record<string, unknown>>) {
  return { AI: { run } as unknown as Ai };
}

describe('análise de contrato', () => {
  it('envia o texto canônico ao Workers AI com JSON Schema e devolve apenas a análise validada', async () => {
    let receivedArguments: unknown[] = [];
    const bindings = bindingFromRun(async (...arguments_: unknown[]) => {
      receivedArguments = arguments_;
      return { response: JSON.stringify(validAnalysis), usage: { total_tokens: 100 } };
    });
    const app = createApp();

    const response = await app.request(
      '/api/contracts/023-2026/analyze',
      { method: 'POST' },
      bindings,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ analysis: validAnalysis });
    expect(receivedArguments[0]).toBe(CONTRACT_ANALYSIS_MODEL);
    expect(receivedArguments[1]).toMatchObject({
      messages: [
        { role: 'system' },
        {
          role: 'user',
          content: expect.stringMatching(
            /CLÁUSULA DÉCIMA PRIMEIRA[\s\S]+inclua essa cláusula em adjustments/,
          ),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: expect.objectContaining({ type: 'object', additionalProperties: false }),
      },
      temperature: 0,
      seed: 360,
    });
    expect(receivedArguments[2]).toMatchObject({ signal: expect.any(AbortSignal) });
  });

  it('aceita resposta do JSON Mode já decodificada pelo binding', async () => {
    const response = await createApp().request(
      '/api/contracts/023-2026/analyze',
      { method: 'POST' },
      bindingFromRun(async () => ({ response: validAnalysis })),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ analysis: validAnalysis });
  });

  it('normaliza erro do binding e resposta incompatível sem expor detalhes internos', async () => {
    const reportedErrors: unknown[] = [];
    for (const run of [
      async () => Promise.reject(new Error('token secreto e stack interna')),
      async () => ({ response: '{ resposta inválida' }),
    ]) {
      const response = await createApp({
        reportAnalysisError: (error) => reportedErrors.push(error),
      }).request('/api/contracts/023-2026/analyze', { method: 'POST' }, bindingFromRun(run));
      const body = await response.text();

      expect(response.status).toBe(502);
      expect(body).toContain('Não foi possível concluir a análise');
      expect(body).not.toContain('token secreto');
      expect(body).not.toContain('stack interna');
    }
    expect(reportedErrors).toHaveLength(2);
    expect(reportedErrors[0]).toBeInstanceOf(Error);
  });

  it('cancela a inferência no timeout e retorna o erro amigável', async () => {
    const bindings = bindingFromRun(
      (...arguments_: unknown[]) =>
        new Promise((_, reject) => {
          const options = arguments_[2] as { signal: AbortSignal };
          options.signal.addEventListener('abort', () => reject(options.signal.reason), {
            once: true,
          });
        }),
    );
    const response = await createApp({
      analysisTimeoutMs: 5,
      reportAnalysisError: () => undefined,
    }).request('/api/contracts/023-2026/analyze', { method: 'POST' }, bindings);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'Não foi possível concluir a análise. Tente novamente.',
    });
  });

  it('não chama o binding para um contrato inexistente', async () => {
    let calls = 0;
    const response = await createApp().request(
      '/api/contracts/999-2026/analyze',
      { method: 'POST' },
      bindingFromRun(async () => {
        calls += 1;
        return { response: JSON.stringify(validAnalysis) };
      }),
    );

    expect(response.status).toBe(404);
    expect(calls).toBe(0);
    expect(await response.json()).toEqual({ error: 'Contrato não encontrado.' });
  });
});

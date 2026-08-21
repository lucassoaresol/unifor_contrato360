import { describe, expect, it } from 'vitest';

import { contracts } from './data/contracts';
import { createApp } from './index';

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

import { Hono } from 'hono';

import { findContract } from './data/contracts';
import { analyzeContract } from './lib/contract-analysis';
import { ContractDetail } from './pages/ContractDetail';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { Document } from './renderer';

type AppOptions = {
  now?: () => Date;
  analysisTimeoutMs?: number;
  reportAnalysisError?: (error: unknown) => void;
};

function reportAnalysisErrorToServer(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.replace(/[\r\n\t]+/g, ' ').slice(0, 500);
    console.error(`[contract-analysis] ${error.name}: ${message}`);
    return;
  }

  console.error('[contract-analysis] UnknownError');
}

export function createApp({
  now = () => new Date(),
  analysisTimeoutMs = 25_000,
  reportAnalysisError = reportAnalysisErrorToServer,
}: AppOptions = {}) {
  const app = new Hono<{ Bindings: CloudflareBindings }>();

  app.get('/', (context) =>
    context.html(
      <Document
        description="Acompanhe contratos, prazos e pendências que precisam da sua atenção."
        title="Visão geral"
      >
        <Dashboard />
      </Document>,
    ),
  );

  app.get('/contratos/:id', (context) => {
    const contract = findContract(context.req.param('id'));
    if (!contract) {
      return context.html(
        <Document description="Contrato não encontrado." title="Contrato não encontrado">
          <NotFound contract />
        </Document>,
        404,
      );
    }

    return context.html(
      <Document
        description={`Acompanhamento do Contrato ${contract.number}.`}
        title={`Contrato ${contract.number}`}
      >
        <ContractDetail contract={contract} now={now()} />
      </Document>,
    );
  });

  app.post('/api/contracts/:id/analyze', async (context) => {
    const contract = findContract(context.req.param('id'));
    if (!contract?.content) {
      return context.json({ error: 'Contrato não encontrado.' }, 404);
    }

    try {
      const analysis = await analyzeContract(context.env.AI, contract.content, analysisTimeoutMs);
      return context.json({ analysis });
    } catch (error) {
      reportAnalysisError(error);
      return context.json({ error: 'Não foi possível concluir a análise. Tente novamente.' }, 502);
    }
  });

  app.notFound((context) =>
    context.html(
      <Document description="Página não encontrada." title="Página não encontrada">
        <NotFound />
      </Document>,
      404,
    ),
  );

  return app;
}

export default createApp();

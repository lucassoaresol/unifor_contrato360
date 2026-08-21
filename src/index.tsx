import { Hono } from 'hono';

import { findContract } from './data/contracts';
import { analyzeContract } from './lib/contract-analysis';
import { askContract, CONTRACT_QUESTION_MAX_LENGTH } from './lib/contract-question';
import { ContractDetail } from './pages/ContractDetail';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { Document } from './renderer';

type AppOptions = {
  now?: () => Date;
  analysisTimeoutMs?: number;
  questionTimeoutMs?: number;
  reportAnalysisError?: (error: unknown) => void;
  reportQuestionError?: (error: unknown) => void;
};

function reportAnalysisErrorToServer(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.replace(/[\r\n\t]+/g, ' ').slice(0, 500);
    console.error(`[contract-analysis] ${error.name}: ${message}`);
    return;
  }

  console.error('[contract-analysis] UnknownError');
}

function reportQuestionErrorToServer(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.replace(/[\r\n\t]+/g, ' ').slice(0, 500);
    console.error(`[contract-question] ${error.name}: ${message}`);
    return;
  }

  console.error('[contract-question] UnknownError');
}

export function createApp({
  now = () => new Date(),
  analysisTimeoutMs = 25_000,
  questionTimeoutMs = 25_000,
  reportAnalysisError = reportAnalysisErrorToServer,
  reportQuestionError = reportQuestionErrorToServer,
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

  app.post('/api/contracts/:id/ask', async (context) => {
    const contract = findContract(context.req.param('id'));
    if (!contract?.content) {
      return context.json({ error: 'Contrato não encontrado.' }, 404);
    }

    let body: unknown;
    try {
      body = await context.req.json();
    } catch {
      return context.json({ error: 'Digite uma pergunta sobre o contrato.' }, 400);
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body) ||
      Object.keys(body).length !== 1 ||
      !('question' in body) ||
      typeof body.question !== 'string'
    ) {
      return context.json({ error: 'Digite uma pergunta sobre o contrato.' }, 400);
    }

    const question = body.question.trim();
    if (question.length === 0) {
      return context.json({ error: 'Digite uma pergunta sobre o contrato.' }, 400);
    }
    if (question.length > CONTRACT_QUESTION_MAX_LENGTH) {
      return context.json(
        { error: `A pergunta deve ter no máximo ${CONTRACT_QUESTION_MAX_LENGTH} caracteres.` },
        400,
      );
    }

    try {
      const answer = await askContract(
        context.env.AI,
        contract.content,
        question,
        questionTimeoutMs,
      );
      return context.json(answer);
    } catch (error) {
      reportQuestionError(error);
      return context.json(
        { error: 'Não foi possível consultar o contrato. Tente novamente.' },
        502,
      );
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

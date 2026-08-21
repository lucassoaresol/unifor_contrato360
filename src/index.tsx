import { Hono } from 'hono';

import { findContract } from './data/contracts';
import { ContractDetail } from './pages/ContractDetail';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { Document } from './renderer';

type AppOptions = {
  now?: () => Date;
};

export function createApp({ now = () => new Date() }: AppOptions = {}) {
  const app = new Hono();

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

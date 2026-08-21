import type { FC } from 'hono/jsx';

import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';

type NotFoundProps = {
  contract?: boolean;
};

export const NotFound: FC<NotFoundProps> = ({ contract = false }) => (
  <Layout activePage={contract ? 'contracts' : 'overview'}>
    <div class="not-found">
      <span class="not-found__icon">
        <Icon name={contract ? 'document' : 'warning'} size={29} />
      </span>
      <p class="page-kicker">Não foi possível continuar</p>
      <h1>{contract ? 'Contrato não encontrado' : 'Página não encontrada'}</h1>
      <p>
        {contract
          ? 'Não encontramos o contrato solicitado.'
          : 'O endereço informado não corresponde a uma página disponível.'}
      </p>
      <a class="button button--primary" href="/">
        <Icon name="arrow-left" size={17} />
        Voltar para visão geral
      </a>
    </div>
  </Layout>
);

import type { FC } from 'hono/jsx';

import { Badge } from '../components/Badge';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import type { Contract } from '../data/contracts';
import { getContractTerm } from '../lib/contract-term';
import { formatCurrency, formatDate } from '../lib/formatters';

type ContractDetailProps = {
  contract: Contract;
  now: Date;
};

export const ContractDetail: FC<ContractDetailProps> = ({ contract, now }) => {
  const term = getContractTerm(contract.startsAt, contract.endsAt, now);
  const displayedStatus = term.kind === 'ended' ? 'Encerrado' : contract.status;

  return (
    <Layout activePage="contracts">
      <div class="page page--contract">
        <a class="back-link" href="/">
          <Icon name="arrow-left" size={17} />
          Voltar para visão geral
        </a>

        <header class="contract-hero">
          <div class="contract-hero__title-row">
            <div>
              <p class="page-kicker">Contrato administrativo</p>
              <h1>Contrato {contract.number}</h1>
            </div>
            <Badge label={displayedStatus} tone={term.kind === 'ended' ? 'neutral' : 'success'} />
          </div>
          <p class="contract-hero__object">{contract.object}</p>

          <dl class="contract-facts">
            <div>
              <dt>Contratada</dt>
              <dd>{contract.contractor}</dd>
            </div>
            <div>
              <dt>Valor global</dt>
              <dd>{formatCurrency(contract.valueInCents)}</dd>
            </div>
            <div>
              <dt>Vigência</dt>
              <dd>
                {formatDate(contract.startsAt)} — {formatDate(contract.endsAt)}
              </dd>
            </div>
            <div class={`term-state term-state--${term.kind}`}>
              <dt>Situação da vigência</dt>
              <dd>
                <Icon name="clock" size={17} />
                {term.label}
              </dd>
            </div>
          </dl>
        </header>

        <section class="next-action" aria-labelledby="next-action-heading">
          <div class="next-action__signal">
            <Icon name="shield" size={25} />
          </div>
          <div class="next-action__content">
            <div class="next-action__eyebrow">
              <span>Próxima ação</span>
              <Badge
                label={`Prioridade ${contract.nextAction.priority.toLowerCase()}`}
                tone="critical"
              />
            </div>
            <h2 id="next-action-heading">{contract.nextAction.title}</h2>
            <p>{contract.nextAction.description}</p>
          </div>
          <span class="next-action__hint">Providência recomendada</span>
        </section>

        <section class="obligations-section" aria-labelledby="obligations-heading">
          <div class="section-heading section-heading--compact">
            <div>
              <span class="section-heading__icon">
                <Icon name="clipboard" size={19} />
              </span>
              <div>
                <h2 id="obligations-heading">Obrigações do contrato</h2>
                <p>Acompanhamentos previstos para a execução contratual.</p>
              </div>
            </div>
            <span class="section-count">{contract.obligations.length} obrigações</span>
          </div>

          <div class="obligation-grid">
            {contract.obligations.map((obligation) => {
              const requiresAttention = obligation.status === 'Requer atenção';
              return (
                <article
                  class={`obligation-card${requiresAttention ? ' obligation-card--attention' : ''}`}
                >
                  <div
                    class={`obligation-card__icon${requiresAttention ? ' obligation-card__icon--attention' : ''}`}
                  >
                    <Icon name={requiresAttention ? 'warning' : 'check'} size={19} />
                  </div>
                  <div>
                    <h3>{obligation.title}</h3>
                    <p>{obligation.description}</p>
                  </div>
                  <Badge
                    label={obligation.status}
                    tone={requiresAttention ? 'attention' : 'success'}
                  />
                </article>
              );
            })}
          </div>
        </section>

        <aside class="future-space" aria-label="Evolução planejada">
          <div class="future-space__line" />
          <p>Este detalhe está preparado para receber novas formas de apoio à fiscalização.</p>
        </aside>
      </div>
    </Layout>
  );
};

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

        {contract.content && (
          <section
            class="analysis-section"
            aria-labelledby="analysis-heading"
            data-analysis
            data-endpoint={`/api/contracts/${contract.id}/analyze`}
          >
            <div class="section-heading analysis-section__heading">
              <div>
                <span class="section-heading__icon analysis-section__icon" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <h2 id="analysis-heading">Análise inteligente</h2>
                  <p>
                    Use Inteligência Artificial para identificar obrigações, prazos e pontos de
                    atenção presentes neste contrato.
                  </p>
                </div>
              </div>
            </div>

            <div data-analysis-state="initial">
              <button class="button button--analysis" type="button" data-analysis-start>
                <span aria-hidden="true">✦</span>
                Analisar contrato com IA
              </button>
              <p class="analysis-note">
                A análise é gerada a partir do conteúdo deste contrato e deve ser validada pelo
                responsável.
              </p>
            </div>

            <div class="analysis-loading" data-analysis-state="loading" hidden aria-live="polite">
              <div class="analysis-loading__pulse" aria-hidden="true" />
              <div>
                <h3>Analisando contrato...</h3>
                <p>Identificando informações para apoiar o acompanhamento:</p>
                <ul>
                  <li>obrigações da contratada e prazos;</li>
                  <li>garantias e regras de reajuste;</li>
                  <li>pontos de atenção e ações sugeridas.</li>
                </ul>
              </div>
            </div>

            <div class="analysis-error" data-analysis-state="error" hidden role="alert">
              <div>
                <h3>Não foi possível concluir a análise</h3>
                <p>O contrato continua disponível normalmente. Tente gerar a análise novamente.</p>
              </div>
              <button class="button button--secondary" type="button" data-analysis-retry>
                Tentar novamente
              </button>
            </div>

            <div data-analysis-state="success" hidden aria-live="polite">
              <div class="analysis-metrics" data-analysis-metrics />
              <div class="analysis-summary">
                <p class="analysis-eyebrow">Resumo do contrato</p>
                <p data-analysis-summary />
              </div>
              <div class="analysis-results" data-analysis-results />
              <div class="analysis-footer">
                <p>
                  Análise gerada por Inteligência Artificial a partir do conteúdo do contrato.
                  Valide as informações antes de utilizá-las em decisões administrativas.
                </p>
                <button class="analysis-again" type="button" data-analysis-again>
                  Analisar novamente
                </button>
              </div>
            </div>
          </section>
        )}
        {contract.content && (
          <section
            class="ask-section"
            aria-labelledby="ask-heading"
            data-contract-ask
            data-endpoint={`/api/contracts/${contract.id}/ask`}
          >
            <div class="section-heading ask-section__heading">
              <div>
                <span class="section-heading__icon ask-section__icon">
                  <Icon name="clipboard" size={19} />
                </span>
                <div>
                  <h2 id="ask-heading">Pergunte sobre este contrato</h2>
                  <p>
                    Consulte obrigações, prazos e outras informações diretamente no conteúdo do
                    contrato.
                  </p>
                </div>
              </div>
            </div>

            <p class="ask-suggestions-label">Sugestões de perguntas</p>
            <div class="ask-suggestions">
              {[
                'Quais são as principais obrigações da contratada?',
                'Quando o contrato pode ser reajustado?',
                'Qual é a regra da garantia contratual?',
                'Quais pontos precisam de acompanhamento?',
              ].map((question) => (
                <button class="ask-suggestion" type="button" data-ask-suggestion>
                  {question}
                </button>
              ))}
            </div>

            <form class="ask-form" data-ask-form novalidate>
              <label class="sr-only" for="contract-question">
                Pergunta sobre o contrato
              </label>
              <div class="ask-form__row">
                <input
                  id="contract-question"
                  name="question"
                  type="text"
                  maxlength={500}
                  placeholder="Pergunte sobre obrigações, prazos ou cláusulas do contrato..."
                  autocomplete="off"
                  data-ask-question
                />
                <button class="button ask-submit" type="submit" data-ask-submit>
                  Perguntar
                </button>
              </div>
              <div class="ask-form__meta">
                <p data-ask-validation role="alert" hidden />
                <span>
                  <span data-ask-count>0</span>/500
                </span>
              </div>
            </form>

            <div class="ask-loading" data-ask-state="loading" hidden aria-live="polite">
              <div class="analysis-loading__pulse" aria-hidden="true" />
              <div>
                <h3>Consultando contrato...</h3>
                <p>Localizando cláusulas relacionadas à pergunta.</p>
              </div>
            </div>

            <div class="ask-error" data-ask-state="error" hidden role="alert">
              <div>
                <h3>Não foi possível consultar o contrato</h3>
                <p>Tente novamente. O conteúdo e a análise do contrato continuam disponíveis.</p>
              </div>
              <button class="button button--secondary" type="button" data-ask-retry>
                Tentar novamente
              </button>
            </div>

            <div class="ask-result" data-ask-state="success" hidden aria-live="polite">
              <div class="ask-result__question">
                <p>Sua pergunta</p>
                <strong data-ask-asked />
              </div>
              <div class="ask-result__answer">
                <p>Resposta</p>
                <strong data-ask-answer />
                <div class="ask-result__sources" data-ask-sources />
              </div>
            </div>

            <p class="ask-note">
              As respostas são geradas por Inteligência Artificial com base no conteúdo deste
              contrato e devem ser validadas pelo responsável.
            </p>
          </section>
        )}
        {contract.content && <script src="/analysis.js" defer />}
      </div>
    </Layout>
  );
};

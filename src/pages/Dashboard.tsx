import type { FC } from 'hono/jsx';

import { AttentionCard } from '../components/AttentionCard';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { attentionItems, findContract, upcomingDeadlines } from '../data/contracts';

export const Dashboard: FC = () => (
  <Layout activePage="overview">
    <div class="page page--dashboard">
      <header class="page-header">
        <div>
          <p class="page-kicker">Acompanhamento de contratos</p>
          <h1>Visão geral</h1>
          <p>Acompanhe contratos, prazos e pendências que precisam da sua atenção.</p>
        </div>
        <div class="page-header__context">
          <span class="live-dot" />
          Dados atualizados para a demonstração
        </div>
      </header>

      <section aria-labelledby="indicadores-heading">
        <h2 class="sr-only" id="indicadores-heading">
          Indicadores gerais
        </h2>
        <div class="stats-grid">
          <StatCard icon="document" label="Contratos ativos" value={12} />
          <StatCard icon="pending" label="Pendências abertas" value={4} />
          <StatCard icon="warning" label="Alertas críticos" tone="critical" value={2} />
          <StatCard icon="calendar" label="Prazos próximos" value={3} />
        </div>
      </section>

      <section class="attention-section" aria-labelledby="attention-heading">
        <div class="section-heading">
          <div>
            <span class="section-heading__icon section-heading__icon--critical">
              <Icon name="warning" size={19} />
            </span>
            <div>
              <h2 id="attention-heading">Requer sua atenção</h2>
              <p>Situações que podem exigir providências nos próximos dias.</p>
            </div>
          </div>
          <span class="section-count">2 situações</span>
        </div>

        <div class="attention-list">
          {attentionItems.map((item) => {
            const contract = findContract(item.contractId);
            return contract ? <AttentionCard contract={contract} item={item} /> : null;
          })}
        </div>
      </section>

      <section class="deadlines-section" aria-labelledby="deadlines-heading">
        <div class="section-heading section-heading--compact">
          <div>
            <span class="section-heading__icon">
              <Icon name="calendar" size={19} />
            </span>
            <div>
              <h2 id="deadlines-heading">Próximos prazos</h2>
              <p>Entregas e verificações previstas para as próximas semanas.</p>
            </div>
          </div>
        </div>

        <div class="deadline-list">
          {upcomingDeadlines.map((deadline) => (
            <article class="deadline-item">
              <time class="deadline-item__date">
                <strong>{deadline.day}</strong>
                <span>{deadline.month}</span>
              </time>
              <span class="deadline-item__rail" />
              <div class="deadline-item__content">
                <h3>{deadline.title}</h3>
                <p>Contrato {deadline.contractNumber}</p>
              </div>
              <span class="deadline-item__status">Próximo</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  </Layout>
);

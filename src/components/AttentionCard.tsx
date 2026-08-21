import type { FC } from 'hono/jsx';

import type { AttentionItem, Contract } from '../data/contracts';
import { Badge } from './Badge';
import { Icon } from './Icon';

type AttentionCardProps = {
  contract: Contract;
  item: AttentionItem;
};

export const AttentionCard: FC<AttentionCardProps> = ({ contract, item }) => {
  const isCritical = item.severity === 'Crítico';

  return (
    <article class={`attention-card${item.featured ? ' attention-card--featured' : ''}`}>
      <div
        class={`attention-card__signal attention-card__signal--${isCritical ? 'critical' : 'attention'}`}
      >
        <Icon name={isCritical ? 'warning' : 'clock'} size={22} />
      </div>
      <div class="attention-card__body">
        <div class="attention-card__eyebrow">
          <span>Contrato {contract.number}</span>
          <Badge label={item.severity} tone={isCritical ? 'critical' : 'attention'} />
        </div>
        <h3>{contract.shortObject}</h3>
        <p>{item.message}</p>
      </div>
      {item.featured ? (
        <a class="button button--primary" href={`/contratos/${contract.id}`}>
          Ver contrato
          <Icon name="arrow-right" size={17} />
        </a>
      ) : (
        <span class="attention-card__contractor">{contract.contractor}</span>
      )}
    </article>
  );
};

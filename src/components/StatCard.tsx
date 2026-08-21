import type { FC } from 'hono/jsx';

import { Icon, type IconName } from './Icon';

type StatCardProps = {
  icon: IconName;
  label: string;
  tone?: 'critical' | 'default';
  value: number;
};

export const StatCard: FC<StatCardProps> = ({ icon, label, tone = 'default', value }) => (
  <article class={`stat-card stat-card--${tone}`}>
    <span class="stat-card__icon">
      <Icon name={icon} size={18} />
    </span>
    <span class="stat-card__value">{value}</span>
    <span class="stat-card__label">{label}</span>
  </article>
);

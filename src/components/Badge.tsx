import type { FC } from 'hono/jsx';

type BadgeTone = 'critical' | 'attention' | 'neutral' | 'success';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export const Badge: FC<BadgeProps> = ({ label, tone = 'neutral' }) => (
  <span class={`badge badge--${tone}`}>
    <span class="badge__dot" />
    {label}
  </span>
);

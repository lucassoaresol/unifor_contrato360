import type { FC } from 'hono/jsx';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'calendar'
  | 'check'
  | 'clipboard'
  | 'clock'
  | 'document'
  | 'grid'
  | 'pending'
  | 'shield'
  | 'warning';

type IconProps = {
  name: IconName;
  size?: number;
};

const paths: Record<IconName, string[]> = {
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z'],
  check: ['m5 12 4 4L19 6'],
  clipboard: [
    'M9 5h6',
    'M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z',
    'M7 5H5v16h14V5h-2',
    'M8 11h8',
    'M8 15h6',
  ],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
  document: ['M6 2h8l4 4v16H6V2Z', 'M14 2v5h4', 'M9 12h6', 'M9 16h6'],
  grid: ['M4 4h6v6H4V4Z', 'M14 4h6v6h-6V4Z', 'M4 14h6v6H4v-6Z', 'M14 14h6v6h-6v-6Z'],
  pending: ['M12 8v4l3 2', 'M21 12a9 9 0 1 1-2.64-6.36'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'm9 12 2 2 4-4'],
  warning: ['M12 3 2.8 20h18.4L12 3Z', 'M12 9v5', 'M12 18h.01'],
};

export const Icon: FC<IconProps> = ({ name, size = 20 }) => (
  <svg
    aria-hidden="true"
    class="icon"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.8"
  >
    {paths[name].map((path) => (
      <path d={path} />
    ))}
  </svg>
);

import type { Child, FC } from 'hono/jsx';

import stylesUrl from './styles.css?url';

type DocumentProps = {
  children: Child;
  description: string;
  title: string;
};

export const Document: FC<DocumentProps> = ({ children, description, title }) => (
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={description} name="description" />
      <meta content="#f5f7fb" name="theme-color" />
      <link href={stylesUrl} rel="stylesheet" />
      <title>{title} · Contrato360</title>
    </head>
    <body>{children}</body>
  </html>
);

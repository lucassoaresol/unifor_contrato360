# Contrato360

Prova de conceito para apoio à gestão e fiscalização de contratos administrativos. A primeira experiência ajuda
o fiscal a identificar o que requer atenção e navegar do alerta para a próxima ação do contrato.

## Tecnologias

- Hono e Hono JSX;
- TypeScript;
- Vite e Tailwind CSS;
- Cloudflare Workers.

Workers AI será incorporado em um incremento posterior para extrair obrigações, prazos e pontos de atenção do
texto contratual e responder perguntas fundamentadas. Esta feature usa apenas dados fictícios locais.

## Executar localmente

Requer Node.js 22.23.2 ou versão compatível mais recente e npm 10+.

```bash
nvm use
npm install
npm run hooks:install
npm run dev
```

A aplicação fica disponível no endereço informado pelo Vite. O fluxo principal é:

```text
/ → Requer sua atenção → /contratos/023-2026
```

## Validar

```bash
npm run check
npm run build
```

Consulte [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) para detalhes do ambiente e
[`.specs/STATE.md`](.specs/STATE.md) para o estado atual do produto.

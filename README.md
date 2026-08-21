# Contrato360

MVP demonstrável de apoio à gestão e fiscalização de contratos administrativos com Cloudflare Workers AI.

O repositório está na fase de **ambiente preparado**. Ainda não há código de aplicação. O escopo completo está em
[`docs/Handoff para Codex — MVP Contrato360.md`](docs/Handoff%20para%20Codex%20%E2%80%94%20MVP%20Contrato360.md) e o
estado de execução está em [`.specs/STATE.md`](.specs/STATE.md).

## Ambiente

Requisitos:

- Node.js 22.23.2 ou mais recente compatível
- npm 10 ou mais recente

Após clonar:

```bash
nvm use
npm install
npm run hooks:install
npm run doctor
npm run check
```

Os comandos `dev` e `build` serão habilitados junto do primeiro incremento de produto, quando o entrypoint da
aplicação existir. Isso evita confundir scaffolding vazio com um MVP funcional.

Leia [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) antes de iniciar a implementação.

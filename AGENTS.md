# Instruções do repositório

Este arquivo define as convenções duráveis do Contrato360.

## Fontes canônicas

- Comece por `.specs/STATE.md` e `.specs/features/INDEX.md`.
- O escopo de produto é `docs/Handoff para Codex — MVP Contrato360.md`.
- Use apenas a feature marcada como `Em execução`; itens propostos não autorizam implementação.
- Código, testes, specs vivas e documentação local prevalecem sobre fontes externas.
- Consulte documentação atual de Cloudflare, Hono, Vite ou Tailwind apenas para confirmar APIs.

## Limites do MVP

- Uma única aplicação Cloudflare Worker: TypeScript, Hono, Hono JSX, Vite, Workers AI e Tailwind CSS.
- Sem React SPA, Next.js, banco, autenticação, Docker, microserviços ou SDK intermediário de IA.
- Dados e o texto do contrato permanecem locais em TypeScript nesta versão.
- Workers AI é a única integração externa de produto e deve ser acessada pelo binding `AI`.
- Não implemente upload, PDF, OCR, persistência, deploy ou funcionalidades além do handoff sem pedido explícito.

## Fluxo de trabalho

- Use `.agents/skills/tlc-spec-driven` para especificar, implementar, retomar ou validar features.
- A origem da skill está em `.agents/vendor.json`; verifique atualizações com `npm run skill:check`.
- Para atualizar, exija worktree limpo, rode `npm run skill:merge`, revise conflitos e valide antes de aceitar.
- Preserve mudanças não relacionadas e prefira `rg` para buscas.
- Antes de alterar produto, confirme que existe uma feature `Em execução` no índice.
- Mantenha incrementos pequenos, completos e demonstráveis; não misture tooling e produto sem necessidade.
- Rode `npm run check` antes de concluir uma mudança local.
- Rode `npm run doctor` ao diagnosticar o ambiente.
- Ative o hook versionado uma vez por clone com `npm run hooks:install`.
- Pare antes de push, PR, release, deploy, escrita externa, custo relevante ou ação destrutiva.

## Qualidade

- TypeScript estrito; não use `any` sem justificativa local.
- Teste regras, parsing de respostas de IA e rotas de API; não teste apenas detalhes visuais.
- Erros do Workers AI nunca devem expor stack traces ao navegador.
- Não renderize saída de IA como HTML não confiável.
- O gate local é `npm run check`: lint, typecheck, testes e formatação.

## Segurança

- Nunca versione `.env`, `.dev.vars`, tokens, credenciais, dados reais ou documentos administrativos reais.
- Use somente bindings do Wrangler para Workers AI; não crie segredo de API no frontend.
- Trate todo conteúdo de IA como não confiável e valide respostas estruturadas na fronteira.

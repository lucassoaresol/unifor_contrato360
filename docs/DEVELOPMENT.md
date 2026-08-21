# Ambiente de desenvolvimento

## Estado atual

O ambiente foi preparado sem iniciar a aplicação. Não existem `src/`, páginas, componentes, mocks ou endpoints.
O próximo passo deve ser abrir explicitamente a primeira feature em `.specs/features/INDEX.md`.

## Decisões já fixadas pelo handoff

| Tema                    | Decisão                                                        |
| ----------------------- | -------------------------------------------------------------- |
| Runtime                 | Um único Cloudflare Worker                                     |
| HTTP e HTML             | Hono + Hono JSX                                                |
| Desenvolvimento e build | Vite + plugin oficial da Cloudflare                            |
| IA                      | Workers AI diretamente pelo binding `AI`                       |
| Estilos                 | Tailwind CSS 4, desde que permaneça simples                    |
| Dados                   | Mocks TypeScript, sem banco                                    |
| Segurança               | Sem tokens no código e sem HTML não confiável                  |
| Fora do MVP             | autenticação, PDF/OCR, banco, Docker, SPA e serviços separados |

## Toolchain preparada

- versões exatas no `package-lock.json`;
- ESLint com TypeScript estrito;
- Prettier;
- Vitest;
- Wrangler e plugin Cloudflare para Vite;
- Tailwind pelo plugin oficial do Vite;
- hook de pre-commit com inspeção de segredos e gate local;
- configuração do Codex com Context7 para documentação atual;
- skill local `tlc-spec-driven`, adaptada para specs e incrementos proporcionais ao MVP;
- recomendações e tarefas para VS Code;
- `npm run doctor` para diagnóstico rápido.

## Comandos

```bash
npm run doctor       # versões, arquivos essenciais e estado do Git
npm run lint         # análise estática
npm run typecheck    # TypeScript estrito
npm test             # testes; aceita zero testes enquanto não há produto
npm run format       # formata arquivos versionáveis
npm run format:check # valida formatação
npm run check        # gate local completo
npm run hooks:install
npm run skill:check  # compara a skill adaptada com o upstream; requer rede
```

## Rastreabilidade da skill

`.agents/vendor.json` registra repositório, caminho, commit-base, versão e customizações locais. O sincronizador
`scripts/update-vendored-skill.sh` baixa a base registrada e o upstream atual, mostra os dois diffs e não altera
arquivos no modo `--check`.

Uma atualização é deliberada: `npm run skill:merge` exige worktree limpo, faz merge de três vias e deixa o diff
para revisão. Se houver conflito, resolva-o e execute
`./scripts/update-vendored-skill.sh --accept <commit-upstream>` somente após validar a skill. O script nunca cria
commit, push ou release.

## Execução local futura

Quando a aplicação for iniciada, o primeiro incremento deve adicionar o entrypoint e então habilitar:

```bash
npm run dev
npm run build
```

O binding já está declarado em `wrangler.jsonc`. Workers AI pode exigir acesso remoto mesmo durante o
desenvolvimento local; nenhuma chave deve ser colocada em `.dev.vars` para esse binding.

## Sequência recomendada para o MVP

1. Casca navegável: renderer, layout, dashboard e detalhe com dados locais.
2. Contratos de IA: tipos, prompts, validação e parsing testável.
3. Endpoint e UX da análise, incluindo falha e nova tentativa.
4. Endpoint e UX de perguntas, incluindo citações e resposta não localizada.
5. Responsividade, acessibilidade, build do Worker e ensaio da demo de um minuto.

Essa sequência é preparação, não autorização automática para implementar todos os itens.

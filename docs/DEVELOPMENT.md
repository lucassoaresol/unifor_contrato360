# Ambiente de desenvolvimento

## Estado atual

A casca navegável está implementada com dashboard, detalhe do Contrato 023/2026, dados locais e estados 404. O
próximo incremento proposto é a análise com Workers AI e só pode começar após autorização explícita no índice.

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
npm run dev          # aplicação local pelo Vite e runtime Cloudflare
npm run build        # build de produção do Worker e dos assets
npm run lint         # análise estática
npm run typecheck    # TypeScript estrito
npm test             # testes de produto e integridade do repositório
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

## Execução local

```bash
npm run dev
npm run build
```

O binding `AI` será declarado no incremento de análise com Workers AI. Mantê-lo fora da casca navegável evita
exigir login ou conexão remota para executar esta primeira feature localmente; quando adicionado, nenhuma chave
deve ser colocada em `.dev.vars` para esse binding.

## Sequência recomendada para o MVP

1. Casca navegável: renderer, layout, dashboard e detalhe com dados locais — concluída.
2. Contratos de IA: tipos, prompts, validação e parsing testável.
3. Endpoint e UX da análise, incluindo falha e nova tentativa.
4. Endpoint e UX de perguntas, incluindo citações e resposta não localizada.
5. Responsividade, acessibilidade, build do Worker e ensaio da demo de um minuto.

Essa sequência é preparação, não autorização automática para implementar todos os itens.

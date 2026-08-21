# Ambiente de desenvolvimento

## Estado atual

As Features 001 a 003 estão concluídas: dashboard, detalhe do Contrato 023/2026, análise estruturada e consulta
fundamentada funcionam em um único Worker. A Feature 004 concluiu o polimento local da demo sem alterar contratos,
prompts ou capacidades de IA.

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

O binding `AI` está declarado no Wrangler e é a única integração externa do produto. Testes automatizados usam um
binding simulado e não fazem inferência paga; a execução das páginas e do restante da aplicação não exige login.
Nenhuma chave deve ser colocada no frontend ou em `.dev.vars` para esse binding.

## Sequência recomendada para o MVP

1. Casca navegável e narrativa de atenção — concluída.
2. Análise estruturada com Workers AI — concluída e validada com integração real.
3. Consulta ao contrato com fontes e ausência canônica — concluída e validada com integração real.
4. Polimento, autoria, apresentação pública e ensaio da demo de um minuto — concluída localmente.

O índice de features continua sendo a fonte de autorização para qualquer incremento posterior.

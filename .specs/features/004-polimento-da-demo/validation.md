# Validação — Feature 004

## Veredito

**PASS** — 21 de agosto de 2026.

A validação foi feita após releitura da spec e inspeção integral do diff. O percurso público, os estados já
existentes, a navegação, a autoria, a documentação e os gates locais atendem ao handoff sem alterar prompts,
schemas, endpoints, dados canônicos ou integrações das Features 001 a 003.

## Evidências por critério

- **AC-001 — PASS:** título e descrição canônicos em `src/index.tsx:48`, favicon em `src/renderer.tsx:18` e ordem do
  dashboard em `src/pages/Dashboard.tsx:9`; metadata e conteúdo cobertos em `src/index.test.tsx:15`.
- **AC-002 — PASS:** marca, duas rotas reais, autoria e links oficiais seguros em `src/components/Layout.tsx:44`;
  URLs, atributos e ausência de itens inertes cobertos em `src/index.test.tsx:23`.
- **AC-003 — PASS:** “Requer sua atenção” permanece no container de maior destaque em
  `src/pages/Dashboard.tsx:32` e `src/styles.css:348`; o indicador de atualização foi removido e sua ausência é
  coberta em `src/index.test.tsx:33`.
- **AC-004 — PASS:** hierarquia do detalhe em `src/pages/ContractDetail.tsx:27`, `src/pages/ContractDetail.tsx:62`,
  `src/pages/ContractDetail.tsx:80`, `src/pages/ContractDetail.tsx:120` e `src/pages/ContractDetail.tsx:199`; ordem
  e regressão dos endpoints cobertas em `src/index.test.tsx:48` e nos demais testes do mesmo arquivo.
- **AC-005 — PASS:** estados e retry da análise em `src/pages/ContractDetail.tsx:142`, estados e retry da consulta
  em `src/pages/ContractDetail.tsx:250`; ambos usam o mesmo pulso e padrões de erro em `src/styles.css:924` e
  `src/styles.css:1280`. Conteúdo dos estados e erros públicos estão cobertos em `src/index.test.tsx:69`.
- **AC-006 — PASS:** categorias vazias são omitidas, cláusulas e sugestões são rotuladas em
  `public/analysis.js:28` e `public/analysis.js:64`; grade, densidade e distinção semântica em
  `src/styles.css:981` e `src/styles.css:1059`.
- **AC-007 — PASS:** reajuste e obrigações lideram as sugestões em `src/pages/ContractDetail.tsx:220`; fontes e
  ausência sem badge inventado em `public/analysis.js:192`, com contratos de resposta cobertos nos testes de
  pergunta em `src/index.test.tsx:288`.
- **AC-008 — PASS:** existe uma única orientação em `src/pages/ContractDetail.tsx:188`, comprovada pela contagem em
  `src/index.test.tsx:84`.
- **AC-009 — PASS:** contrato e rota inexistentes usam mensagem contextual e retorno em
  `src/pages/NotFound.tsx:10`, cobertos em `src/index.test.tsx:116` e confirmados por HTTP local com status `404`.
- **AC-010 — PASS:** foco visível em `src/styles.css:117`, adaptação para notebook/tablet em
  `src/styles.css:1418`, resiliência celular em `src/styles.css:1471` e movimento reduzido em
  `src/styles.css:1652`. A inspeção estrutural confirmou grids sem largura fixa de conteúdo e ações preservadas.
- **AC-011 — PASS:** proposta, demonstração, IA, arquitetura, tecnologias e autoria estão em `README.md:1`.
- **AC-012 — PASS:** `npm run check`, `npm run build` e `git diff --check` passaram; não houve inferência real,
  deploy, nova dependência ou alteração das fronteiras de IA.

## Percurso e estados inspecionados

- `/` — `200`, metadata, marca, autoria, indicadores, atenção e prazos presentes.
- `/contratos/023-2026` — `200`, ordem contrato → ação → obrigações → análise → orientação → consulta presente.
- análise inicial/loading/sucesso/erro — markup completo, alternância exclusiva, `aria-busy`, resumo, métricas,
  itens fundamentados, retry e nova análise inspecionados em HTML, JavaScript e CSS.
- consulta inicial/loading/encontrada/não encontrada/erro — sugestões, label, campo, bloqueio, resposta, fontes,
  ausência sem fonte, retry e independência da análise inspecionados em HTML, JavaScript, CSS e testes de API.
- `/contratos/999-2026` — `404`, “Contrato não encontrado” e retorno à visão geral confirmados por HTTP local.
- Responsividade — regras para desktop, faixa até 1080 px e até 760 px inspecionadas; autoria continua disponível no
  layout estreito e nenhum elemento novo introduz largura fixa estrutural.

## Gates executados

- teste focado de rotas — PASS: 15 testes.
- `npm run check` — PASS: lint, typecheck, 24 testes em 4 arquivos, vendor e formatação.
- `npm run build` — PASS: Worker, CSS, `analysis.js` e `favicon.svg` gerados.
- `git diff --check` — PASS.
- HTTP local — PASS: dashboard e detalhe `200`; contrato inexistente `404`; JavaScript e favicon servidos.
- Escopo negativo — PASS: nenhuma dependência, prompt, schema, endpoint, binding, inferência real ou publicação foi
  adicionada ou alterada.

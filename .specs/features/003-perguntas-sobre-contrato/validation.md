# Validação — Feature 003

## Veredito

**PASS** — 21 de agosto de 2026.

A passagem foi feita após releitura da spec e inspeção do diff completo. O contrato HTTP, a integração tipada, a
validação defensiva, os estados da interface e os gates locais satisfazem os critérios. Com autorização explícita,
duas inferências pelo binding remoto confirmaram tanto a resposta fundamentada quanto a ausência canônica, sem
fallback ou adaptação da resposta do modelo.

## Evidências por critério

- **AC-001 — PASS local:** seção abaixo da análise, texto, sugestões em ordem, campo, CTA e transparência em
  `src/pages/ContractDetail.tsx:195`; resposta HTML e ordem cobertas em `src/index.test.tsx:36`.
- **AC-002 — PASS local:** sugestões apenas preenchem e focam o campo em `public/analysis.js:246`; submit envia
  JSON ao endpoint do próprio contrato em `public/analysis.js:214`.
- **AC-003 — PASS local:** shape exato, trim e limite são verificados antes da inferência em `src/index.tsx:101`;
  JSON inválido, vazio, propriedade extra e 501 caracteres sem chamada são cobertos em `src/index.test.tsx:318`.
- **AC-004 — PASS local:** prompt proíbe conhecimento externo e alteração de regras em
  `src/lib/contract-question.ts:52`; contrato e pergunta delimitados são enviados em
  `src/lib/contract-question.ts:135` e verificados em `src/index.test.tsx:258`.
- **AC-005 — PASS local:** parser exige fonte presente e cláusula existente no texto canônico em
  `src/lib/contract-question.ts:107`; UI renderiza pergunta, resposta e múltiplas fontes em
  `public/analysis.js:199`; cenário de reajuste/10.1 está em `src/index.test.tsx:258`.
- **AC-006 — PASS local:** mensagem canônica e relação `found: false`/fontes vazias são impostas em
  `src/lib/contract-question.ts:5` e `src/lib/contract-question.ts:124`; endpoint sem invenção é coberto em
  `src/index.test.tsx:302`.
- **AC-007 — PASS local:** schema rejeita extras e limita valores em `src/lib/contract-question.ts:12`; validação
  runtime rejeita extra, fonte ausente, duplicada, inventada e estados inconsistentes em
  `src/lib/contract-question.test.ts:22` e `src/lib/contract-question.test.ts:40`.
- **AC-008 — PASS local:** timeout com `AbortSignal` em `src/lib/contract-question.ts:151`, erro público estável em
  `src/index.tsx:138` e estado com retry em `src/pages/ContractDetail.tsx:257`; binding, saída inválida e timeout são
  cobertos em `src/index.test.tsx:354`.
- **AC-009 — PASS local:** resolução do contrato precede body e binding em `src/index.tsx:95`; 404 sem chamada é
  coberto em `src/index.test.tsx:408` e confirmado via HTTP local.
- **AC-010 — PASS local:** pergunta e saída usam somente `textContent` em `public/analysis.js:193` e
  `public/analysis.js:199`; consulta possui raiz e controles independentes da análise em `public/analysis.js:164`.
- **AC-011 — PASS:** `npm run check`, `npm run build` e `git diff --check` passaram; as duas inferências reais
  previstas também retornaram `200` e atravessaram a validação local.

## Gates executados

- `npm run check` — PASS: lint, typecheck, 24 testes em 4 arquivos, teste do vendor e formatação.
- `npm run build` — PASS: Worker e cliente gerados; `dist/client/analysis.js` contém a consulta e renderização por
  texto.
- `git diff --check` — PASS.
- HTTP local — PASS: detalhe e asset retornaram conteúdo esperado; pergunta vazia retornou `400`; contrato
  inexistente retornou `404`; ambos sem chamar Workers AI.
- Workers AI real — PASS: “Quando o contrato pode ser reajustado?” retornou `200`, resposta após o período mínimo
  de doze meses, `found: true` e cláusula 10.1.
- Workers AI real — PASS: “Qual é o percentual da multa por atraso?” retornou `200`, a mensagem canônica “Essa
  informação não foi localizada no contrato analisado.”, `found: false` e fontes vazias.
- Deploy Cloudflare — PASS: versão `2ef05aa3-6263-4bb3-ba37-9d23f4632062`, binding `env.AI` confirmado e novos
  `/analysis.js` e CSS enviados.
- Percurso publicado — PASS: `https://contrato360.lucas.soares.nom.br/contratos/023-2026` e `/analysis.js` contêm a
  consulta; pergunta vazia retornou `400` e contrato inexistente retornou `404` com mensagens estáveis.
- Workers AI publicado — PASS: a pergunta de reajuste retornou `200`, resposta após doze meses, `found: true` e
  cláusula 10.1 no domínio público.
- `npm run skill:check` — não executado com sucesso: rede indisponível para resolver `github.com`; a cópia
  vendorizada local foi usada e seu teste passou dentro de `npm run check`.

# Validação — Feature 001

## Veredito

**PASS** — 21 de agosto de 2026.

A passagem foi feita após releitura da spec e inspeção do diff. O fluxo dashboard → alerta → Contrato 023/2026,
os dois estados 404 e a entrega da folha de estilos foram percorridos no servidor Vite local. O servidor foi
encerrado após a validação e nenhuma integração externa foi utilizada.

## Evidências por critério

| Critério | Evidência                                                                              | Resultado |
| -------- | -------------------------------------------------------------------------------------- | --------- |
| AC-001   | `src/pages/Dashboard.tsx:12`; `src/data/contracts.ts:130`; `src/index.test.tsx:11`     | PASS      |
| AC-002   | `src/components/AttentionCard.tsx:30`; `src/index.test.tsx:31`                         | PASS      |
| AC-003   | `src/pages/ContractDetail.tsx:27`; `src/data/contracts.ts:27`; `src/index.test.tsx:34` | PASS      |
| AC-004   | `src/pages/ContractDetail.tsx:62`; `src/data/contracts.ts:38`; `src/index.test.tsx:44` | PASS      |
| AC-005   | `src/lib/contract-term.ts:24`; `src/lib/contract-term.test.ts:5`                       | PASS      |
| AC-006   | `src/index.tsx:27`; `src/index.tsx:48`; `src/index.test.tsx:50`                        | PASS      |
| AC-007   | `src/data/contracts.ts:27`; `src/index.test.tsx:70`; `wrangler.jsonc:1`                | PASS      |
| AC-008   | `src/styles.css:960`; `src/styles.css:1009`; `src/components/Layout.tsx:48`            | PASS      |
| AC-009   | `package.json:7`; `npm run check`; `npm run build`                                     | PASS      |

## Gates executados

- `npm run check`: PASS — lint, TypeScript estrito, 8 testes e formatação.
- `npm run build`: PASS — Worker e asset CSS de produção gerados.
- `npm run dev -- --host 127.0.0.1`: PASS — iniciou sem OAuth após manter o binding `AI` fora desta feature.
- Percurso HTTP local: `/` e `/contratos/023-2026` retornaram `200`; contrato e rota inexistentes retornaram
  `404`; stylesheet retornou `200 text/css` para a requisição de navegador.
- `git diff --check`: PASS.

## Escopo negativo confirmado

- nenhum endpoint, binding ou controle de Workers AI;
- nenhuma autenticação, persistência, upload, PDF ou OCR;
- nenhum login na Cloudflare, deploy, commit ou push.

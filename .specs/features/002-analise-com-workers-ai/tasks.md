# Tarefas — Feature 002

## 1. Estabelecer dados e fronteira da IA — concluída

- Atende: REQ-001–REQ-004, REQ-006, REQ-008; AC-003, AC-005–AC-007.
- Fronteira: texto canônico, schema, tipos, parser, serviço Workers AI, binding e endpoint Hono.
- Prova: testes unitários do parser e testes HTTP com binding simulado para sucesso, falha e contrato inexistente.
- Gate: nenhuma resposta não validada cruza a API; menor suíte relevante verde.
- Dependências: API atual do binding confirmada nos tipos/documentação.

## 2. Construir a interação e apresentação — concluída

- Atende: REQ-005, REQ-007, REQ-008; AC-001, AC-002, AC-004, AC-006, AC-008, AC-009.
- Fronteira: detalhe do contrato, script de navegador e estilos integrados.
- Prova: testes de HTML/API e percurso local dos quatro estados, incluindo texto hostil e retry.
- Gate: fluxo completo utilizável sem framework frontend e sem HTML não confiável.
- Dependências: tarefa 1.

## 3. Fechar tooling e documentação — concluída

- Atende: REQ-002, REQ-006; AC-010.
- Fronteira: Wrangler, tipos gerados/configurados e documentação viva estritamente necessária.
- Prova: `npm run check`, `npm run build` e `git diff --check`.
- Gate: configuração e tipos sincronizados pelo tooling do projeto; gates locais verdes.
- Dependências: tarefas 1–2.

## 4. Validar com novos olhos — concluída

- Atende: todos os critérios.
- Fronteira: diff final, demo e `.specs/features/002-analise-com-workers-ai/validation.md`.
- Prova: matriz `AC → arquivo:linha/teste`, estados de falha e escopo negativo.
- Gate: veredito `PASS`; inferência real registrada como executada ou pendente de autorização.
- Dependências: tarefas 1–3.

## 5. Verificar integração real — concluída

- Atende: REQ-002; AC-003, AC-010.
- Fronteira: Worker local/remoto com binding real, sem alterar testes.
- Prova: a resposta real final retornou `200`, atravessou a validação e trouxe todas as categorias esperadas com
  cláusulas de origem, sem penalidade ou irregularidade inventada.
- Gate: modelo e JSON Mode compatíveis com o contrato após aceitar resposta já decodificada e orientar o schema;
  nenhum retry automático ou deploy implícito.
- Dependências: tarefas 1–4.

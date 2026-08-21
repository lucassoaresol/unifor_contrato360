# Plano — Feature 003

## Incremento 1 — Contrato confiável e endpoint

- Atende `REQ-001` a `REQ-007` e `REQ-009`; criar o módulo de pergunta, testes de parsing e a rota dinâmica.
- Provar pergunta válida, ausência, saída já decodificada, entrada inválida sem custo, cláusula inexistente,
  propriedades extras, timeout, erro sanitizado e contrato inexistente.
- Gate: testes focados do módulo e da rota verdes.

## Incremento 2 — Consulta no detalhe

- Atende `REQ-008` e completa `REQ-009`; adicionar HTML semântico, JavaScript simples e estilos responsivos.
- Provar conteúdo e ordem das sugestões na resposta HTML; percorrer manualmente preenchimento, validação, loading,
  resposta encontrada, ausência, retry e independência em relação à análise.
- Gate: testes de rota e passagem local da página/asset verdes.
- Dependência: endpoint e contrato público estáveis.

## Incremento 3 — Fechamento e validação independente

- Relacionar todos os `AC-001` a `AC-011` a evidências, inspecionar o diff e registrar `validation.md`.
- Gate: `npm run check`, `npm run build`, `git diff --check` e demo HTTP local verdes; inferência real registrada
  como pendente, salvo nova autorização explícita.
- Dependência: incrementos 1 e 2 concluídos.

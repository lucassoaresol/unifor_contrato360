# Plano — Feature 004

## Incremento 1 — Estrutura pública e percurso

- Atende `REQ-001`, `REQ-002`, `REQ-005` e `REQ-006`; revisar sidebar, autoria, navegação, metadata, textos e 404.
- Provar conteúdo, ausência de itens inertes e atributos seguros em testes HTTP.
- Gate: testes focados de rotas verdes.

## Incremento 2 — Densidade e estados da IA

- Atende `REQ-003` e `REQ-004`; refinar detalhe, resultado, consulta, loading, erro, transparência e responsividade.
- Provar regressão dos endpoints e percorrer manualmente todos os estados sem inferência remota.
- Gate: testes de UI/rotas e build verdes.
- Dependência: incremento 1.

## Incremento 3 — README e fechamento

- Atende `REQ-007`; atualizar apresentação pública e reconciliar specs vivas com fatos verificados.
- Provar os links, conteúdo documental e ausência de escopo novo no diff.
- Gate: `npm run check`, `npm run build` e `git diff --check` verdes.
- Dependência: incrementos 1 e 2.

## Incremento 4 — Validação com novos olhos

- Relacionar `AC-001` a `AC-012` a evidências e percorrer `/`, detalhe, estados de IA, consulta e 404.
- Gate: `validation.md` com veredito `PASS`; ausência de evidência resulta em `FAIL`.
- Dependência: incrementos 1 a 3.

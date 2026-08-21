# Tarefas — Feature 001

## 1. Modelar dados e vigência — concluída

- Atende: REQ-003, REQ-004; AC-005, AC-007.
- Fronteira: `src/data/` e regra pura de vigência.
- Prova: testes com data durante e depois da vigência.
- Gate: dados plausíveis e regra sem números negativos.
- Dependências: nenhuma.

## 2. Criar a aplicação e as rotas — concluída

- Atende: REQ-002, REQ-005, REQ-006; AC-002, AC-003, AC-004, AC-006.
- Fronteira: entrypoint Hono, renderer, páginas e componentes compartilhados.
- Prova: testes HTTP das rotas, destinos e conteúdo narrativo.
- Gate: dashboard, detalhe e not-found respondem com os status e ações esperados.
- Dependências: tarefa 1.

## 3. Construir a experiência visual responsiva — concluída

- Atende: REQ-001, REQ-007; AC-001, AC-008.
- Fronteira: layout, componentes de UI e `src/styles.css`.
- Prova: percurso manual da demo e inspeção em desktop, tablet e viewport menor.
- Gate: “Requer sua atenção” domina a hierarquia e o fluxo é autoexplicativo.
- Dependências: tarefa 2.

## 4. Fechar execução local e documentação — concluída

- Atende: AC-009.
- Fronteira: scripts do `package.json`, README e documentação viva.
- Prova: `npm run check` e `npm run build`.
- Gate: comandos documentados correspondem aos comandos executados com sucesso.
- Dependências: tarefas 1–3.

## 5. Validar com novos olhos — concluída

- Atende: todos os critérios.
- Fronteira: diff final e `validation.md`.
- Prova: matriz de evidências `AC → arquivo:linha/teste` e percurso de falha.
- Gate: veredito `PASS`; qualquer ausência de evidência resulta em `FAIL`.
- Dependências: tarefas 1–4.

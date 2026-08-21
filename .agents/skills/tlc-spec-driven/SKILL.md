---
name: tlc-spec-driven
description: Planejar, implementar, retomar e validar features do Contrato360 com specs vivas, incrementos pequenos e rastreabilidade proporcional. Use ao especificar, construir, alterar ou validar produto; não use para diagnóstico puro do ambiente ou perguntas sem mudança.
license: CC-BY-4.0
metadata:
  source: Adaptado do Tech Lead's Club Spec-Driven Development usado no sistema-edren
  version: 1.0.0-contrato360
---

# Desenvolvimento orientado por specs do Contrato360

Transforme o handoff em incrementos demonstráveis sem transformar um MVP pequeno em um processo pesado.

## Fontes e autoridade

Antes de agir, leia:

1. `.specs/STATE.md`;
2. `.specs/features/INDEX.md`;
3. `docs/Handoff para Codex — MVP Contrato360.md` apenas nas seções relevantes;
4. a única feature marcada como `Em execução`, se houver.

Reconcilie essas fontes com o workspace. Código e testes observados vencem um Handoff desatualizado.
Uma feature proposta não autoriza implementação. Quando o usuário pedir construção ou alteração, a sessão
principal pode mover o incremento correspondente para `Em execução` como parte normal desse pedido.

## Dimensione o processo

| Tamanho | Artefatos antes do código |
| --- | --- |
| Pequeno: até 3 arquivos, comportamento óbvio | objetivo e critérios diretamente na conversa |
| Médio: uma fatia clara do MVP | `spec.md` breve com critérios verificáveis |
| Grande: UI + rota + IA ou várias fronteiras | `spec.md` e `tasks.md`; `design.md` apenas se houver decisão arquitetural real |

Crie artefatos apenas quando contiverem decisões. Não crie placeholders vazios.

## Especifique o resultado

Para uma feature média ou grande, crie `.specs/features/<NNN-nome>/spec.md` contendo:

- objetivo observável e vínculo com a demo de um minuto;
- dentro e fora do escopo;
- requisitos `REQ-NNN`;
- critérios de aceitação `AC-NNN` testáveis;
- estados de carregamento, vazio e erro quando aplicáveis;
- riscos, suposições e decisões ainda abertas.

Critérios devem descrever resultados, não detalhes internos. Para comportamento condicional, prefira a forma
“Dado/Quando/Então” ou EARS (“Quando X, o sistema deve Y”).

Features que tocam Workers AI devem decidir explicitamente:

- contrato de entrada e saída;
- validação e parsing da resposta;
- timeout e falhas amigáveis;
- fundamentação por cláusula e resposta quando a informação não existe;
- fronteira entre fatos do contrato e recomendações;
- teste sem chamada real paga e verificação manual da integração real.

Não invente uma API. Confirme primeiro no código e docs locais, depois via Context7 ou documentação oficial.

## Planeje por incrementos de valor

Use `tasks.md` somente quando houver mais de três passos ou dependências relevantes. Cada tarefa deve indicar:

- requisito e critério atendidos;
- arquivos ou fronteira provável;
- teste que prova o resultado;
- gate de conclusão;
- dependências reais.

Agrupe tarefas em incrementos que deixam um resultado utilizável e reversível. Para este MVP, prefira fatias
verticais pequenas a camadas incompletas espalhadas.

## Execute

Antes de editar, declare brevemente o incremento e o gate. Durante a implementação:

- derive testes dos critérios de aceitação, nunca do formato acidental do código;
- preserve os limites de stack do `AGENTS.md`;
- mantenha uma única aplicação Worker e uma única fonte para o texto mockado do contrato;
- valide dados vindos da IA antes de renderizar;
- não enfraqueça testes para obter PASS;
- não inicie o incremento seguinte enquanto o atual estiver vermelho.

Rode o menor teste útil durante a iteração e `npm run check` ao fechar o incremento. Build e integração real com
Workers AI entram no gate quando esses comandos existirem e a feature tocar essa superfície.

Atualize a feature e `.specs/STATE.md` somente com fatos verificados. Registre no Handoff o próximo passo exato,
gates executados e qualquer bloqueio; não use o Handoff como diário de tentativas.

## Valide com novos olhos

Ao concluir uma feature de UI ou IA:

1. releia a spec sem reutilizar conclusões anteriores;
2. inspecione o diff final;
3. associe cada `AC-NNN` a evidência `arquivo:linha` e teste;
4. execute `npm run check` e o build aplicável;
5. percorra a demo relevante e os estados de falha;
6. registre `validation.md` com veredito `PASS` ou `FAIL`.

Ausência de evidência é falha, não inferência. Use o agente `fresh_eyes_validator` apenas quando a sessão tiver
autorização para delegar; caso contrário faça a passagem independente na sessão principal.

## Git e ações externas

Um pedido para construir autoriza edições e verificações locais do incremento. Commit, push, deploy, login na
Cloudflare, uso com custo e qualquer escrita externa dependem da autoridade vigente e de confirmação explícita
quando exigida. Nunca coloque credenciais ou documentos reais no Git.


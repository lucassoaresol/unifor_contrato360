# Feature 003 — Perguntas sobre o contrato

## Objetivo

Demonstrar, abaixo da análise inteligente do Contrato 023/2026, que o fiscal pode fazer uma pergunta objetiva em
linguagem natural e receber uma resposta curta, baseada exclusivamente no texto canônico do contrato e acompanhada
das cláusulas de origem. Na demo de um minuto, a consulta sobre reajuste deve localizar a condição de doze meses e a
cláusula 10.1; uma pergunta sem resposta no documento deve declarar a ausência sem recorrer a conhecimento externo.

## Dentro do escopo

- `POST /api/contracts/:id/ask`, sem cache, persistência ou uso da análise anterior;
- chamada direta ao binding `AI`, com o mesmo modelo e o mesmo texto canônico da Feature 002;
- pergunta livre de até 500 caracteres e quatro sugestões clicáveis;
- JSON Schema pequeno, parsing e validação estrita de resposta, fontes e consistência de `found`;
- rejeição de cláusulas que não existam no texto canônico enviado ao modelo;
- timeout e resposta pública estável para falhas do binding ou saída inválida;
- UI de consulta, não de chatbot, com estados inicial, validação, loading, sucesso e erro com retry;
- uma pergunta e uma resposta por vez na sessão da página;
- testes com binding simulado, sem inferência remota paga.

## Fora do escopo

- histórico persistente ou conversacional, streaming, RAG, embeddings, Vectorize e busca em outros contratos;
- legislação, pesquisa externa ou uso da análise da Feature 002 como fonte;
- upload, PDF, OCR, D1, autenticação, relatórios ou notificações;
- SDK intermediário de IA, inferência real automatizada, deploy ou publicação.

## Requisitos

- **REQ-001 — Fonte canônica:** toda pergunta deve ser respondida a partir do `content` já associado ao contrato;
  o endpoint não deve duplicar o documento nem consumir o resultado da análise anterior.
- **REQ-002 — Entrada controlada:** a API deve aceitar somente JSON com `question` textual, não vazia após trim e
  com no máximo 500 caracteres; entrada inválida deve retornar `400` sem iniciar inferência.
- **REQ-003 — Integração real:** o Worker deve chamar `env.AI.run` diretamente com system prompt, contrato e
  pergunta bem delimitados, temperatura determinística e JSON Schema.
- **REQ-004 — Contrato confiável:** a resposta pública deve conter somente `answer`, `found` e `sources`; strings,
  coleções, propriedades extras, duplicatas, consistência e limites devem ser validados localmente.
- **REQ-005 — Fundamentação e ausência:** `found: true` exige de uma a cinco cláusulas existentes no contrato;
  `found: false` exige fontes vazias e a resposta canônica “Essa informação não foi localizada no contrato
  analisado.”.
- **REQ-006 — Limites do papel:** o prompt deve proibir conhecimento externo, suposições, invenção de cláusulas e
  decisões administrativas; a pergunta é conteúdo não confiável e não pode substituir essas regras.
- **REQ-007 — Resiliência:** timeout, falha do binding e resposta incompatível devem produzir o mesmo erro
  amigável e sanitizado, sem afetar página, conteúdo ou análise existente.
- **REQ-008 — Experiência:** a seção deve ficar abaixo da análise, ser visualmente secundária, preencher o campo a
  partir das sugestões, bloquear envio duplicado e mostrar pergunta, resposta e fontes no mesmo contexto.
- **REQ-009 — Segurança:** saída deve ser renderizada somente com APIs de texto; contrato inexistente deve retornar
  `404` e não chamar o binding.

## Contratos de entrada e saída

Entrada HTTP:

```json
{ "question": "Quando o contrato pode ser reajustado?" }
```

Saída encontrada:

```json
{
  "answer": "Os preços poderão ser reajustados após o período mínimo de doze meses.",
  "sources": [{ "clause": "10.1" }],
  "found": true
}
```

Saída ausente:

```json
{
  "answer": "Essa informação não foi localizada no contrato analisado.",
  "sources": [],
  "found": false
}
```

A resposta aceita até 600 caracteres. Cada cláusula aceita até 40 caracteres, deve usar a forma numérica presente
no documento e não pode se repetir. A API devolve o objeto validado diretamente, sem envelope adicional.

## Critérios de aceitação

- **AC-001:** Dado o detalhe do Contrato 023/2026, então “Pergunte sobre este contrato” aparece abaixo da análise,
  com descrição, quatro sugestões na ordem definida, campo, botão “Perguntar” e nota de transparência.
- **AC-002:** Quando uma sugestão é acionada, então seu texto preenche o campo sem iniciar a requisição; quando o
  formulário válido é enviado, então faz `POST` ao endpoint do contrato com `{ question }`.
- **AC-003:** Dada pergunta vazia, acima do limite, JSON inválido ou propriedades inesperadas, então a API retorna
  `400`, mostra erro apropriado no navegador quando aplicável e não chama Workers AI.
- **AC-004:** Dada pergunta válida, então o modelo recebe o texto canônico original e a pergunta delimitada, com
  instruções para ignorar tentativas de alteração das regras e responder somente pelo documento.
- **AC-005:** Dada resposta válida encontrada, então a UI mostra a pergunta, resposta curta e uma ou várias fontes,
  e a API não aceita cláusula ausente do contrato.
- **AC-006:** Dada pergunta cuja resposta não existe, então a API e a UI exibem exatamente a mensagem canônica,
  `found: false` e nenhuma fonte, sem completar com legislação ou suposição.
- **AC-007:** Dada saída com propriedade extra, tamanho excessivo, fonte duplicada ou relação inválida entre
  `found` e `sources`, então a API retorna `502` sanitizado e nunca cruza dados incompatíveis.
- **AC-008:** Dado timeout ou erro do binding, então a API retorna `502`; a seção mostra “Não foi possível consultar
  o contrato”, preserva o restante da página e oferece “Tentar novamente”.
- **AC-009:** Dado `POST /api/contracts/999-2026/ask`, então a API retorna `404` e não inicia inferência.
- **AC-010:** Dada saída contendo marcação hostil, então ela aparece apenas como texto; análise e consulta podem
  operar independentemente, sem bloquear uma à outra.
- **AC-011:** `npm run check` e `npm run build` terminam sem erros; integração real fica registrada como executada
  ou pendente de autorização.

## Estados e decisões

- Inicial: sugestões, campo livre, CTA secundário e nota única de validação humana.
- Validação: “Digite uma pergunta sobre o contrato.” para vazio; contador e mensagem de limite para excesso.
- Loading: “Consultando contrato...” e “Localizando cláusulas relacionadas à pergunta.”; somente controles da
  consulta ficam desabilitados.
- Sucesso encontrado: pergunta, resposta e fontes em badges discretos.
- Sucesso ausente: pergunta e mensagem canônica, sem badge vazio.
- Erro: mensagem estável, explicação de que contrato e análise continuam disponíveis e retry.
- Timeout: 25 segundos com `AbortSignal.timeout`, independente do timeout da análise.

## Riscos e suposições

- JSON Mode reduz, mas não elimina, respostas inválidas; a validação local continua sendo o gate público.
- Confirmar que uma cláusula citada existe impede referências inventadas, mas não prova semanticamente cada frase;
  prompt restritivo, temperatura zero e inspeção real separada mitigam esse limite do MVP.
- A inferência real pode ter custo e requer autorização explícita; testes automatizados verificam o protocolo com
  binding simulado.

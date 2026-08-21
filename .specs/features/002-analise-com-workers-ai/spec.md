# Feature 002 — Análise de contrato com Workers AI

## Objetivo

Demonstrar, no detalhe do Contrato 023/2026, que o Contrato360 envia o texto fictício do contrato ao Cloudflare
Workers AI e transforma a resposta em informações estruturadas, acionáveis e fundamentadas por cláusula. Na demo
de um minuto, o fiscal inicia a análise, entende o processamento, vê resumo, obrigações, prazos, garantia, reajuste,
pontos de acompanhamento e sugestões, sem atribuir à IA uma decisão administrativa.

## Dentro do escopo

- uma única fonte local para o texto fictício do Contrato 023/2026;
- binding `AI` e chamada direta a `env.AI.run` com `@cf/meta/llama-3.1-8b-instruct-fast`;
- `POST /api/contracts/:id/analyze`, sem persistência ou cache;
- JSON Mode com schema pequeno, parsing e validação estrita na fronteira;
- timeout e resposta pública estável para qualquer falha de processamento;
- UI em JavaScript simples com estados inicial, carregando, sucesso e erro, incluindo retry;
- resultados e contadores derivados exclusivamente da resposta validada;
- testes com binding simulado e sem inferência remota paga;
- verificação manual separada com o binding real, condicionada à autorização para custo externo.

## Fora do escopo

- chat ou endpoint de perguntas, upload, PDF, OCR, RAG, embeddings ou Vectorize;
- D1, KV, R2, cache, persistência, autenticação, filas ou outro serviço;
- streaming, SDK intermediário de IA, token no frontend ou redesign do dashboard;
- inferência real como parte dos testes automatizados, deploy, commit, push ou publicação.

## Requisitos

- **REQ-001 — Entrada canônica:** o contrato analisável deve possuir texto integral fictício em uma única fonte
  TypeScript e o endpoint deve enviar esse texto ao modelo.
- **REQ-002 — Integração real:** o Worker deve usar o binding `AI` diretamente e o modelo definido, com JSON Mode
  e sem resposta mockada no fluxo de produção.
- **REQ-003 — Contrato confiável:** a saída deve conter resumo e coleções de obrigações, prazos, garantias,
  reajustes, pontos de atenção e ações sugeridas; todos os valores devem ser validados antes da resposta pública.
- **REQ-004 — Fundamentação e ausência:** itens derivados devem citar cláusula; campos e coleções ausentes não
  podem ser preenchidos com fatos inventados, como penalidade não prevista no contrato.
- **REQ-005 — Papel da IA:** fatos contratuais e sugestões de acompanhamento devem permanecer distintos; a UI não
  deve apresentar irregularidade, infração ou decisão administrativa inferida.
- **REQ-006 — Resiliência:** timeout, erro do binding e resposta inválida devem produzir o mesmo erro amigável,
  sem stack trace nem detalhe interno, e nunca indisponibilizar a página do contrato.
- **REQ-007 — Interação:** a seção deve explicar o loading, bloquear cliques duplicados, renderizar resultado
  validado, permitir nova execução/retry e preservar a hierarquia abaixo das obrigações existentes.
- **REQ-008 — Segurança:** somente o servidor acessa `env.AI`; saída é inserida como texto, nunca como HTML não
  confiável, e contrato inexistente não inicia inferência.

## Contrato de entrada e saída

Entrada do modelo: system prompt em português brasileiro e o texto integral local do contrato em mensagem de
usuário. A resposta validada possui:

- `summary: string`;
- `obligations: { title, description, clause, deadline? }[]`;
- `deadlines: { title, description, value, clause }[]`;
- `guarantees: { title, description, clause }[]`;
- `adjustments: { title, description, clause }[]`;
- `attentionPoints: { title, description, clause, severity }[]`, com severidade `attention | relevant | high`;
- `recommendedActions: { title, reason, clause, priority }[]`, com prioridade `low | medium | high`.

Strings devem ser não vazias e possuir limites defensivos; coleções podem ser vazias quando a informação não
existir. Penalidades não integram o schema e propriedades extras não são aceitas. A cláusula é obrigatória nos
itens derivados porque o contrato de demonstração possui numeração explícita.

## Critérios de aceitação

- **AC-001:** Dado o Contrato 023/2026, quando a página abre, então a seção “Análise inteligente” aparece abaixo
  das obrigações, explica seu propósito e oferece “Analisar contrato com IA”.
- **AC-002:** Quando a análise é iniciada, então o navegador faz `POST /api/contracts/023-2026/analyze`, desabilita
  nova execução e mostra quais categorias estão sendo identificadas.
- **AC-003:** Dado um contrato válido, quando o endpoint é chamado, então o Worker envia o texto canônico ao modelo
  configurado via `env.AI.run`, usando schema estruturado, e devolve apenas dados validados.
- **AC-004:** Dada uma resposta válida, então a UI mostra contagens reais, resumo e as seis categorias, mantendo
  cláusulas perceptíveis e ações claramente apresentadas como sugestões.
- **AC-005:** Dada uma resposta sem penalidade, então parsing e renderização não inventam multa, percentual ou
  outro dado ausente; coleções vazias são aceitas.
- **AC-006:** Dado timeout, falha do binding ou saída incompatível, então a API responde `502` com mensagem pública
  estável e a UI oferece “Tentar novamente”, enquanto o restante do contrato continua visível.
- **AC-007:** Dado `POST /api/contracts/999-2026/analyze`, então a API responde `404` e o binding não é chamado.
- **AC-008:** Dada uma resposta contendo texto hostil, então a interface a trata como texto e não executa nem
  injeta HTML fornecido pela IA.
- **AC-009:** Dadas execuções sucessivas, então cada ação inicia uma nova inferência, sem cache ou persistência.
- **AC-010:** `npm run check` e `npm run build` terminam sem erros; a integração real é registrada separadamente
  como executada ou pendente de autorização.

## Estados e decisões

- Inicial: explicação breve, nota de validação humana e botão principal discreto.
- Loading: texto “Analisando contrato” e lista das categorias; botões ficam indisponíveis.
- Sucesso: contadores derivados, seções estruturadas e nota discreta de responsabilidade.
- Erro: “Não foi possível concluir a análise” e retry, sem substituir conteúdo normal do contrato.
- Timeout da aplicação: 25 segundos, implementado com cancelamento cooperativo por `AbortSignal.timeout`; toda
  falha é normalizada na fronteira HTTP.
- As coleções vazias permanecem válidas e a UI informa que nada foi identificado naquela categoria apenas quando
  necessário; não há fallback inventado.

## Riscos e suposições

- A forma exata da resposta do SDK deve ser confirmada nos tipos locais e documentação atual antes do código.
- JSON Mode reduz, mas não elimina, saída inválida; validação local continua obrigatória.
- A inferência é probabilística; testes verificam protocolo e comportamento com binding simulado, não frases.
- A chamada real pode exigir login, binding e custo; será pausada antes da execução para autorização explícita.

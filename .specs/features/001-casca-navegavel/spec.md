# Feature 001 — Casca navegável

## Objetivo

Entregar uma experiência visual e navegável que permita entender, em poucos segundos, que o Contrato360 ajuda
o fiscal a priorizar o que requer atenção. Na demo, o usuário identifica o alerta mais urgente no dashboard,
abre o Contrato 023/2026 e encontra o motivo, a próxima ação e a obrigação relacionada.

## Dentro do escopo

- aplicação única Cloudflare Worker com TypeScript, Hono JSX, Vite e Tailwind CSS;
- dashboard em `/` com indicadores compactos, alertas e próximos prazos;
- detalhe navegável do Contrato 023/2026;
- pelo menos quatro contratos administrativos fictícios em TypeScript;
- cálculo dinâmico e testável do estado da vigência;
- respostas amigáveis para contrato e rota inexistentes;
- layout prioritariamente desktop, confortável em tablet e resiliente em viewport menor;
- scripts de desenvolvimento e build, testes de regras e rotas e README atualizado.

## Fora do escopo

- Workers AI, endpoints de análise ou perguntas e controles de IA;
- upload, PDF, OCR, persistência, autenticação ou notificações reais;
- CRUD, páginas funcionais de ocorrências ou pendências, aplicativo móvel e deploy.

## Requisitos

- **REQ-001 — Priorização:** o dashboard deve destacar “Requer sua atenção” acima das informações operacionais.
- **REQ-002 — Continuidade:** o alerta crítico, a próxima ação e a obrigação de garantia devem contar a mesma
  narrativa operacional.
- **REQ-003 — Dados locais:** contratos, alertas e prazos devem permanecer locais em TypeScript e usar nomes
  plausíveis.
- **REQ-004 — Vigência:** os dias restantes devem ser derivados da data atual; contratos encerrados não devem
  produzir números negativos.
- **REQ-005 — Navegação:** somente Visão geral e o detalhe precisam ser funcionais, sem sugerir IA disponível.
- **REQ-006 — Falhas amigáveis:** contrato ou rota inexistente não deve expor erro técnico.
- **REQ-007 — Qualidade visual:** a interface deve usar hierarquia, cor semântica e microinterações discretas,
  permanecendo utilizável em desktop e tablet.

## Critérios de aceitação

- **AC-001:** Dado o dashboard, quando a página é carregada, então título, descrição, quatro indicadores, dois
  alertas e três próximos prazos são exibidos em português brasileiro.
- **AC-002:** Dado o alerta crítico do Contrato 023/2026, quando “Ver contrato” é acionado, então o destino é
  `/contratos/023-2026`.
- **AC-003:** Dado o detalhe do Contrato 023/2026, quando carregado, então identificação, status, objeto,
  contratada, valor, vigência e estado calculado da vigência são exibidos.
- **AC-004:** Dado o detalhe, então “Verificar validade da garantia contratual” aparece como próxima ação de
  prioridade alta e a obrigação de garantia aparece como “Requer atenção”.
- **AC-005:** Dada uma data durante a vigência, então a regra retorna dias restantes não negativos; após o fim,
  retorna um estado encerrado coerente.
- **AC-006:** Dado `/contratos/999-2026` ou outra rota inexistente, então uma página amigável oferece retorno à
  visão geral sem stack trace.
- **AC-007:** Dado o conteúdo local, então existem ao menos quatro contratos fictícios plausíveis e não há
  chamada externa ou controle de IA inerte.
- **AC-008:** Dadas larguras de desktop e tablet, então conteúdo, navegação, alertas e ações permanecem legíveis
  e acionáveis; em viewport menor, a interface não apresenta overflow horizontal estrutural.
- **AC-009:** `npm run check` e `npm run build` terminam sem erros.

## Estados e decisões

- Não há loading nem estado vazio de coleção porque os dados são estáticos nesta feature.
- Rotas não encontradas usam uma página compartilhada com mensagem contextual e retorno ao dashboard.
- Itens futuros da sidebar podem aparecer identificados como indisponíveis, mas não como links funcionais.
- O cálculo de dias usa dias civis em UTC para não variar com horário de verão ou hora da execução.

## Riscos e suposições

- As datas do handoff são fixas em 2026; depois do encerramento, a UI deve assumir “Vigência encerrada”.
- A inspeção responsiva será feita no HTML/CSS gerado e por execução local; otimização profunda para celular não
  integra este incremento.

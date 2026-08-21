# Handoff para Codex — MVP Contrato360

Quero que você implemente um MVP funcional chamado **Contrato360**, uma prova de conceito para uma seleção de Iniciação Científica cujo projeto envolve uma ferramenta digital para **gestão e fiscalização de contratos administrativos**, com uso de **Inteligência Artificial**.

O objetivo NÃO é construir um sistema completo. O objetivo é entregar rapidamente uma aplicação pequena, bonita, funcional e convincente para demonstração.

## Objetivo principal

A aplicação deve ajudar um servidor público responsável por fiscalização de contratos a responder rapidamente:

**“O que precisa da minha atenção hoje?”**

O diferencial principal do MVP deve ser o uso real de **Cloudflare Workers AI** para analisar o conteúdo de um contrato administrativo e responder perguntas sobre ele.

---

# Stack obrigatória

Use uma stack mínima:

- TypeScript
- Hono
- Hono JSX
- Vite
- Cloudflare Workers
- Cloudflare Workers AI
- Tailwind CSS, se sua integração não complicar o projeto

Evite adicionar frameworks ou dependências desnecessárias.

NÃO usar:

- Next.js
- React SPA
- React Router
- Prisma
- PostgreSQL
- Docker
- autenticação
- microserviços
- backend separado
- LangChain
- Vercel AI SDK

O projeto deve ser uma aplicação única executando em Cloudflare Workers.

---

# Estrutura desejada

Organize aproximadamente assim:

```text
src/
├── index.tsx
├── renderer.tsx
├── styles.css
│
├── components/
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── AlertCard.tsx
│   ├── Badge.tsx
│   └── LoadingState.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   └── ContractDetail.tsx
│
├── data/
│   └── contracts.ts
│
└── ai/
    ├── analyze-contract.ts
    ├── ask-contract.ts
    └── prompts.ts
```

Não precisa seguir exatamente essa estrutura se houver uma organização melhor, mas mantenha o código simples.

---

# Visual

Quero uma interface de produto SaaS moderna, profissional e limpa.

Referências conceituais:

- dashboard administrativo
- software governamental moderno
- Linear
- Stripe Dashboard
- Vercel
- interfaces B2B clean

Evite aparência de trabalho acadêmico genérico.

Características:

- sidebar
- bastante espaçamento
- boa tipografia
- cards discretos
- poucas cores
- badges para status
- alertas críticos em destaque sem exagero
- responsivo para desktop e tablet
- ícones simples
- hierarquia visual muito clara

A informação mais importante do dashboard deve ser:

**“Requer sua atenção”**

---

# Rotas

Implementar inicialmente:

```text
/
```

Dashboard.

```text
/contratos/023-2026
```

Detalhes do contrato.

Endpoints:

```text
POST /api/contracts/:id/analyze
POST /api/contracts/:id/ask
```

---

# Dados

Não usar banco inicialmente.

Crie dados mockados em TypeScript.

Criar pelo menos 4 contratos para deixar o dashboard realista.

O principal será:

## Contrato 023/2026

Objeto:

**Prestação de serviços de manutenção preventiva e corretiva em instalações prediais.**

Contratada:

**Tech Serviços Ltda.**

Valor:

**R$ 480.000,00**

Vigência:

**01/01/2026 a 31/12/2026**

Status:

**Ativo**

Use também contratos fictícios adicionais para preencher o dashboard.

---

# Dashboard

O dashboard deve ter:

## Cabeçalho

Título:

**Visão geral**

Subtítulo:

**Acompanhe contratos, prazos e pendências que precisam da sua atenção.**

---

## Cards

Exibir:

**12**
Contratos ativos

**4**
Pendências abertas

**2**
Alertas críticos

**3**
Prazos próximos

---

# Requer sua atenção

Essa deve ser a área visualmente mais importante.

Criar pelo menos dois alertas.

## Alerta 1

Contrato:

**023/2026**

Objeto:

**Manutenção preventiva e corretiva**

Mensagem:

**Garantia contratual requer verificação nos próximos dias.**

Severidade:

**Crítico**

Botão:

**Ver contrato**

Clicar deve ir para:

```text
/contratos/023-2026
```

## Alerta 2

Contrato:

**041/2026**

Mensagem:

**Certidão da contratada vence em 5 dias.**

Severidade:

**Atenção**

---

# Próximos prazos

Exibir uma lista:

```text
25 AGO
Entrega de relatório mensal
Contrato 023/2026

30 AGO
Medição mensal
Contrato 032/2026

05 SET
Verificação de garantia
Contrato 023/2026
```

---

# Página de contrato

Rota:

```text
/contratos/023-2026
```

Cabeçalho:

**Contrato 023/2026**

Objeto:

**Manutenção preventiva e corretiva em instalações prediais**

Status:

**Ativo**

Mostrar:

- contratada
- valor
- início da vigência
- fim da vigência
- dias restantes

---

# Seção “Próxima ação”

Destacar:

**Verificar validade da garantia contratual**

Descrição:

**A garantia deve permanecer válida durante a vigência do contrato.**

Prioridade:

**Alta**

---

# Obrigações

Mostrar inicialmente algumas informações conhecidas:

### Relatório mensal

Entrega até o 5º dia útil do mês subsequente.

Status:

**Em dia**

### Manutenção preventiva

Realização mensal.

Status:

**Em dia**

### Garantia contratual

Deve permanecer válida durante toda a vigência.

Status:

**Requer atenção**

---

# Contrato utilizado pela IA

Crie um texto de contrato fictício no código.

Algo semelhante a:

```text
CONTRATO ADMINISTRATIVO Nº 023/2026

CLÁUSULA PRIMEIRA - DO OBJETO

O presente contrato tem por objeto a prestação de serviços
de manutenção preventiva e corretiva em instalações prediais.

CLÁUSULA SEGUNDA - DA VIGÊNCIA

2.1 O prazo de vigência será de 01 de janeiro de 2026
a 31 de dezembro de 2026.

CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATADA

6.1 A contratada deverá realizar manutenção preventiva
mensalmente.

6.2 A contratada deverá manter equipe técnica disponível
para atendimento das solicitações da fiscalização.

6.3 A contratada deverá comunicar qualquer ocorrência que
possa prejudicar a execução dos serviços.

CLÁUSULA OITAVA - DOS RELATÓRIOS

8.3 O relatório mensal de serviços deverá ser apresentado
até o quinto dia útil do mês subsequente.

CLÁUSULA DÉCIMA - DO REAJUSTE

10.1 Os preços poderão ser reajustados após o período
mínimo de doze meses, conforme índice previsto no contrato.

CLÁUSULA DÉCIMA PRIMEIRA - DA GARANTIA

11.2 A garantia contratual deverá permanecer válida durante
todo o período de vigência do contrato.

CLÁUSULA DÉCIMA SEGUNDA - DAS OCORRÊNCIAS

12.1 As ocorrências relacionadas à execução do contrato
deverão ser registradas e comunicadas à fiscalização.
```

Esse texto é apenas uma prova de conceito.

---

# Workers AI

Configurar Cloudflare Workers AI através de binding:

```json
{
  "ai": {
    "binding": "AI"
  }
}
```

Criar tipagem apropriada para:

```ts
type Bindings = {
  AI: Ai
}
```

Usar Workers AI diretamente.

Evitar qualquer SDK intermediário.

---

# Funcionalidade principal — “Analisar contrato com IA”

Na página do contrato, adicionar um botão bem destacado:

**✨ Analisar contrato com IA**

Ao clicar:

```text
POST /api/contracts/023-2026/analyze
```

Esse endpoint deve enviar o texto do contrato para o Workers AI.

A análise DEVE ser real.

Não retornar uma resposta mockada nesse endpoint.

---

# Prompt da análise

Usar um system prompt semelhante a:

```text
Você é um assistente de apoio à fiscalização de contratos administrativos.

Sua função é analisar exclusivamente o contrato fornecido.

Identifique:

- resumo do objeto;
- principais obrigações da contratada;
- prazos importantes;
- vigência;
- garantias;
- regras de reajuste;
- entregas previstas;
- pontos que precisam de acompanhamento;
- possíveis ações para o fiscal.

Regras:

1. Não invente informações que não estejam presentes no documento.
2. Sempre indique a cláusula que fundamenta a informação, quando disponível.
3. Diferencie claramente fatos encontrados no contrato de recomendações.
4. Não tome decisões administrativas em nome do servidor.
5. Caso uma informação não exista no contrato, informe que ela não foi localizada.
6. Responda em português brasileiro.
7. Seja objetivo.
```

---

# Resposta estruturada

Quero que o resultado seja preferencialmente retornado como JSON estruturado.

Formato aproximado:

```json
{
  "summary": "Resumo do contrato",
  "obligations": [
    {
      "title": "Entregar relatório mensal",
      "description": "Descrição",
      "clause": "8.3",
      "deadline": "5º dia útil do mês subsequente"
    }
  ],
  "deadlines": [
    {
      "title": "Entrega do relatório mensal",
      "deadline": "5º dia útil",
      "clause": "8.3"
    }
  ],
  "risks": [
    {
      "level": "attention",
      "title": "Garantia contratual",
      "description": "A garantia precisa permanecer válida.",
      "clause": "11.2"
    }
  ],
  "recommendedActions": [
    {
      "priority": "high",
      "title": "Verificar validade da garantia",
      "reason": "Obrigação prevista na cláusula 11.2"
    }
  ]
}
```

Use JSON Mode ou structured output se estiver disponível de forma simples no modelo escolhido.

Se isso complicar demais a implementação, solicite JSON explicitamente no prompt, faça parse e trate erros.

---

# Interface após análise

Antes da análise:

```text
✨ Análise inteligente

Use Inteligência Artificial para identificar automaticamente
obrigações, prazos e pontos de atenção presentes neste contrato.

[ ✨ Analisar contrato com IA ]
```

Durante:

```text
✨ Analisando contrato...

Identificando:
• obrigações
• prazos
• garantias
• pontos de atenção
```

Mostrar algum loading state agradável.

Depois:

```text
✨ Análise inteligente

5
Obrigações

3
Prazos

1
Ponto de atenção
```

Abaixo, mostrar os dados identificados pela IA em cards.

Sempre mostrar a cláusula de origem quando houver.

Exemplo:

```text
GARANTIA CONTRATUAL

A garantia deverá permanecer válida durante toda
a vigência.

Cláusula 11.2
```

---

# Funcionalidade 2 — Perguntar sobre o contrato

Adicionar abaixo da análise:

**Pergunte sobre este contrato**

Campo:

```text
Pergunte algo sobre as obrigações, prazos ou cláusulas...
```

Sugestões rápidas:

```text
Quais são as principais obrigações?
```

```text
Quando o contrato pode ser reajustado?
```

```text
Quais pontos precisam de atenção?
```

```text
Resuma as obrigações da contratada.
```

---

# Endpoint de perguntas

```text
POST /api/contracts/:id/ask
```

Body:

```json
{
  "question": "Quando ocorre o reajuste?"
}
```

O Workers AI deve receber:

- system prompt
- texto integral do contrato
- pergunta

---

# Prompt para perguntas

```text
Você é um assistente de apoio à fiscalização de contratos administrativos.

Responda exclusivamente com base no contrato fornecido.

Regras:

- não invente informações;
- cite a cláusula utilizada;
- seja objetivo;
- responda em português brasileiro;
- se a resposta não puder ser encontrada no contrato, diga explicitamente que a informação não foi localizada;
- não tome decisões administrativas pelo fiscal.
```

---

# Exemplo esperado

Pergunta:

```text
Quando o contrato pode ser reajustado?
```

Resposta desejada:

```text
O contrato prevê que os preços poderão ser reajustados
após o período mínimo de 12 meses.

Fonte: Cláusula 10.1.
```

---

# Tratamento de erros

A aplicação não pode quebrar se Workers AI falhar.

Adicionar:

- try/catch
- timeout razoável
- estado de erro amigável
- botão “Tentar novamente”

Mensagem:

```text
Não foi possível concluir a análise agora.
Tente novamente em alguns instantes.
```

Não mostrar stack traces no frontend.

---

# Segurança básica

Não colocar tokens ou secrets diretamente no código.

Usar apenas bindings/configuração da Cloudflare.

Sanitizar qualquer conteúdo renderizado.

Não usar dangerouslySetInnerHTML sem necessidade.

---

# Sem upload de PDF nesta versão

IMPORTANTE:

NÃO implementar upload, parsing ou OCR de PDF agora.

O contrato já deve existir como texto no código.

O objetivo desta primeira versão é demonstrar:

```text
Contrato
   ↓
Workers AI
   ↓
Informação estruturada
   ↓
Apoio à fiscalização
```

---

# UX

A demo deve funcionar em aproximadamente 1 minuto:

1. abrir dashboard;
2. visualizar alertas;
3. clicar no Contrato 023/2026;
4. clicar em “Analisar contrato com IA”;
5. visualizar obrigações, prazos e pontos de atenção encontrados;
6. fazer uma pergunta;
7. receber resposta baseada no contrato e citando a cláusula.

Esse é o fluxo principal.

Priorize esse fluxo antes de qualquer outra funcionalidade.

---

# O que NÃO implementar agora

Não perder tempo com:

- login
- cadastro de usuário
- permissões
- CRUD completo
- upload de arquivos
- OCR
- PDF parser
- geração de relatórios
- aplicativo mobile
- notificações reais
- email
- banco de dados
- D1
- R2
- filas
- cron jobs

Essas funcionalidades poderão ser evoluções futuras.

---

# Qualidade

Quero código:

- simples
- legível
- tipado
- fácil de modificar
- sem abstrações prematuras
- sem overengineering

Se houver escolha entre arquitetura sofisticada e implementação simples, escolha a simples.

---

# README

Criar um README curto explicando:

## Contrato360

Prova de conceito para apoio à fiscalização de contratos administrativos.

### Tecnologias

- Hono
- TypeScript
- Cloudflare Workers
- Cloudflare Workers AI

### Executar localmente

Adicionar os comandos corretos.

### Deploy

Adicionar os comandos corretos para Cloudflare Workers.

### Objetivo da IA

Explicar em 2 ou 3 frases que a IA é utilizada para:

- extrair obrigações;
- identificar prazos;
- identificar pontos de atenção;
- responder perguntas fundamentadas no contrato.

---

# Critérios de conclusão

Considere a tarefa concluída quando:

- o projeto executar localmente;
- o dashboard estiver visualmente bem acabado;
- `/contratos/023-2026` funcionar;
- o botão “Analisar contrato com IA” chamar Workers AI de verdade;
- a análise for exibida na interface;
- perguntas sobre o contrato funcionarem com Workers AI;
- as respostas indicarem cláusulas quando possível;
- loading e erros estiverem tratados;
- o projeto puder ser publicado no Cloudflare Workers;
- não houver TypeScript/build errors.

Antes de finalizar, execute:

```bash
npm run build
```

e os checks existentes no projeto.

Corrija erros encontrados.

Não implemente funcionalidades fora do escopo até que o fluxo principal esteja funcionando perfeitamente.
# Contrato360

**Prova de conceito para gestão e fiscalização de contratos administrativos com Cloudflare Workers AI.**

O Contrato360 ajuda o fiscal a responder uma pergunta operacional simples: **o que precisa da minha atenção
hoje?** O MVP organiza alertas, prazos, obrigações e próximas ações e usa Inteligência Artificial para tornar o
conteúdo contratual mais fácil de localizar e acompanhar.

## Demonstração

Protótipo: https://contrato360.lucas.soares.nom.br/

O fluxo principal foi pensado para uma demonstração curta:

```text
Visão geral
   ↓
Contrato que requer atenção
   ↓
Próxima ação e obrigações
   ↓
Análise estruturada com Workers AI
   ↓
Consulta fundamentada nas cláusulas
```

## Inteligência Artificial

A IA é utilizada para:

- extrair obrigações;
- localizar prazos;
- identificar garantias e condições de reajuste;
- destacar pontos de acompanhamento;
- responder perguntas fundamentadas nas cláusulas do contrato.

O protótipo usa um contrato fictício. A IA atua como apoio à fiscalização, não como substituta da decisão do
fiscal, e as informações geradas devem ser validadas antes de subsidiar decisões administrativas.

## Arquitetura

```text
Browser
   ↓
Cloudflare Worker
   ↓
Hono
   ├── Dashboard
   ├── Contrato
   └── APIs
          ↓
     Workers AI
```

Tecnologias: TypeScript, Hono, Hono JSX, Vite, Tailwind CSS, Cloudflare Workers e Cloudflare Workers AI. A aplicação
é um único Worker; os dados e o texto fictício do contrato permanecem locais em TypeScript, e a IA é acessada
diretamente pelo binding `AI`.

## Executar localmente

Requer Node.js 22.23.2 ou versão compatível mais recente e npm 10+.

```bash
nvm use
npm install
npm run hooks:install
npm run dev
```

Para validar o projeto:

```bash
npm run check
npm run build
```

Consulte [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) para detalhes do ambiente e
[`.specs/STATE.md`](.specs/STATE.md) para o estado atual do produto.

## Autor

**Lucas Soares**

- GitHub: https://github.com/lucassoaresol/unifor_contrato360
- LinkedIn: https://www.linkedin.com/in/lucassoaresolv

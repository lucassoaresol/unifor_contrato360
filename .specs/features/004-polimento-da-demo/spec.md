# Feature 004 — Polimento final da demo

## Objetivo

Transformar o MVP funcional em uma prova de conceito pronta para apresentação. Em um percurso de aproximadamente
um minuto, uma pessoa sem contexto deve entender o problema, abrir o Contrato 023/2026, localizar urgência e
obrigações, executar a análise inteligente, consultar a regra de reajuste e reconhecer autoria e fontes públicas.

## Dentro do escopo

- refinar hierarquia, densidade, textos, foco, hover e responsividade das páginas reais;
- manter “Requer sua atenção” como foco do dashboard e a ordem operacional do detalhe;
- unificar estados visuais de loading e erro da análise e da consulta;
- apresentar uma única orientação discreta para validação humana das informações geradas por IA;
- remover navegação inerte e linguagem que sugira sincronização inexistente;
- adicionar autoria discreta, GitHub e LinkedIn com abertura externa segura;
- revisar metadata, página não encontrada e README público;
- preservar contratos HTTP, prompts, schemas, dados e independência entre análise e consulta.

## Fora do escopo

- novas páginas, CRUD, ocorrências, pendências, notificações, upload, PDF, autenticação ou persistência;
- novas capacidades ou integrações de IA, RAG, legislação ou análise prévia obrigatória;
- analytics, imagens pesadas, bibliotecas de animação, dark mode, deploy ou inferência remota;
- lista completa de contratos e otimização profunda exclusiva para celular.

## Requisitos

- **REQ-001 — Primeira impressão:** marca, descrição e dashboard devem comunicar rapidamente a gestão inteligente
  de contratos e priorizar “Requer sua atenção”, sem alegar atualização em tempo real.
- **REQ-002 — Percurso:** o detalhe deve manter a ordem contrato, urgência, obrigações, análise e consulta, com os
  controles principais fáceis de localizar no percurso de demonstração.
- **REQ-003 — IA confiável:** resultados devem ser compactos, fundamentados e distinguir fatos, pontos de atenção
  e sugestões; loading e erro devem ser consistentes e apenas uma orientação de validação humana deve aparecer.
- **REQ-004 — Consulta:** a consulta deve permanecer secundária à análise, sem aparência de chatbot, com as
  perguntas de reajuste e obrigações facilmente disponíveis e fontes claras.
- **REQ-005 — Navegação e autoria:** somente destinos reais podem parecer acionáveis; autoria, GitHub e LinkedIn
  devem ser discretos e os links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- **REQ-006 — Qualidade pública:** metadata, 404, contraste, labels, foco e responsividade entre 1024 e 1440 px
  devem sustentar uma apresentação sem partes aparentando estar inacabadas.
- **REQ-007 — Documentação:** README deve descrever problema, proposta, fluxo, arquitetura, uso responsável da IA,
  demonstração e autoria de acordo com o produto entregue.

## Critérios de aceitação

- **AC-001:** Dado `/`, então o documento usa o título “Contrato360 — Gestão inteligente de contratos”, a
  descrição pública canônica e mostra a sequência Visão geral, indicadores, Requer sua atenção e Próximos prazos.
- **AC-002:** Dada a sidebar, então aparecem apenas Visão geral e Contratos como navegação, a descrição “Gestão
  inteligente de contratos”, autoria de Lucas Soares e links oficiais externos seguros para GitHub e LinkedIn.
- **AC-003:** Dado o dashboard, então “Requer sua atenção” continua sendo a seção dominante e não existe texto de
  atualização ou demonstração que represente uma capacidade inexistente.
- **AC-004:** Dado o Contrato 023/2026, então identidade, próxima ação, obrigações, análise e consulta aparecem
  nessa ordem e os contratos de API das Features 002 e 003 permanecem inalterados.
- **AC-005:** Dados os estados inicial, loading, sucesso e erro da análise e da consulta, então possuem linguagem,
  controles e tratamento visual coerentes; ambos os erros oferecem “Tentar novamente”.
- **AC-006:** Dado um resultado extenso, então métricas, cláusulas, pontos de atenção e sugestões permanecem
  compactos e legíveis, com sugestões explicitamente identificadas como apoio.
- **AC-007:** Dada a consulta, então “Quando o contrato pode ser reajustado?” e “Quais são as principais obrigações
  da contratada?” estão visíveis, a resposta encontrada mostra cláusulas e a ausência não inventa fontes.
- **AC-008:** Dado qualquer recurso de IA no detalhe, então uma única mensagem informa que o fiscal deve validar o
  conteúdo antes de subsidiar decisões administrativas.
- **AC-009:** Dado contrato ou rota inexistente, então a página amigável explica a ausência e oferece retorno para
  a visão geral sem mensagem técnica.
- **AC-010:** Dadas larguras de 1024 e 1440 px, tablet e celular de resiliência, então conteúdo e ações permanecem
  legíveis, sem overflow estrutural; controles e links possuem foco visível.
- **AC-011:** Dado o repositório público, então o README apresenta demonstração, arquitetura, tecnologias, papel da
  IA, contrato fictício e autoria com os três endereços oficiais.
- **AC-012:** `npm run check`, `npm run build` e `git diff --check` terminam sem erros, sem nova inferência real ou
  deploy exigidos porque a lógica de IA não foi alterada.

## Estados, riscos e decisões

- A mensagem única de transparência fica entre análise e consulta e cobre os dois recursos.
- A consulta recebe o título “Consulta ao contrato” para reforçar que não é chatbot.
- A pergunta de reajuste é a primeira sugestão para reduzir procura durante a demo.
- O favicon será um SVG local pequeno, sem biblioteca ou branding complexo.
- Não haverá nova chamada real ao Workers AI: testes simulados e regressão dos contratos existentes são suficientes.
- Polimento visual que comprometa estabilidade, legibilidade ou os gates será descartado.

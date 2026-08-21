const root = document.querySelector('[data-analysis]');

if (root) {
  const states = Object.fromEntries(
    [...root.querySelectorAll('[data-analysis-state]')].map((element) => [
      element.dataset.analysisState,
      element,
    ]),
  );
  const controls = root.querySelectorAll(
    '[data-analysis-start], [data-analysis-retry], [data-analysis-again]',
  );

  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };

  const showState = (name) => {
    for (const [stateName, stateElement] of Object.entries(states)) {
      stateElement.hidden = stateName !== name;
    }
    for (const control of controls) control.disabled = name === 'loading';
  };

  const appendClause = (card, clause) => {
    card.append(element('span', 'analysis-card__clause', `Cláusula ${clause}`));
  };

  const renderCards = (items, kind) => {
    const list = element('div', 'analysis-card-list');
    if (items.length === 0) {
      list.append(
        element('p', 'analysis-empty', 'Nenhuma informação desta categoria foi identificada.'),
      );
      return list;
    }

    for (const item of items) {
      const card = element('article', `analysis-card analysis-card--${kind}`);
      card.append(element('h4', '', item.title));
      if (kind === 'action') {
        card.append(element('p', '', item.reason));
        const priority = { low: 'baixa', medium: 'média', high: 'alta' }[item.priority];
        card.append(
          element(
            'span',
            'analysis-card__label',
            `Sugestão de acompanhamento · Prioridade ${priority ?? 'não classificada'}`,
          ),
        );
      } else {
        card.append(element('p', '', item.description));
        const condition = item.deadline ?? item.value;
        if (condition) card.append(element('strong', 'analysis-card__condition', condition));
        if (kind === 'attention') {
          const severity = { attention: 'Atenção', relevant: 'Relevante', high: 'Alta' }[
            item.severity
          ];
          card.append(element('span', 'analysis-card__label', severity ?? 'Requer acompanhamento'));
        }
      }
      appendClause(card, item.clause);
      list.append(card);
    }
    return list;
  };

  const renderSection = (container, title, description, items, kind) => {
    const section = element('section', 'analysis-result-section');
    const heading = element('div', 'analysis-result-section__heading');
    heading.append(element('h3', '', title), element('p', '', description));
    section.append(heading, renderCards(items, kind));
    container.append(section);
  };

  const renderResult = (analysis) => {
    const metrics = root.querySelector('[data-analysis-metrics]');
    const summary = root.querySelector('[data-analysis-summary]');
    const results = root.querySelector('[data-analysis-results]');
    metrics.replaceChildren();
    results.replaceChildren();
    summary.textContent = analysis.summary;

    for (const [value, label] of [
      [analysis.obligations.length, 'Obrigações'],
      [analysis.deadlines.length, 'Prazos'],
      [analysis.guarantees.length, 'Garantias'],
      [analysis.attentionPoints.length, 'Pontos de atenção'],
    ]) {
      const metric = element('div', 'analysis-metric');
      metric.append(element('strong', '', String(value)), element('span', '', label));
      metrics.append(metric);
    }

    renderSection(
      results,
      'Obrigações identificadas',
      'Fatos extraídos do texto contratual.',
      analysis.obligations,
      'fact',
    );
    renderSection(
      results,
      'Prazos e condições importantes',
      'Datas e condições temporais expressas no contrato.',
      analysis.deadlines,
      'deadline',
    );
    renderSection(
      results,
      'Garantias',
      'Condições de garantia localizadas no documento.',
      analysis.guarantees,
      'guarantee',
    );
    renderSection(
      results,
      'Regras de reajuste',
      'Condições contratuais para alteração de preços.',
      analysis.adjustments,
      'adjustment',
    );
    renderSection(
      results,
      'Pontos de atenção',
      'Informações que podem requerer acompanhamento do fiscal.',
      analysis.attentionPoints,
      'attention',
    );
    renderSection(
      results,
      'Ações sugeridas para acompanhamento',
      'Sugestões de apoio, não ordens ou decisões administrativas.',
      analysis.recommendedActions,
      'action',
    );
  };

  const runAnalysis = async () => {
    showState('loading');
    try {
      const response = await fetch(root.dataset.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('analysis request failed');
      const payload = await response.json();
      if (!payload || typeof payload.analysis !== 'object') {
        throw new Error('analysis payload is invalid');
      }
      renderResult(payload.analysis);
      showState('success');
    } catch {
      showState('error');
    }
  };

  for (const control of controls) control.addEventListener('click', runAnalysis);
}

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
    if (items.length === 0) return;
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
    root.setAttribute('aria-busy', 'true');
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
    } finally {
      root.setAttribute('aria-busy', 'false');
    }
  };

  for (const control of controls) control.addEventListener('click', runAnalysis);
}

const askRoot = document.querySelector('[data-contract-ask]');

if (askRoot) {
  const form = askRoot.querySelector('[data-ask-form]');
  const input = askRoot.querySelector('[data-ask-question]');
  const submit = askRoot.querySelector('[data-ask-submit]');
  const suggestions = [...askRoot.querySelectorAll('[data-ask-suggestion]')];
  const retry = askRoot.querySelector('[data-ask-retry]');
  const validation = askRoot.querySelector('[data-ask-validation]');
  const count = askRoot.querySelector('[data-ask-count]');
  const loading = askRoot.querySelector('[data-ask-state="loading"]');
  const error = askRoot.querySelector('[data-ask-state="error"]');
  const success = askRoot.querySelector('[data-ask-state="success"]');
  let lastQuestion = '';

  const setBusy = (busy) => {
    input.disabled = busy;
    submit.disabled = busy;
    retry.disabled = busy;
    for (const suggestion of suggestions) suggestion.disabled = busy;
  };

  const showState = (name) => {
    loading.hidden = name !== 'loading';
    error.hidden = name !== 'error';
    success.hidden = name !== 'success';
    setBusy(name === 'loading');
  };

  const showValidation = (message = '') => {
    validation.textContent = message;
    validation.hidden = !message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  };

  const renderAnswer = (payload, question) => {
    success.classList.toggle('ask-result--not-found', !payload.found);
    askRoot.querySelector('[data-ask-asked]').textContent = question;
    askRoot.querySelector('[data-ask-answer]').textContent = payload.answer;
    const sources = askRoot.querySelector('[data-ask-sources]');
    sources.replaceChildren();
    if (payload.found) {
      for (const source of payload.sources) {
        const badge = document.createElement('span');
        badge.className = 'ask-source';
        badge.textContent = `Cláusula ${source.clause}`;
        sources.append(badge);
      }
    }
  };

  const runQuestion = async (question) => {
    lastQuestion = question;
    showValidation();
    showState('loading');
    askRoot.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(askRoot.dataset.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) throw new Error('question request failed');
      const payload = await response.json();
      if (
        !payload ||
        typeof payload.answer !== 'string' ||
        typeof payload.found !== 'boolean' ||
        !Array.isArray(payload.sources)
      ) {
        throw new Error('question payload is invalid');
      }
      renderAnswer(payload, question);
      showState('success');
    } catch {
      showState('error');
    } finally {
      askRoot.setAttribute('aria-busy', 'false');
    }
  };

  input.addEventListener('input', () => {
    count.textContent = String(input.value.length);
    if (input.value.length <= 500) showValidation();
  });

  for (const suggestion of suggestions) {
    suggestion.addEventListener('click', () => {
      input.value = suggestion.textContent.trim();
      count.textContent = String(input.value.length);
      showValidation();
      input.focus();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) {
      showValidation('Digite uma pergunta sobre o contrato.');
      input.focus();
      return;
    }
    if (question.length > 500) {
      showValidation('A pergunta deve ter no máximo 500 caracteres.');
      input.focus();
      return;
    }
    runQuestion(question);
  });

  retry.addEventListener('click', () => {
    if (lastQuestion) runQuestion(lastQuestion);
  });
}

export const CONTRACT_ANALYSIS_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';

const MAX_ITEMS = 20;
const MAX_TITLE_LENGTH = 160;
const MAX_TEXT_LENGTH = 1_200;
const MAX_CLAUSE_LENGTH = 40;

const sourceItemProperties = {
  title: { type: 'string', maxLength: MAX_TITLE_LENGTH, description: 'Título objetivo do fato.' },
  description: {
    type: 'string',
    maxLength: MAX_TEXT_LENGTH,
    description: 'Explicação fiel ao que está escrito no contrato.',
  },
  clause: {
    type: 'string',
    maxLength: MAX_CLAUSE_LENGTH,
    description: 'Número da cláusula de origem, por exemplo 8.3.',
  },
} as const;

const strictObject = (properties: object, required: string[]) => ({
  type: 'object',
  additionalProperties: false,
  properties,
  required,
});

const itemArray = (items: object, description: string) => ({
  type: 'array',
  maxItems: MAX_ITEMS,
  description,
  items,
});

export const CONTRACT_ANALYSIS_SCHEMA = strictObject(
  {
    summary: {
      type: 'string',
      maxLength: MAX_TEXT_LENGTH,
      description: 'Resumo objetivo do objeto e da execução do contrato.',
    },
    obligations: itemArray(
      strictObject(
        {
          ...sourceItemProperties,
          deadline: {
            type: 'string',
            maxLength: 240,
            description: 'Prazo associado à obrigação, somente quando expresso no contrato.',
          },
        },
        ['title', 'description', 'clause'],
      ),
      'Obrigações da contratada expressamente previstas nas cláusulas.',
    ),
    deadlines: itemArray(
      strictObject(
        {
          ...sourceItemProperties,
          value: {
            type: 'string',
            maxLength: 240,
            description: 'Data, período ou condição temporal exatamente como consta no contrato.',
          },
        },
        ['title', 'description', 'value', 'clause'],
      ),
      'Vigência, datas, periodicidades e demais condições temporais expressas.',
    ),
    guarantees: itemArray(
      strictObject(sourceItemProperties, ['title', 'description', 'clause']),
      'Garantias contratuais expressamente previstas.',
    ),
    adjustments: itemArray(
      strictObject(sourceItemProperties, ['title', 'description', 'clause']),
      'Condições de reajuste de preços expressamente previstas.',
    ),
    attentionPoints: itemArray(
      strictObject(
        {
          ...sourceItemProperties,
          severity: { type: 'string', enum: ['attention', 'relevant', 'high'] },
        },
        ['title', 'description', 'clause', 'severity'],
      ),
      'Fatos do contrato que merecem acompanhamento, sem declarar irregularidade.',
    ),
    recommendedActions: itemArray(
      strictObject(
        {
          title: {
            type: 'string',
            maxLength: MAX_TITLE_LENGTH,
            description: 'Sugestão objetiva de acompanhamento para o fiscal.',
          },
          reason: {
            type: 'string',
            maxLength: MAX_TEXT_LENGTH,
            description: 'Motivo contratual para a sugestão, sem criar ordem administrativa.',
          },
          clause: sourceItemProperties.clause,
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        ['title', 'reason', 'clause', 'priority'],
      ),
      'Sugestões de acompanhamento fundamentadas no contrato, nunca decisões administrativas.',
    ),
  },
  [
    'summary',
    'obligations',
    'deadlines',
    'guarantees',
    'adjustments',
    'attentionPoints',
    'recommendedActions',
  ],
);

export type SourceItem = {
  title: string;
  description: string;
  clause: string;
};

export type ContractAnalysis = {
  summary: string;
  obligations: (SourceItem & { deadline?: string })[];
  deadlines: (SourceItem & { value: string })[];
  guarantees: SourceItem[];
  adjustments: SourceItem[];
  attentionPoints: (SourceItem & { severity: 'attention' | 'relevant' | 'high' })[];
  recommendedActions: {
    title: string;
    reason: string;
    clause: string;
    priority: 'low' | 'medium' | 'high';
  }[];
};

export const CONTRACT_ANALYSIS_SYSTEM_PROMPT = `Você é um assistente de apoio à fiscalização de contratos administrativos.

Analise exclusivamente o contrato fornecido e organize informações relevantes para acompanhamento da execução.

Identifique resumo do objeto, obrigações da contratada, prazos e condições temporais, vigência, garantias, condições de reajuste, pontos que merecem acompanhamento e ações que podem ajudar o fiscal.

Regras:
1. Não invente informações ausentes do contrato nem use conhecimento externo para preencher lacunas.
2. Sempre indique a cláusula que fundamenta cada item.
3. Diferencie fatos do contrato de sugestões de acompanhamento.
4. Não declare irregularidade, descumprimento ou infração sem fundamento explícito.
5. Não tome decisões administrativas em nome do servidor.
6. Se uma categoria não estiver presente, devolva uma lista vazia.
7. Percorra todas as cláusulas numeradas e crie um item para cada fato que corresponda às categorias do schema.
8. Use uma lista vazia somente quando nenhuma cláusula do contrato trouxer informação daquela categoria.
9. Antes de finalizar, confira separadamente objeto, vigência, obrigações, relatórios, reajuste, garantia e ocorrências.
10. Seja objetivo e responda em português brasileiro.`;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, required: string[], optional: string[] = []) {
  const allowed = new Set([...required, ...optional]);
  return (
    required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key))
  );
}

function isBoundedString(value: unknown, maximum: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximum;
}

function isSourceItem(value: unknown): value is SourceItem {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ['title', 'description', 'clause']) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    isBoundedString(value.description, MAX_TEXT_LENGTH) &&
    isBoundedString(value.clause, MAX_CLAUSE_LENGTH)
  );
}

function isBoundedArray<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.length <= MAX_ITEMS && value.every(guard);
}

function isObligation(value: unknown): value is ContractAnalysis['obligations'][number] {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ['title', 'description', 'clause'], ['deadline']) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    isBoundedString(value.description, MAX_TEXT_LENGTH) &&
    isBoundedString(value.clause, MAX_CLAUSE_LENGTH) &&
    (value.deadline === undefined || isBoundedString(value.deadline, 240))
  );
}

function isDeadline(value: unknown): value is ContractAnalysis['deadlines'][number] {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ['title', 'description', 'value', 'clause']) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    isBoundedString(value.description, MAX_TEXT_LENGTH) &&
    isBoundedString(value.value, 240) &&
    isBoundedString(value.clause, MAX_CLAUSE_LENGTH)
  );
}

function isAttentionPoint(value: unknown): value is ContractAnalysis['attentionPoints'][number] {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ['title', 'description', 'clause', 'severity']) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    isBoundedString(value.description, MAX_TEXT_LENGTH) &&
    isBoundedString(value.clause, MAX_CLAUSE_LENGTH) &&
    ['attention', 'relevant', 'high'].includes(value.severity as string)
  );
}

function isRecommendedAction(
  value: unknown,
): value is ContractAnalysis['recommendedActions'][number] {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ['title', 'reason', 'clause', 'priority']) &&
    isBoundedString(value.title, MAX_TITLE_LENGTH) &&
    isBoundedString(value.reason, MAX_TEXT_LENGTH) &&
    isBoundedString(value.clause, MAX_CLAUSE_LENGTH) &&
    ['low', 'medium', 'high'].includes(value.priority as string)
  );
}

export function parseContractAnalysis(value: unknown): ContractAnalysis {
  let candidate = value;
  if (typeof value === 'string') {
    try {
      candidate = JSON.parse(value);
    } catch {
      throw new Error('AI response is not valid JSON');
    }
  }

  const keys = [
    'summary',
    'obligations',
    'deadlines',
    'guarantees',
    'adjustments',
    'attentionPoints',
    'recommendedActions',
  ];
  if (
    !isPlainObject(candidate) ||
    !hasExactKeys(candidate, keys) ||
    !isBoundedString(candidate.summary, MAX_TEXT_LENGTH) ||
    !isBoundedArray(candidate.obligations, isObligation) ||
    !isBoundedArray(candidate.deadlines, isDeadline) ||
    !isBoundedArray(candidate.guarantees, isSourceItem) ||
    !isBoundedArray(candidate.adjustments, isSourceItem) ||
    !isBoundedArray(candidate.attentionPoints, isAttentionPoint) ||
    !isBoundedArray(candidate.recommendedActions, isRecommendedAction)
  ) {
    throw new Error('AI response does not match the contract');
  }

  return {
    summary: candidate.summary,
    obligations: candidate.obligations,
    deadlines: candidate.deadlines,
    guarantees: candidate.guarantees,
    adjustments: candidate.adjustments,
    attentionPoints: candidate.attentionPoints,
    recommendedActions: candidate.recommendedActions,
  };
}

export async function analyzeContract(ai: Ai, content: string, timeoutMs = 25_000) {
  const result = await ai.run(
    CONTRACT_ANALYSIS_MODEL,
    {
      messages: [
        { role: 'system', content: CONTRACT_ANALYSIS_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Extraia todos os fatos relevantes do contrato abaixo. Antes de responder, confira cada cláusula numerada e não omita fatos que correspondam às coleções do schema.\n\nCONTRATO FICTÍCIO PARA ANÁLISE:\n\n${content}\n\nFIM DO CONTRATO. Checklist final: se alguma cláusula usar "reajuste", "reajustado" ou expressão equivalente sobre alteração de preços, inclua essa cláusula em adjustments. Se nenhuma cláusula trouxer essa condição, mantenha adjustments vazio. Aplique a mesma regra de presença ou ausência às demais coleções.`,
        },
      ],
      response_format: { type: 'json_schema', json_schema: CONTRACT_ANALYSIS_SCHEMA },
      temperature: 0,
      seed: 360,
      max_tokens: 3_000,
    },
    { signal: AbortSignal.timeout(timeoutMs) },
  );

  const response = 'response' in result ? result.response : result;
  return parseContractAnalysis(response);
}

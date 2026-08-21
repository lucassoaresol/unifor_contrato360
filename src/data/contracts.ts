export type ContractStatus = 'Ativo';
export type ObligationStatus = 'Em dia' | 'Requer atenção';

export type ContractObligation = {
  title: string;
  description: string;
  status: ObligationStatus;
};

export type Contract = {
  id: string;
  number: string;
  object: string;
  shortObject: string;
  contractor: string;
  valueInCents: number;
  startsAt: string;
  endsAt: string;
  status: ContractStatus;
  nextAction: {
    title: string;
    description: string;
    priority: 'Alta' | 'Média';
  };
  obligations: ContractObligation[];
};

export type AttentionItem = {
  contractId: string;
  message: string;
  severity: 'Crítico' | 'Atenção';
  featured?: boolean;
};

export type Deadline = {
  day: string;
  month: string;
  title: string;
  contractNumber: string;
};

export const contracts: Contract[] = [
  {
    id: '023-2026',
    number: '023/2026',
    object: 'Prestação de serviços de manutenção preventiva e corretiva em instalações prediais',
    shortObject: 'Manutenção preventiva e corretiva',
    contractor: 'Tech Serviços Ltda.',
    valueInCents: 48_000_000,
    startsAt: '2026-01-01',
    endsAt: '2026-12-31',
    status: 'Ativo',
    nextAction: {
      title: 'Verificar validade da garantia contratual',
      description: 'A garantia deve permanecer válida durante toda a vigência do contrato.',
      priority: 'Alta',
    },
    obligations: [
      {
        title: 'Relatório mensal',
        description: 'Entrega até o 5º dia útil do mês subsequente.',
        status: 'Em dia',
      },
      {
        title: 'Manutenção preventiva',
        description: 'Realização mensal.',
        status: 'Em dia',
      },
      {
        title: 'Garantia contratual',
        description: 'Deve permanecer válida durante toda a vigência.',
        status: 'Requer atenção',
      },
    ],
  },
  {
    id: '032-2026',
    number: '032/2026',
    object: 'Serviços continuados de limpeza e conservação predial',
    shortObject: 'Limpeza e conservação predial',
    contractor: 'Sereno Serviços Integrados Ltda.',
    valueInCents: 31_850_000,
    startsAt: '2026-03-01',
    endsAt: '2027-02-28',
    status: 'Ativo',
    nextAction: {
      title: 'Acompanhar a medição mensal',
      description: 'Conferir os serviços executados antes do próximo ateste.',
      priority: 'Média',
    },
    obligations: [],
  },
  {
    id: '041-2026',
    number: '041/2026',
    object: 'Suporte técnico e atendimento especializado de tecnologia da informação',
    shortObject: 'Suporte técnico de TI',
    contractor: 'Norte Tecnologia e Suporte Ltda.',
    valueInCents: 22_400_000,
    startsAt: '2026-04-15',
    endsAt: '2027-04-14',
    status: 'Ativo',
    nextAction: {
      title: 'Solicitar certidão atualizada',
      description: 'A certidão da contratada vence nos próximos dias.',
      priority: 'Alta',
    },
    obligations: [],
  },
  {
    id: '057-2026',
    number: '057/2026',
    object: 'Fornecimento parcelado de materiais de expediente e consumo',
    shortObject: 'Materiais de expediente',
    contractor: 'Papelaria Aldeota Comércio Ltda.',
    valueInCents: 9_675_000,
    startsAt: '2026-06-01',
    endsAt: '2027-05-31',
    status: 'Ativo',
    nextAction: {
      title: 'Conferir próxima entrega',
      description: 'Validar quantitativos e prazo do próximo fornecimento.',
      priority: 'Média',
    },
    obligations: [],
  },
];

export const attentionItems: AttentionItem[] = [
  {
    contractId: '023-2026',
    message: 'Garantia contratual requer verificação nos próximos dias.',
    severity: 'Crítico',
    featured: true,
  },
  {
    contractId: '041-2026',
    message: 'Certidão da contratada vence em 5 dias.',
    severity: 'Atenção',
  },
];

export const upcomingDeadlines: Deadline[] = [
  { day: '25', month: 'AGO', title: 'Entrega de relatório mensal', contractNumber: '023/2026' },
  { day: '30', month: 'AGO', title: 'Medição mensal', contractNumber: '032/2026' },
  { day: '05', month: 'SET', title: 'Verificação de garantia', contractNumber: '023/2026' },
];

export function findContract(id: string): Contract | undefined {
  return contracts.find((contract) => contract.id === id);
}

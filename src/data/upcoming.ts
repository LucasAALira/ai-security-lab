/** O que está planejado para o laboratório. São intenções, não promessas de data: nenhuma data, número de
 *  usuários ou porcentagem de andamento é inventado aqui. Só o item "early" já existe no site. */
export type UpcomingStatus = 'early' | 'planned' | 'idea'

export interface UpcomingItem {
  id: string
  status: UpcomingStatus
  title: string
  summary: string
  /** O que o conteúdo pretende cobrir. */
  topics: string[]
  /** Módulo do site que já existe (só para o acesso antecipado). */
  module?: number
  /** Nota curta de rodapé do cartão (fontes, marcas, ressalvas). */
  note?: string
  /** Como o conteúdo deve chegar ao site. */
  plan?: string
}

export const upcomingStatus: Record<UpcomingStatus, { label: string; description: string }> = {
  early: { label: 'Acesso antecipado', description: 'Já está no site. Abre com moedas ou concluindo os módulos recomendados.' },
  planned: { label: 'Em planejamento', description: 'Será criado no mesmo formato da trilha atual. Ainda sem data definida.' },
  idea: { label: 'Ideia em avaliação', description: 'Pode virar módulo, ou não. Entra aqui para você saber o que está em discussão.' },
}

export const upcoming: UpcomingItem[] = [
  {
    id: 'engenharia-reversa',
    status: 'early',
    module: 8,
    title: 'Engenharia reversa para defensores',
    summary: 'Como examinar aplicativos, binários e arquivos de modelo que você não escreveu, em laboratório isolado, para achar segredos, riscos e comportamentos ocultos e decidir o que corrigir.',
    topics: [
      'Quando é legítimo: autorização, licença e lei.',
      'Análise estática e dinâmica, e o laboratório isolado.',
      'Triagem por camadas: hash, textos embutidos, bibliotecas, código desmontado e comportamento.',
      'Aplicativos e modelos de IA: chaves embutidas, verificações no cliente, arquivos pickle e extração pela API.',
      'Defesas e relatório de análise com fatos, hipóteses e reteste.',
    ],
  },
  {
    id: 'securityx',
    status: 'planned',
    title: 'Preparação para a CompTIA SecurityX',
    summary:
      'A SecurityX (antes chamada CASP+) é uma certificação da CompTIA voltada a profissionais de segurança experientes. A ideia é montar uma trilha de estudo própria, em português, ligando cada domínio a decisões reais, inclusive em sistemas de IA.',
    topics: [
      'Governança, risco e conformidade (cerca de 20% do exame CAS-005).',
      'Arquitetura de segurança (cerca de 27%).',
      'Engenharia de segurança (cerca de 31%).',
      'Operações de segurança (cerca de 22%).',
    ],
    plan: 'Um módulo por domínio, com leituras curtas, questões de cenário, cartões de revisão e um chefe, como nos módulos atuais.',
    note: 'Pesos do exame CAS-005 conforme informações públicas consultadas em 16/10/2026; confira sempre o guia oficial da CompTIA, porque o exame pode ser atualizado. Conteúdo independente, sem vínculo com a CompTIA, que é titular das marcas CompTIA e SecurityX.',
  },
  {
    id: 'agentes-e-mcp',
    status: 'idea',
    title: 'Segurança de agentes e servidores MCP',
    summary: 'Permissões de ferramentas, aprovação humana, isolamento e auditoria em agentes de IA que chamam ferramentas e servidores externos.',
    topics: ['Menor privilégio para ferramentas.', 'Aprovação ligada aos dados da ação.', 'Isolamento e registro de cada chamada.'],
  },
  {
    id: 'incidentes-com-ia',
    status: 'idea',
    title: 'Resposta a incidentes envolvendo IA',
    summary: 'Como detectar, conter e investigar incidentes com modelos, prompts e dados: registros úteis, linha do tempo, comunicação e lições aprendidas.',
    topics: ['Sinais e telemetria.', 'Contenção sem perder evidência.', 'Comunicação com quem foi afetado.'],
  },
]

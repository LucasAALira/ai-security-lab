export interface NavItem {
  /** Nome temático, quando ele corresponde a uma função que existe. */
  label: string
  /** O que a página faz, em linguagem direta. Aparece junto do nome temático. */
  hint?: string
  /** Destino no roteador. Seções da página inicial usam `?secao=`. As rotas não mudaram. */
  to: string
  /** Só aparece no app Android (as configurações de dificuldade e o modo deus). */
  nativeOnly?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const home = (secao: string) => `/?secao=${secao}`

/* Os nomes temáticos ("Provações", "Mercador"...) vêm sempre com a descrição funcional ao lado,
   para ninguém precisar adivinhar o que há em cada lugar. */
export const navGroups: NavGroup[] = [
  {
    label: 'Santuário',
    items: [
      { label: 'Jornada', hint: 'Continuar os estudos', to: home('inicio') },
      { label: 'Arquivos', hint: 'Áreas, módulos e aulas', to: '/areas' },
      { label: 'Contratos', hint: 'Missões do dia', to: home('hoje') },
      { label: 'Provações', hint: 'Desafios de código', to: '/desafios' },
      { label: 'Relicário', hint: 'Conquistas', to: '/conquistas' },
      { label: 'Sala de troféus', hint: 'Relíquias expostas', to: '/sala-de-trofeus' },
      { label: 'Mercador', hint: 'Mercado negro', to: '/loja' },
      { label: 'Configurações', hint: 'Dificuldade e modo deus', to: '/configuracoes', nativeOnly: true },
    ],
  },
  {
    label: 'Prática',
    items: [
      { label: 'Campanhas', hint: 'Missões investigativas', to: '/campanhas' },
      { label: 'Casos reais', hint: 'Incidentes documentados', to: '/casos' },
      { label: 'Modo Arquiteto', hint: 'Revisões de arquitetura', to: '/arquiteto' },
      { label: 'Trilha de módulos', hint: 'Fogueiras e chefes', to: '/trilha' },
      { label: 'Revisão com vidas', hint: 'Questões já acertadas', to: '/revisao' },
      { label: 'Laboratório de prompt', to: home('laboratorio') },
      { label: 'Cenários por porte', to: home('cenarios') },
      { label: 'Ferramentas e pentest LLM', to: home('pentest') },
    ],
  },
  {
    label: 'Seu progresso',
    items: [
      { label: 'Trilhas de aprendizado', to: home('trilhas') },
      { label: 'Tarefas e XP', to: home('tarefas') },
      { label: 'Pré-requisitos', to: home('requisitos') },
    ],
  },
  {
    label: 'Biblioteca',
    items: [
      { label: 'Biblioteca de matérias', to: home('fontes') },
      { label: 'Explorar o conteúdo', hint: 'Busca', to: '/explorar' },
      { label: 'Cobertura de frameworks', to: '/cobertura' },
      { label: 'Referências', to: '/referencias' },
      { label: 'Em breve', to: '/em-breve' },
    ],
  },
]

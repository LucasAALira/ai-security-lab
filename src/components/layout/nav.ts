export interface NavItem {
  label: string
  /** Destino no roteador. Seções da página inicial usam `?secao=`. */
  to: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const home = (secao: string) => `/?secao=${secao}`

export const navGroups: NavGroup[] = [
  {
    label: 'SEU ESPAÇO DE ESTUDO',
    items: [
      { label: 'Visão geral', to: home('inicio') },
      { label: 'Trilhas de aprendizado', to: home('trilhas') },
      { label: 'Tarefas e XP', to: home('tarefas') },
      { label: 'Medalhas', to: home('medalhas') },
      { label: 'Pré-requisitos', to: home('requisitos') },
    ],
  },
  {
    label: 'JOGO',
    items: [
      { label: 'Missões do dia', to: home('hoje') },
      { label: 'Revisão com vidas', to: '/revisao' },
      { label: 'Loja de moedas', to: '/loja' },
    ],
  },
  {
    label: 'PRÁTICA',
    items: [
      { label: 'Laboratório de prompt', to: home('laboratorio') },
      { label: 'Cenários por porte', to: home('cenarios') },
      { label: 'Ferramentas e pentest LLM', to: home('pentest') },
    ],
  },
  {
    label: 'BIBLIOTECA',
    items: [
      { label: 'Biblioteca de matérias', to: home('fontes') },
      { label: 'Referências', to: '/referencias' },
    ],
  },
]

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
  /** O que o grupo é, em uma linha. Aparece abaixo do nome, como nos itens. */
  hint?: string
  /** Grupo sem submenu: a entrada é um link direto (a Jornada). */
  to?: string
  items: NavItem[]
}

const home = (secao: string) => `/?secao=${secao}`

/* Cinco entradas no menu, e o resto dentro delas. Quem chega vê cinco escolhas em vez de vinte e
   cinco; quem procura uma página abre o submenu e acha pelo nome. Os nomes temáticos ("Provações",
   "Mercador"...) vêm sempre com a descrição funcional ao lado, para ninguém precisar adivinhar. */
export const navGroups: NavGroup[] = [
  {
    label: 'Jornada',
    hint: 'Continuar os estudos',
    to: home('inicio'),
    items: [],
  },
  {
    label: 'Estudar',
    hint: 'Trilha, aulas e revisão',
    items: [
      { label: 'Trilha de módulos', hint: 'Fogueiras e chefes', to: '/trilha' },
      { label: 'Arquivos', hint: 'Áreas, módulos e aulas', to: '/areas' },
      { label: 'Revisão com vidas', hint: 'Questões já acertadas', to: '/revisao' },
      { label: 'Explorar o conteúdo', hint: 'Busca', to: '/explorar' },
    ],
  },
  {
    label: 'Praticar',
    hint: 'Desafios, campanhas e casos',
    items: [
      { label: 'Provações', hint: 'Desafios de código', to: '/desafios' },
      { label: 'Campanhas', hint: 'Missões investigativas', to: '/campanhas' },
      { label: 'Casos reais', hint: 'Incidentes documentados', to: '/casos' },
      { label: 'Escrutínio', hint: 'Treino de análise de código', to: '/analise' },
      { label: 'Modo Arquiteto', hint: 'Revisões de arquitetura', to: '/arquiteto' },
      { label: 'Laboratório de prompt', to: home('laboratorio') },
      { label: 'Cenários por porte', to: home('cenarios') },
      { label: 'Ferramentas e pentest LLM', to: home('pentest') },
    ],
  },
  {
    label: 'Progresso',
    hint: 'Conquistas, moedas e metas',
    items: [
      { label: 'Contratos', hint: 'Missões do dia', to: home('hoje') },
      { label: 'Relicário', hint: 'Conquistas', to: '/conquistas' },
      { label: 'Sala de troféus', hint: 'Relíquias expostas', to: '/sala-de-trofeus' },
      { label: 'Mercador', hint: 'Mercado negro', to: '/loja' },
      { label: 'Tarefas e XP', to: home('tarefas') },
      { label: 'Trilhas de aprendizado', to: home('trilhas') },
      { label: 'Pré-requisitos', to: home('requisitos') },
      { label: 'Configurações', hint: 'Dificuldade e modo deus', to: '/configuracoes', nativeOnly: true },
    ],
  },
  {
    label: 'Biblioteca',
    hint: 'Matérias e referências',
    items: [
      { label: 'Biblioteca de matérias', to: home('fontes') },
      { label: 'Cobertura de frameworks', to: '/cobertura' },
      { label: 'Referências', to: '/referencias' },
      { label: 'Em breve', to: '/em-breve' },
    ],
  },
]

/** O grupo que contém a página aberta, para o menu abrir sozinho nela. */
export function groupOf(pathname: string, search: string): string | undefined {
  const atual = pathname === '/' ? `/${search}` : pathname
  let achado: { label: string; tamanho: number } | undefined
  for (const grupo of navGroups) {
    for (const item of grupo.items) {
      const alvo = item.to
      const bate = alvo.startsWith('/?') ? atual === alvo : pathname === alvo || pathname.startsWith(`${alvo}/`)
      if (bate && (!achado || alvo.length > achado.tamanho)) achado = { label: grupo.label, tamanho: alvo.length }
    }
  }
  return achado?.label
}

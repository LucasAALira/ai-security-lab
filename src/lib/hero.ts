/** Arquétipos do santuário: caminhos visuais para quem estuda.
 *
 *  Os nomes são arquétipos genéricos de RPG. A arte, os lemas e as descrições são originais deste
 *  projeto. Os identificadores antigos são mantidos para preservar escolhas salvas.
 *
 *  A classe muda a arma, os acentos e a leitura visual do traje. O equipamento continua vindo do
 *  progresso (src/lib/knight.ts). Escolher uma classe não altera XP, preços ou moedas.
 */
import type { StudyState } from '@/lib/progress'

export type HeroId =
  | 'cavaleiro'
  | 'duelista'
  | 'barbaro'
  | 'batedor'
  | 'arcanista'
  | 'clerigo'
  | 'espadachim'
  | 'prisioneiro'
  | 'penitente'
  | 'sobrevivente'

export interface HeroSpec {
  id: HeroId
  nome: string
  lema: string
  /** Equipamento principal, em uma frase curta. */
  arma: string
  descricao: string
  /** Trilha do site com que a classe mais combina. */
  trilha: string
}

export const HEROES: readonly HeroSpec[] = [
  {
    id: 'cavaleiro',
    nome: 'Cavaleiro',
    lema: 'Nenhuma porta se defende sozinha.',
    arma: 'espada e escudo',
    descricao: 'Armadura de aço, manto de brasa e defesa firme para proteger quem está atrás.',
    trilha: 'Ataques e defesa',
  },
  {
    id: 'duelista',
    nome: 'Duelista',
    lema: 'Um movimento preciso vale mais que força.',
    arma: 'rapieira',
    descricao: 'Traje leve em aço azulado, faixa curta e lâmina estreita para ataques calculados.',
    trilha: 'Fundamentos',
  },
  {
    id: 'barbaro',
    nome: 'Bárbaro',
    lema: 'A força abre caminho; a cautela mantém você vivo.',
    arma: 'machado de guerra',
    descricao: 'Couro reforçado, peles sobre os ombros e um machado pesado de duas mãos.',
    trilha: 'Ataques e defesa',
  },
  {
    id: 'batedor',
    nome: 'Ladrão',
    lema: 'Observe a fechadura antes de tocar na porta.',
    arma: 'duas adagas',
    descricao: 'Capuz de tecido escuro, proteção leve e lâminas curtas para agir sem chamar atenção.',
    trilha: 'Fundamentos',
  },
  {
    id: 'arcanista',
    nome: 'Astrólogo',
    lema: 'Toda instrução vinda de fora merece ser examinada.',
    arma: 'cajado e foco',
    descricao: 'Manto azul de cinza, capuz profundo e um foco cristalino para estudar o desconhecido.',
    trilha: 'Fundamentos',
  },
  {
    id: 'clerigo',
    nome: 'Clérigo',
    lema: 'O que não está escrito não aconteceu.',
    arma: 'maça e códice',
    descricao: 'Túnica clara sob placas gastas, códice no cinto e maça de cerimônia.',
    trilha: 'Governança e Regulação',
  },
  {
    id: 'espadachim',
    nome: 'Espadachim',
    lema: 'Conheça o alcance da lâmina e o limite da sua defesa.',
    arma: 'espada curva',
    descricao: 'Peitoral articulado, faixa de tecido e espada curva de aço frio.',
    trilha: 'Ataques e defesa',
  },
  {
    id: 'prisioneiro',
    nome: 'Prisioneiro arcano',
    lema: 'Uma restrição visível ainda pode esconder outra.',
    arma: 'lâmina curta e correntes',
    descricao: 'Capuz gasto, braçadeiras marcadas e correntes soltas sobre a roupa de viagem.',
    trilha: 'Fundamentos',
  },
  {
    id: 'penitente',
    nome: 'Penitente',
    lema: 'Assuma cada decisão e registre o que ela custou.',
    arma: 'mangual',
    descricao: 'Manto escuro, capuz fechado e arma de corrente feita para manter distância.',
    trilha: 'Governança e Regulação',
  },
  {
    id: 'sobrevivente',
    nome: 'Sobrevivente',
    lema: 'Use o que resta, aprenda e siga em frente.',
    arma: 'lança improvisada',
    descricao: 'Túnica remendada, capuz de viagem e lança montada com peças recuperadas.',
    trilha: 'Ataques e defesa',
  },
]

export const HERO_IDS: readonly HeroId[] = HEROES.map((h) => h.id)

export const isHeroId = (v: unknown): v is HeroId => typeof v === 'string' && (HERO_IDS as readonly string[]).includes(v)

export const DEFAULT_HERO: HeroId = 'cavaleiro'

/** A classe em uso: a escolhida pela pessoa, ou a padrão para estados antigos. */
export function heroOf(state: StudyState): HeroSpec {
  const escolhida = state.prefs.hero
  return HEROES.find((h) => h.id === escolhida) ?? HEROES.find((h) => h.id === DEFAULT_HERO)!
}

/** Classes do santuário: o caminho que a pessoa escolhe seguir no estudo.
 *
 *  São arquétipos clássicos de RPG (cavaleiro, clérigo, arcanista, batedor), com nome, lema, arma
 *  e arte próprios deste projeto e ligados às trilhas do site. Nenhuma classe, nome, brasão ou
 *  arte de jogo foi copiado.
 *
 *  A classe muda o que o cavaleiro do santuário empunha e veste; o equipamento em si continua
 *  vindo do progresso (`src/lib/knight.ts`). Escolher uma classe não altera XP, preços, moedas
 *  nem qualquer regra: é a sua cara no santuário. */

import type { StudyState } from '@/lib/progress'

export type HeroId = 'cavaleiro' | 'clerigo' | 'arcanista' | 'batedor'

export interface HeroSpec {
  id: HeroId
  nome: string
  lema: string
  /** O que a classe carrega na mão principal, em uma palavra. */
  arma: string
  descricao: string
  /** Trilha do site com que a classe mais combina, usada na sugestão inicial. */
  trilha: string
}

export const HEROES: readonly HeroSpec[] = [
  {
    id: 'cavaleiro',
    nome: 'Cavaleiro',
    lema: 'Nenhuma porta se defende sozinha.',
    arma: 'espada e escudo',
    descricao: 'Defesa de aplicações: aguenta o primeiro golpe e protege quem está atrás. Espada na mão direita, escudo erguido na esquerda.',
    trilha: 'Ataques e defesa',
  },
  {
    id: 'clerigo',
    nome: 'Clérigo',
    lema: 'O que não está escrito não aconteceu.',
    arma: 'maça e códice',
    descricao: 'Governança e regulação: registra, audita e impõe a regra. Carrega a maça de cerimônia e o códice preso ao cinto.',
    trilha: 'Governança e Regulação',
  },
  {
    id: 'arcanista',
    nome: 'Arcanista',
    lema: 'Toda instrução vinda de fora é suspeita.',
    arma: 'cajado',
    descricao: 'Segurança de IA: lida com o que fala, alucina e obedece a quem não devia. Cajado com um foco de cristal no alto.',
    trilha: 'Fundamentos',
  },
  {
    id: 'batedor',
    nome: 'Batedor',
    lema: 'Ande o caminho do invasor antes dele.',
    arma: 'adagas',
    descricao: 'Ofensiva e reconhecimento: entra primeiro, sem fazer barulho, e volta com o mapa. Duas adagas e o capuz sempre erguido.',
    trilha: 'Fundamentos',
  },
]

export const HERO_IDS: readonly HeroId[] = HEROES.map((h) => h.id)

export const isHeroId = (v: unknown): v is HeroId => typeof v === 'string' && (HERO_IDS as readonly string[]).includes(v)

export const DEFAULT_HERO: HeroId = 'cavaleiro'

/** A classe em uso: a escolhida pela pessoa, ou a sugerida pelo que ela mais estudou. */
export function heroOf(state: StudyState): HeroSpec {
  const escolhida = state.prefs.hero
  return HEROES.find((h) => h.id === escolhida) ?? HEROES.find((h) => h.id === DEFAULT_HERO)!
}

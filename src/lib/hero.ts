/** Arquétipos do santuário: o caminho que a pessoa escolhe seguir no estudo.
 *
 *  São seis arquétipos clássicos de RPG, com nome, lema, equipamento, trilha e arte próprios deste
 *  projeto (`src/data/herois.ts`, ilustrações em `public/assets/herois`). Nenhuma classe, armadura,
 *  símbolo ou nome de obra alguma foi copiado.
 *
 *  Escolher um caminho é só aparência: muda a figura do santuário, a arma do desenho vetorial e o
 *  acento de cor, e nada mais — não altera XP, moedas, preços, conquistas nem regra de progresso.
 *  Os identificadores são os mesmos de antes, para não perder escolha já salva. */

import { HEROIS, HEROIS_ANTIGOS, heroiById, type HeroiSpec } from '@/data/herois'
import type { StudyState } from '@/lib/progress'

/** Os seis caminhos. O identificador é o que entra no progresso e no `data-hero` do desenho. */
export type HeroId = 'cavaleiro' | 'ladrao' | 'clerigo' | 'mago' | 'sabio' | 'anao'

export const HERO_IDS: readonly HeroId[] = HEROIS.map((h) => h.id as HeroId)

export const DEFAULT_HERO: HeroId = 'cavaleiro'

/** Aceita o que estiver salvo e devolve um caminho conhecido, ou `undefined`.
 *  Caminho de versão anterior cai no mais próximo (`HEROIS_ANTIGOS`): quem escolheu antes
 *  continua com um caminho, mesmo depois de a lista mudar. */
export function normalizeHero(v: unknown): HeroId | undefined {
  if (typeof v !== 'string') return undefined
  const id = (HERO_IDS as readonly string[]).includes(v) ? v : HEROIS_ANTIGOS[v]
  return id !== undefined && (HERO_IDS as readonly string[]).includes(id) ? (id as HeroId) : undefined
}

export const isHeroId = (v: unknown): v is HeroId => normalizeHero(v) !== undefined

/** O arquétipo em uso: o escolhido pela pessoa, ou o padrão enquanto ela não escolheu. */
export function heroOf(state: StudyState): HeroiSpec {
  const id = normalizeHero(state.prefs.hero) ?? DEFAULT_HERO
  return heroiById(id) ?? heroiById(DEFAULT_HERO)!
}

/** O traje em uso (0 a 2). Fora da faixa, vale o primeiro. */
export function trajeOf(state: StudyState): number {
  const n = state.prefs.heroTraje
  return typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < 3 ? n : 0
}

/** Ainda não escolheu nenhum caminho: é o que abre a tela de escolha na primeira visita. */
export const heroEscolhido = (state: StudyState): boolean => normalizeHero(state.prefs.hero) !== undefined

export { HEROIS, HEROIS_ANTIGOS, heroiById }
export type { HeroiSpec }

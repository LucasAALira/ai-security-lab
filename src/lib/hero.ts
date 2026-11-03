/** Classes do santuário: o caminho que a pessoa escolhe seguir no estudo.
 *
 *  São dez arquétipos clássicos de RPG, com nome, lema, equipamento e arte próprios deste projeto
 *  (`src/data/herois.ts`). Nenhuma classe, armadura, símbolo ou nome de obra alguma foi copiado.
 *
 *  A escolha é só aparência: muda a figura do santuário e nada mais — não altera XP, moedas,
 *  preços, conquistas nem qualquer regra de progresso. */

import { HEROIS, heroiById, type HeroiSpec } from '@/data/herois'
import type { StudyState } from '@/lib/progress'

export type HeroId = string

export const HERO_IDS: readonly string[] = HEROIS.map((h) => h.id)

/** As quatro classes da versão anterior viraram arquétipos com nome próprio: progresso salvo
 *  antes desta versão continua valendo e cai no equivalente mais próximo. */
export const HERO_ANTIGOS: Record<string, string> = {
  cavaleiro: 'cavaleiro-errante',
  clerigo: 'clerigo',
  arcanista: 'astrologo',
  batedor: 'ladrao',
}

export const DEFAULT_HERO: HeroId = 'cavaleiro-errante'

/** Aceita os ids atuais e os antigos, devolvendo sempre um id atual. */
export function normalizeHero(v: unknown): HeroId | undefined {
  if (typeof v !== 'string') return undefined
  if (HERO_IDS.includes(v)) return v
  return HERO_ANTIGOS[v]
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

/** Que arma o desenho vetorial da fogueira deve mostrar para este arquétipo. */
export type HeroFamilia = 'cavaleiro' | 'clerigo' | 'arcanista' | 'batedor'
const FAMILIA: Record<string, HeroFamilia> = {
  'cavaleiro-errante': 'cavaleiro',
  espadachim: 'cavaleiro',
  penitente: 'cavaleiro',
  barbaro: 'cavaleiro',
  clerigo: 'clerigo',
  sobrevivente: 'clerigo',
  astrologo: 'arcanista',
  prisioneiro: 'arcanista',
  duelista: 'batedor',
  ladrao: 'batedor',
}
export const familiaOf = (id: string): HeroFamilia => FAMILIA[id] ?? 'cavaleiro'

export { HEROIS, heroiById }
export type { HeroiSpec }

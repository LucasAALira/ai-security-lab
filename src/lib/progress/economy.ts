/** Dificuldade e "modo deus" da economia do jogo.
 *
 *  - Soulslike é o padrão: os valores de sempre (XP das conquistas, moedas e preços).
 *  - Difícil, Médio e Fácil multiplicam as recompensas (XP de cada conquista e moedas recebidas)
 *    por 10, 20 e 30. O multiplicador vale para tudo, inclusive o que já foi conquistado; voltar ao
 *    Soulslike restaura os valores originais. O XP das tarefas e as moedas já gastas não mudam.
 *  - O modo deus permite editar, à mão, o XP de cada nível de conquista, o multiplicador de moedas
 *    e o preço de cada item da loja. Só o app Android mostra esse editor (Configurações).
 *
 *  Fica no próprio estado (`economy`), ausente quando é o padrão: estados e backups antigos seguem
 *  iguais, e o backup leva junto a dificuldade escolhida. */
import { MODULE_UNLOCKS, SHIELD, THEMES } from './catalog'
import { TIER_XP } from './constants'
import { RELICS, ROOMS, SWAP_PRICE } from './relics'
import type { StudyState, Tier } from './types'

export const ECONOMY_MODES = [
  { id: 'soulslike', name: 'Soulslike', multiplier: 1, description: 'O padrão: recompensas originais, cada conquista pesa.' },
  { id: 'dificil', name: 'Difícil', multiplier: 10, description: 'Recompensas ×10 em XP de conquistas e moedas.' },
  { id: 'medio', name: 'Médio', multiplier: 20, description: 'Recompensas ×20 em XP de conquistas e moedas.' },
  { id: 'facil', name: 'Fácil', multiplier: 30, description: 'Recompensas ×30 em XP de conquistas e moedas.' },
] as const

export type EconomyMode = (typeof ECONOMY_MODES)[number]['id']
export const DEFAULT_ECONOMY_MODE: EconomyMode = 'soulslike'
export const TIERS: readonly Tier[] = ['bronze', 'prata', 'ouro', 'dragao']

/** Limites do editor (modo deus). */
export const ECONOMY_LIMITS = { tierXp: 100_000, coinMultiplier: 1000, price: 99_999 } as const

/** Ajustes manuais do modo deus. Campo ausente: vale o valor do modo. */
export interface EconomyOverrides {
  tierXp?: Partial<Record<Tier, number>>
  coinMultiplier?: number
  /** Preço por item da loja (ids de `shopItems`). */
  prices?: Record<string, number>
}

export interface EconomyState {
  mode: EconomyMode
  overrides?: EconomyOverrides
}

export interface ShopItem {
  id: string
  name: string
  group: 'Temas' | 'Relíquias' | 'Salas' | 'Consumíveis' | 'Módulos'
  base: number
}

/** Todos os itens com preço na loja, com o id usado nos ajustes de preço. */
export function shopItems(): ShopItem[] {
  return [
    { id: 'swap', name: 'Injetor de Cinzas (troca de missão)', group: 'Consumíveis', base: SWAP_PRICE },
    { id: 'shield', name: 'Escudo de Silício (proteção de sequência)', group: 'Consumíveis', base: SHIELD.price },
    ...Object.entries(MODULE_UNLOCKS).map(([m, price]) => ({ id: `module:${m}`, name: `Núcleo de LLM Exilado (módulo ${Number(m) + 1})`, group: 'Módulos' as const, base: price })),
    ...THEMES.filter((t) => t.price > 0).map((t) => ({ id: `theme:${t.id}`, name: `Tema ${t.name}`, group: 'Temas' as const, base: t.price })),
    ...RELICS.map((r) => ({ id: `relic:${r.id}`, name: r.name, group: 'Relíquias' as const, base: r.price })),
    ...ROOMS.filter((r) => r.price > 0).map((r) => ({ id: `room:${r.id}`, name: r.name, group: 'Salas' as const, base: r.price })),
  ]
}

const isMode = (v: unknown): v is EconomyMode => ECONOMY_MODES.some((m) => m.id === v)
const intIn = (v: unknown, min: number, max: number): number | undefined =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : undefined
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Saneia o que veio do armazenamento ou de um backup. `undefined` = padrão (Soulslike, sem ajustes). */
export function cleanEconomy(raw: unknown): EconomyState | undefined {
  if (!isObject(raw)) return undefined
  const mode = isMode(raw.mode) ? raw.mode : DEFAULT_ECONOMY_MODE
  const o = isObject(raw.overrides) ? raw.overrides : {}
  const overrides: EconomyOverrides = {}
  if (isObject(o.tierXp)) {
    const tierXp: Partial<Record<Tier, number>> = {}
    for (const t of TIERS) {
      const v = intIn(o.tierXp[t], 0, ECONOMY_LIMITS.tierXp)
      if (v !== undefined) tierXp[t] = v
    }
    if (Object.keys(tierXp).length) overrides.tierXp = tierXp
  }
  const cm = intIn(o.coinMultiplier, 0, ECONOMY_LIMITS.coinMultiplier)
  if (cm !== undefined) overrides.coinMultiplier = cm
  if (isObject(o.prices)) {
    const ids = new Set(shopItems().map((i) => i.id))
    const prices: Record<string, number> = {}
    for (const [id, v] of Object.entries(o.prices)) {
      const p = intIn(v, 0, ECONOMY_LIMITS.price)
      if (ids.has(id) && p !== undefined) prices[id] = p
    }
    if (Object.keys(prices).length) overrides.prices = prices
  }
  const hasOverrides = Object.keys(overrides).length > 0
  if (mode === DEFAULT_ECONOMY_MODE && !hasOverrides) return undefined
  return hasOverrides ? { mode, overrides } : { mode }
}

export interface Economy {
  mode: EconomyMode
  multiplier: number
  /** XP de cada nível de conquista. */
  tierXp: Record<Tier, number>
  /** Multiplicador das moedas recebidas (do XP e das missões, baús e revisões). */
  coinMultiplier: number
  /** O modo deus mudou algum valor? */
  custom: boolean
  /** Preço efetivo de um item da loja. */
  price: (id: string, base: number) => number
}

/** A economia efetiva de um estado (modo + ajustes do modo deus). */
export function economyOf(s: Pick<StudyState, 'economy'> | undefined): Economy {
  const e = s?.economy
  const mode = e && isMode(e.mode) ? e.mode : DEFAULT_ECONOMY_MODE
  const multiplier = ECONOMY_MODES.find((m) => m.id === mode)!.multiplier
  const o = e?.overrides ?? {}
  const tierXp = Object.fromEntries(TIERS.map((t) => [t, o.tierXp?.[t] ?? TIER_XP[t] * multiplier])) as Record<Tier, number>
  return {
    mode,
    multiplier,
    tierXp,
    coinMultiplier: o.coinMultiplier ?? multiplier,
    custom: Boolean(o.tierXp || o.coinMultiplier !== undefined || o.prices),
    price: (id, base) => o.prices?.[id] ?? base,
  }
}

/** Atalhos de preço usados pela loja e pelas ações. */
export const themePrice = (s: Pick<StudyState, 'economy'>, id: string, base: number) => economyOf(s).price(`theme:${id}`, base)
export const relicPrice = (s: Pick<StudyState, 'economy'>, id: string, base: number) => economyOf(s).price(`relic:${id}`, base)
export const roomPrice = (s: Pick<StudyState, 'economy'>, id: string, base: number) => economyOf(s).price(`room:${id}`, base)
export const shieldPrice = (s: Pick<StudyState, 'economy'>) => economyOf(s).price('shield', SHIELD.price)
export const swapPrice = (s: Pick<StudyState, 'economy'>) => economyOf(s).price('swap', SWAP_PRICE)
export const modulePrice = (s: Pick<StudyState, 'economy'>, module: number, base: number) => economyOf(s).price(`module:${module}`, base)

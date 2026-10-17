/** Catálogo fixo das mecânicas de jogo: moedas, loja, temas e missões diárias.
 *  Mecânicas inspiradas, por ideia (sem copiar código), em apps de estudo gamificados:
 *  vidas na revisão, missões diárias com baú, loja de moedas e escudo de sequência. */

/** Uma moeda a cada 5 XP ganhos. Gastar moedas nunca reduz XP, nível ou medalhas. */
export const XP_PER_COIN = 5

export const THEMES = [
  { id: 'library', name: 'Biblioteca dos Condenados', description: 'Carvão, marfim, bronze e luz de vela — o tema padrão.', price: 0 },
  { id: 'ashes', name: 'Fortaleza de Cinzas', description: 'Pedra escura, cobre e brasas vermelhas.', price: 60 },
  { id: 'eclipse', name: 'Catedral do Eclipse', description: 'Obsidiana, ouro envelhecido e marfim.', price: 80 },
  { id: 'abyss', name: 'Arquivo Abissal', description: 'Azul profundo, prata e luz fria.', price: 80 },
  { id: 'sanctuary', name: 'Santuário Arcano', description: 'Ametista, bronze e inscrições antigas.', price: 100 },
  { id: 'dragon', name: 'Dragão', description: 'Coral sobre grafite — o tema das versões anteriores, gratuito.', price: 0 },
  { id: 'cyber', name: 'Ciano', description: 'Ciano elétrico sobre azul-noite.', price: 40 },
  { id: 'arcane', name: 'Arcano', description: 'Violeta suave sobre roxo profundo.', price: 40 },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export const DEFAULT_THEME: ThemeId = 'library'
/** O tema padrão das versões anteriores. Quem nunca escolheu um tema (só tinha o padrão) passa para o novo padrão. */
export const LEGACY_DEFAULT_THEME: ThemeId = 'dragon'
/** Temas gratuitos não precisam de compra. */
export const isFreeTheme = (id: string): boolean => THEMES.some((t) => t.id === id && t.price === 0)
export const THEME_IDS: readonly string[] = THEMES.map((t) => t.id)
export const isThemeId = (v: unknown): v is ThemeId => typeof v === 'string' && THEME_IDS.includes(v)

export const SHIELD = { price: 20, max: 2 } as const

/** Preço, em moedas, do desbloqueio imediato de cada módulo de acesso antecipado (id do módulo -> preço).
 *  O módulo também se libera de graça ao acender a fogueira dos pré-requisitos; pagar só pula essa espera.
 *  Comprar gasta moedas e nunca reduz XP, nível nem medalhas. */
export const MODULE_UNLOCKS: Readonly<Record<number, number>> = { 8: 5000 }
export const isEarlyAccess = (module: number): boolean => Object.hasOwn(MODULE_UNLOCKS, module)
export const moduleUnlockPrice = (module: number): number | null => (isEarlyAccess(module) ? MODULE_UNLOCKS[module] : null)

export const REWARD_LIMITS = { max: 8, title: 60, price: 999 } as const

export const REVIEW = {
  /** Questões por sessão (menos, se houver menos questões já resolvidas). */
  size: 5,
  /** Questões já resolvidas mínimas para liberar a revisão. */
  minPool: 2,
  hearts: 3,
  /** Só as primeiras sessões do dia rendem moedas, para não incentivar repetição sem fim. */
  coinSessionsPerDay: 3,
  coinsPerSession: 2,
  perfectBonus: 1,
} as const

export type QuestCounter = 'reads' | 'answers' | 'practices' | 'cases' | 'reviews' | 'xp'

export interface QuestDef {
  id: string
  title: string
  counter: QuestCounter
  target: number
  coins: number
  /** Missões do mesmo grupo não aparecem juntas no mesmo dia. */
  group?: string
}

export const QUESTS: readonly QuestDef[] = [
  { id: 'read-2', title: 'Leia 2 seções de matéria', counter: 'reads', target: 2, coins: 5 },
  { id: 'answer-2', title: 'Acerte 2 questões', counter: 'answers', target: 2, coins: 5 },
  { id: 'practice-1', title: 'Conclua 1 atividade prática', counter: 'practices', target: 1, coins: 5 },
  { id: 'case-1', title: 'Resolva 1 cenário de correção', counter: 'cases', target: 1, coins: 5 },
  { id: 'review-1', title: 'Complete 1 sessão de revisão', counter: 'reviews', target: 1, coins: 5 },
  { id: 'xp-50', title: 'Ganhe 50 XP hoje', counter: 'xp', target: 50, coins: 5, group: 'xp' },
  { id: 'xp-100', title: 'Ganhe 100 XP hoje', counter: 'xp', target: 100, coins: 8, group: 'xp' },
]

export const QUEST_IDS: readonly string[] = QUESTS.map((q) => q.id)
export const QUESTS_PER_DAY = 3
/** Baú ao concluir todas as missões do dia. */
export const CHEST_COINS = 15

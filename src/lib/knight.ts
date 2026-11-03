/** O cavaleiro do santuário: quem abre o site pela primeira vez encontra um andarilho descalço,
 *  de faca na mão. Cada peça do equipamento é conquistada — umas pelo estudo (XP acumulado),
 *  outras pelo que foi comprado na loja com as moedas do estudo. Nada aqui altera preços, XP ou
 *  qualquer regra de progresso: é só uma leitura do estado para desenhar a figura.
 *
 *  A arte é original (SVG desenhado para este projeto). Nenhum personagem, peça ou arte de
 *  franquia foi copiado. */

import type { StudyState } from '@/lib/progress'
import { isFreeTheme } from '@/lib/progress'

/* Os marcos de XP são calibrados pelo total que o site oferece (cerca de 11.800 entre tarefas e
   medalhas): a armadura se completa com uns dois terços do caminho andado, não no último dia. */

export type GearId = 'faca' | 'botas' | 'grevas' | 'peitoral' | 'bracadeiras' | 'manto' | 'elmo' | 'escudo' | 'espada'

export interface GearSpec {
  id: GearId
  nome: string
  /** O que a peça representa na história do santuário. */
  lore: string
  /** XP que basta para ganhar a peça. Ausente: só sai por compra. */
  xp?: number
  /** Compra na loja que também concede a peça (sem gastar nada a mais). */
  compra?: { como: string; tem: (s: StudyState) => boolean }
}

const temaComprado = (s: StudyState) => s.shop.owned.some((t) => !isFreeTheme(t))

/** A ordem é a da vestimenta: dos pés à cabeça, e a arma por último. */
export const GEAR: readonly GearSpec[] = [
  { id: 'faca', nome: 'Faca de sílex', lore: 'Com o que dá para começar. Toda defesa séria começou assim.' },
  { id: 'botas', nome: 'Botas de couro', lore: 'O primeiro trecho de chão já foi andado.', xp: 250 },
  { id: 'grevas', nome: 'Grevas de aço', lore: 'Quem aguenta ficar de pé aguenta a revisão.', xp: 800 },
  {
    id: 'bracadeiras',
    nome: 'Braçadeiras',
    lore: 'A primeira relíquia no relicário vira proteção nos braços.',
    compra: { como: 'Compre uma relíquia na loja', tem: (s) => s.shop.relics.length > 0 },
  },
  { id: 'peitoral', nome: 'Peitoral', lore: 'O que protege o centro: o que você já não erra mais.', xp: 2000 },
  {
    id: 'escudo',
    nome: 'Escudo de silício',
    lore: 'Comprado na loja para cobrir um dia sem estudo; aqui ele fica no braço.',
    compra: { como: 'Compre um Escudo de Silício na loja', tem: (s) => s.lifetime.shields > 0 || s.shop.shields > 0 },
  },
  {
    id: 'manto',
    nome: 'Manto do santuário',
    lore: 'A cor do manto é a do tema que você escolheu pagar.',
    compra: { como: 'Compre um tema na loja', tem: temaComprado },
  },
  { id: 'elmo', nome: 'Elmo', lore: 'A última peça a vestir e a primeira a ser atingida.', xp: 4000 },
  { id: 'espada', nome: 'Espada longa', lore: 'A faca cumpriu seu papel. Daqui em diante, outra lâmina.', xp: 7000 },
]

export const GEAR_IDS: readonly GearId[] = GEAR.map((g) => g.id)

/** Cada título vale a partir de tantas peças. */
const TITULOS = [
  { desde: 0, titulo: 'Andarilho' },
  { desde: 2, titulo: 'Escudeiro' },
  { desde: 4, titulo: 'Sentinela' },
  { desde: 6, titulo: 'Cavaleiro' },
  { desde: 9, titulo: 'Cavaleiro Dracônico' },
] as const

export interface KnightGear {
  /** Peças já conquistadas, na ordem de `GEAR`. */
  pecas: GearId[]
  tem: (id: GearId) => boolean
  titulo: string
  /** Quantas peças de quantas. */
  total: number
  completo: number
  /** A próxima peça a conquistar e o que falta para ela, quando ainda há alguma. */
  proxima?: { peca: GearSpec; falta: string }
}

/** Lê o estado e diz o que o cavaleiro está vestindo. */
export function knightGear(state: StudyState, xp: number): KnightGear {
  const conquistada = (g: GearSpec) =>
    (g.xp === undefined && g.compra === undefined) || (g.xp !== undefined && xp >= g.xp) || (g.compra !== undefined && g.compra.tem(state))
  const pecas = GEAR.filter(conquistada).map((g) => g.id)
  const posse = new Set(pecas)
  // A espada longa aposenta a faca: as duas nunca aparecem juntas.
  if (posse.has('espada')) posse.delete('faca')
  const titulo = [...TITULOS].reverse().find((t) => pecas.length >= t.desde)!.titulo
  const pendente = GEAR.find((g) => !conquistada(g))
  return {
    pecas: [...posse],
    tem: (id) => posse.has(id),
    titulo,
    completo: pecas.length,
    total: GEAR.length,
    proxima: pendente
      ? { peca: pendente, falta: pendente.xp !== undefined ? `Faltam ${Math.max(0, pendente.xp - xp)} XP` : pendente.compra!.como }
      : undefined,
  }
}

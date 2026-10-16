import type { Tier } from '@/lib/progress'

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

export const tierNames: Record<Tier, string> = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', dragao: 'Dragão' }

/** 1070 -> "1.070" */
export const formatNumber = (n: number) => n.toLocaleString('pt-BR')

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const letters = 'ABCD'

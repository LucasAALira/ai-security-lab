import type { Tier } from '@/lib/progress'

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

export const tierNames: Record<Tier, string> = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', dragao: 'Dragão' }

/** 1070 -> "1.070" */
export const formatNumber = (n: number) => n.toLocaleString('pt-BR')

/** Minutos em horas e minutos: 0 -> "0 min", 45 -> "45 min", 200 -> "3 h 20 min". */
export function formatDuration(minutes: number): string {
  const total = Number.isFinite(minutes) ? Math.max(0, Math.round(minutes)) : 0
  const h = Math.floor(total / 60)
  const m = total % 60
  if (!h) return `${m} min`
  return m ? `${formatNumber(h)} h ${m} min` : `${formatNumber(h)} h`
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

export const letters = 'ABCDEFGHIJKLMNOP'

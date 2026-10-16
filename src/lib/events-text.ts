import type { ProgressEvent, RejectReason } from '@/lib/progress'
import { formatNumber, plural, tierNames } from '@/lib/format'

/** Frases curtas e em português para cada evento do progresso (aria-live e avisos). */
export function eventsToText(events: readonly ProgressEvent[]): string[] {
  const lines: string[] = []
  const medals = events.filter((e) => e.kind === 'medal')
  for (const e of events) {
    switch (e.kind) {
      case 'xp':
        lines.push(`+${formatNumber(e.amount)} XP`)
        break
      case 'module':
        lines.push('Módulo concluído!')
        break
      case 'track':
        lines.push(`Trilha ${e.name}: medalha ${tierNames[e.tier]}`)
        break
      case 'level':
        lines.push(`Novo nível: ${e.level.number} · ${e.level.name}`)
        break
      case 'streak':
        if (e.current > 1) lines.push(`Sequência de ${e.current} dias`)
        break
      case 'shield-used':
        lines.push(`${plural(e.count, 'Escudo usado', 'Escudos usados')}: a sequência foi preservada`)
        break
      case 'quest':
        lines.push(`Missão cumprida: ${e.title} (+${e.coins} moedas)`)
        break
      case 'chest':
        lines.push(`Baú do dia aberto: +${e.coins} moedas`)
        break
      case 'coins':
        lines.push(`+${e.amount} ${plural(e.amount, 'moeda', 'moedas')}`)
        break
      case 'purchase':
        lines.push(`Comprado: ${e.name}`)
        break
      case 'redeem':
        lines.push(`Recompensa resgatada: ${e.title}`)
        break
      case 'medal':
        break
    }
  }
  if (medals.length) {
    const shown = medals.slice(0, 3).map((e) => `${e.medal.name} (+${e.medal.xp} XP)`)
    const rest = medals.length - shown.length
    lines.push(`${plural(medals.length, 'Medalha conquistada', 'Medalhas conquistadas')}: ${shown.join(', ')}${rest > 0 ? ` e mais ${rest}` : ''}`)
  }
  return lines
}

export const rejectText: Record<RejectReason, string> = {
  invalid: 'Não foi possível concluir esta ação.',
  coins: 'Moedas insuficientes.',
  limit: 'Limite atingido.',
  owned: 'Você já tem este item.',
  locked: 'Compre este item antes de usá-lo.',
  missing: 'Item não encontrado.',
}

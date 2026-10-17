import { challengeById } from '@/data/challenges'
import { modules } from '@/data/modules'
import type { LearningEventKind, ProgressEvent, RejectReason } from '@/lib/progress'
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
        lines.push('Fogueira acesa: módulo concluído!')
        break
      case 'unlock':
        lines.push(modules[e.module] ? `Módulo liberado: ${modules[e.module].title}` : 'Novo módulo liberado na trilha')
        break
      case 'challenge':
        if (e.phase === 'done') lines.push(e.helpless ? 'Desafio concluído sem dicas' : 'Desafio concluído')
        else lines.push('Falha identificada')
        break
      case 'boss':
        lines.push(e.first ? (e.flawless ? 'Chefe derrotado sem erros!' : 'Chefe derrotado!') : 'Chefe vencido de novo (sem XP extra)')
        break
      case 'activity':
        if (e.first) lines.push('Atividade concluída')
        break
      case 'mission':
        lines.push(e.passed ? 'Missão concluída com todas as atividades' : 'Missão encerrada: revise as atividades sem crédito')
        break
      case 'lesson':
        lines.push('Aula lida')
        break
      case 'dossier':
        lines.push('Dossiê lido')
        break
      case 'hint':
      case 'challenge-miss':
      case 'boss-miss':
      case 'activity-miss':
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
        // O desbloqueio de módulo já tem a própria linha ("Módulo liberado").
        if (e.item !== 'module') lines.push(`Comprado: ${e.name}`)
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
  prereq: 'Conclua os pré-requisitos do módulo (acenda a fogueira de cada um) para liberar esta etapa.',
  fogueira: 'Acenda a fogueira do módulo, concluindo todas as tarefas, para enfrentar o chefe.',
  order: 'Faça a etapa anterior antes desta.',
  open: 'Este módulo já está liberado pelos pré-requisitos: não é preciso gastar moedas.',
  missionLocked: 'Conclua a missão anterior (ou as campanhas exigidas) para abrir esta.',
}

/** Linha do histórico de estudo ("Aula 2 do módulo 03 concluída"). `ref` é o identificador salvo no evento. */
export function describeLogEvent(kind: LearningEventKind, ref: string, medalNames: Record<string, string> = {}): string {
  const module = ref.match(/^m(\d+)/)
  const mod = module ? modules[Number(module[1])] : undefined
  const where = mod ? ` do módulo ${mod.number}` : ''
  const challenge = (id: string) => challengeById(id.split(':')[0])?.title ?? 'desafio de código'
  switch (kind) {
    case 'read':
      return `Etapa ${ref.match(/aula-(\d+)/)?.[1] ?? ''}${where} concluída`.replace('Etapa  ', 'Etapa ')
    case 'research':
      return `Pesquisa orientada${where} registrada`
    case 'practice':
      return `Atividade prática${where} registrada`
    case 'answer':
      return `Questão ${ref.match(/q(\d+)/)?.[1] ?? ''}${where} acertada`
    case 'miss':
      return `Questão ${ref.match(/q(\d+)/)?.[1] ?? ''}${where}: resposta errada, com explicação`
    case 'identify':
      return `Falha identificada: ${challenge(ref)}`
    case 'fix':
    case 'challenge':
      return `Desafio concluído: ${challenge(ref)}`
    case 'challenge-miss':
      return `Tentativa errada em ${challenge(ref)} (sem perda de progresso)`
    case 'hint':
      return `Dica usada em ${challenge(ref)}`
    case 'retry':
      return ref.includes('chefe') ? `Nova tentativa do chefe${where}` : `Nova tentativa: ${challenge(ref)}`
    case 'boss':
      return ref.endsWith('chefe') ? `Chefe${where} vencido` : `Cenário do chefe${where} resolvido`
    case 'boss-miss':
      return `Cenário do chefe${where} errado (pode tentar de novo)`
    case 'fogueira':
      return `Fogueira acesa${where}`
    case 'achievement':
      return `Conquista desbloqueada: ${medalNames[ref] ?? ref}`
    case 'card':
      return `Flashcard revisado${where}`
    case 'review':
      return 'Sessão de revisão concluída'
    case 'case':
      return `Cenário de correção ${ref.replace('cenario-', '')} resolvido`
    case 'lab':
      return 'Laboratório de prompt concluído'
    case 'unlock':
      return mod ? `Módulo ${mod.number} (${mod.title}) desbloqueado com moedas` : 'Módulo desbloqueado com moedas'
    case 'mission': {
      const [id, activity, step] = ref.split(':')
      if (!activity) return `Missão ${id} aberta`
      if (activity === 'nova') return `Nova tentativa da missão ${id}`
      if (step === 'dica') return `Dica usada em ${id}`
      if (step === 'solucao') return `Solução revelada em ${id} (sem crédito)`
      if (step === 'refazer') return `Decisão refeita em ${id}`
      return `Atividade concluída em ${id}`
    }
    case 'mission-miss':
      return `Resposta a revisar em ${ref.split(':')[0]} (sem perda de progresso)`
    case 'mission-done':
      return `Missão encerrada: ${ref}`
    case 'lesson':
      return `Aula lida: ${ref}`
    case 'dossier':
      return `Dossiê lido: ${ref}`
    case 'architect':
      return `Revisão de arquitetura: ${ref}`
  }
}

import { REVIEW } from './catalog'
import { shuffled } from './random'
import type { StudyState } from './types'

/** Uma questão já resolvida, identificada pelo módulo e pela posição dentro dele. */
export interface ReviewItem {
  module: number
  question: number
}

/** Só questões que a pessoa já acertou entram na revisão: é reforço, não prova nova. */
export function reviewPool(s: StudyState): ReviewItem[] {
  return Object.entries(s.modules).flatMap(([module, m]) =>
    m.solved.flatMap((done, question) => (done ? [{ module: Number(module), question }] : [])),
  )
}

export const canReview = (s: StudyState) => reviewPool(s).length >= REVIEW.minPool

/** Monta uma sessão: as questões em que mais houve erros vêm primeiro, o resto é sorteado. */
export function buildReview(s: StudyState, random: () => number = Math.random, size: number = REVIEW.size): ReviewItem[] {
  const misses = (item: ReviewItem) => s.modules[item.module].misses[item.question]
  const sorted = shuffled(reviewPool(s), random).sort((a, b) => misses(b) - misses(a))
  return shuffled(sorted.slice(0, size), random)
}

export type ReviewStatus = 'playing' | 'won' | 'lost'

export interface ReviewSession {
  /** Fila de questões; a primeira é a atual. Questão errada volta para o fim da fila. */
  queue: ReviewItem[]
  total: number
  hearts: number
  lost: number
  status: ReviewStatus
}

export function startReview(items: ReviewItem[], hearts: number = REVIEW.hearts): ReviewSession {
  return { queue: [...items], total: items.length, hearts, lost: 0, status: items.length ? 'playing' : 'won' }
}

export const currentItem = (r: ReviewSession): ReviewItem | undefined => (r.status === 'playing' ? r.queue[0] : undefined)

/** Resposta certa: a questão sai da fila; fila vazia termina a sessão. */
export function answerReview(r: ReviewSession, correct: boolean): ReviewSession {
  if (r.status !== 'playing') return r
  const [current, ...rest] = r.queue
  if (correct) return { ...r, queue: rest, status: rest.length ? 'playing' : 'won' }
  const hearts = r.hearts - 1
  return {
    ...r,
    queue: hearts > 0 ? [...rest, current] : r.queue,
    hearts,
    lost: r.lost + 1,
    status: hearts > 0 ? 'playing' : 'lost',
  }
}

export const answeredCount = (r: ReviewSession) => r.total - r.queue.length

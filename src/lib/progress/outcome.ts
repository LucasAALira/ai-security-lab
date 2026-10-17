import type { ProgressEvent, RejectReason } from './actions'
import type { LearningEventKind } from './types'

/** O que uma ação fez no rascunho do estado. `applyAction` acrescenta XP, conquistas e missões do dia. */
export interface Outcome {
  changed: boolean
  /** A ação conta como dia de estudo (sequência). */
  study?: boolean
  rejected?: RejectReason
  events?: ProgressEvent[]
  /** Entradas do histórico de aprendizagem: [tipo, referência]. */
  log?: [LearningEventKind, string][]
}

export const nothing: Outcome = { changed: false }
export const reject = (rejected: RejectReason): Outcome => ({ changed: false, rejected })

import {
  applyAction,
  emptyState,
  loadState,
  saveState,
  STORAGE_KEY,
  type Action,
  type ApplyResult,
  type ProgressContext,
  type StudyState,
} from '@/lib/progress'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export interface ProgressStore {
  getState(): StudyState
  /** false quando o navegador recusou gravar (modo privado, cota cheia ou bloqueio). */
  getStorageOk(): boolean
  subscribe(listener: () => void): () => void
  /** Chamado a cada ação, inclusive as recusadas, com o resultado e os eventos. */
  onResult(listener: (result: ApplyResult, action: Action) => void): () => void
  dispatch(action: Action): ApplyResult
  /** Relê o armazenamento (outra aba mudou o progresso). */
  reload(): void
  /** Reage a um evento `storage` do navegador. */
  handleStorageEvent(event: Pick<StorageEvent, 'key'>): void
}

/** Acesso seguro: em alguns navegadores só ler `localStorage` já lança erro. */
export function browserStorage(): StorageLike | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function createProgressStore(options: { storage: StorageLike | null; ctx: ProgressContext; now?: () => Date }): ProgressStore {
  const { storage, ctx, now = () => new Date() } = options
  let state = storage ? loadState(storage) : emptyState()
  let storageOk = storage !== null
  const listeners = new Set<() => void>()
  const resultListeners = new Set<(result: ApplyResult, action: Action) => void>()
  const emit = () => listeners.forEach((l) => l())
  const reload = () => {
    if (!storage) return
    state = loadState(storage)
    emit()
  }

  return {
    getState: () => state,
    getStorageOk: () => storageOk,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    onResult(listener) {
      resultListeners.add(listener)
      return () => resultListeners.delete(listener)
    },
    dispatch(action) {
      const result = applyAction(state, action, ctx, now())
      if (result.changed) {
        state = result.state
        if (storage) storageOk = saveState(storage, state)
        emit()
      }
      resultListeners.forEach((l) => l(result, action))
      return result
    },
    reload,
    handleStorageEvent(event) {
      if (event.key === STORAGE_KEY || event.key === null) reload()
    },
  }
}

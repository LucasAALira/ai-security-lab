import { dayKey } from './dates'
import { cleanState } from './state'
import type { StudyState } from './types'

/* Exportação e importação do progresso. O site é só local: o progresso mora no navegador e não é
   sincronizado entre dispositivos. O arquivo é o jeito de levar o progresso de um lugar a outro. */

export const BACKUP_APP = 'ai-security-lab'
export const BACKUP_FORMAT = 'progress'
/** Tamanho máximo aceito na importação (o progresso de verdade ocupa poucas dezenas de KB). */
export const BACKUP_MAX_BYTES = 2_000_000

export interface Backup {
  app: typeof BACKUP_APP
  format: typeof BACKUP_FORMAT
  version: number
  exportedAt: string
  /** Fuso do navegador em que os dias do progresso foram contados. */
  timezone: string
  state: StudyState
}

export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function exportProgress(state: StudyState, now: Date = new Date(), timezone: string = browserTimezone()): string {
  const backup: Backup = { app: BACKUP_APP, format: BACKUP_FORMAT, version: state.version, exportedAt: now.toISOString(), timezone, state }
  return JSON.stringify(backup, null, 2)
}

export function backupFileName(now: Date = new Date()): string {
  return `ai-security-lab-progresso-${dayKey(now)}.json`
}

export type ImportResult = { ok: true; state: StudyState; exportedAt: string | null } | { ok: false; error: string }

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Lê um backup. Aceita o arquivo exportado pelo site e também uma cópia crua do estado salvo.
 *  Tudo passa por `cleanState`, então só o que tem forma e limite válidos entra. */
export function parseBackup(text: string): ImportResult {
  if (text.length > BACKUP_MAX_BYTES) return { ok: false, error: 'O arquivo é grande demais para ser um backup de progresso.' }
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'O arquivo não é um JSON válido.' }
  }
  if (!isObject(raw)) return { ok: false, error: 'O arquivo não tem o formato de um backup de progresso.' }

  if ('app' in raw || 'format' in raw) {
    if (raw.app !== BACKUP_APP || raw.format !== BACKUP_FORMAT) return { ok: false, error: 'Este arquivo não é um backup do AI Security Lab.' }
    if (!isObject(raw.state)) return { ok: false, error: 'O backup não contém o progresso.' }
    const when = typeof raw.exportedAt === 'string' && !Number.isNaN(Date.parse(raw.exportedAt)) ? raw.exportedAt : null
    return { ok: true, state: cleanState(raw.state), exportedAt: when }
  }
  if (isObject(raw.modules)) return { ok: true, state: cleanState(raw), exportedAt: null }
  return { ok: false, error: 'O arquivo não tem o formato de um backup de progresso.' }
}

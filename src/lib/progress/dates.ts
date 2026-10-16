/** Datas como chaves AAAA-MM-DD no fuso local do navegador. A diferença entre dias usa UTC,
 *  então horário de verão e viradas de mês ou de ano não afetam a conta. */

const pad = (n: number) => String(n).padStart(2, '0')

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Aceita só datas reais (rejeita, por exemplo, 2026-13-45). */
export function isDayKey(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const m = DAY_RE.exec(value)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const check = new Date(Date.UTC(y, mo - 1, d))
  return check.getUTCFullYear() === y && check.getUTCMonth() === mo - 1 && check.getUTCDate() === d
}

export function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
}

/** Dias de `a` até `b` (positivo se `b` é depois de `a`). */
export function daysBetween(a: string, b: string): number {
  return dayNumber(b) - dayNumber(a)
}

export function addDays(key: string, n: number): string {
  const d = new Date((dayNumber(key) + n) * 86_400_000)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export function formatDay(key: string): string {
  const [y, m, d] = key.split('-')
  return `${d}/${m}/${y}`
}

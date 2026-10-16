import { MODULE_COUNT } from '@/lib/progress'

/** Seções da página inicial que as URLs antigas (`index.html#trilhas`) já usavam como âncora. */
export const LEGACY_SECTIONS = ['inicio', 'tarefas', 'medalhas', 'requisitos', 'trilhas', 'laboratorio', 'cenarios', 'pentest', 'fontes'] as const

/** Converte endereços da versão anterior no novo formato de rota (`#/...`).
 *  `index.html?modulo=2#trilhas` -> `#/modulo/2`; `index.html#cenarios` -> `#/?secao=cenarios`.
 *  Devolve `null` quando o endereço já é novo ou não tem equivalente. */
export function migrateLegacyUrl({ search, hash }: { search: string; hash: string }): string | null {
  const modulo = new URLSearchParams(search).get('modulo')
  if (modulo !== null && /^\d+$/.test(modulo) && Number(modulo) < MODULE_COUNT) return `#/modulo/${Number(modulo)}`
  const id = hash.replace(/^#/, '')
  if (id && !id.startsWith('/') && (LEGACY_SECTIONS as readonly string[]).includes(id)) return `#/?secao=${id}`
  return null
}

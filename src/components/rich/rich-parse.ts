/* Formato leve dos textos de estudo novos. Só quatro marcas, nenhuma delas gera HTML:
     **negrito**   `código`   {{termo-do-glossário}}   {{termo|rótulo}}
   Tudo o mais é texto puro (o React escapa). Isso substitui o uso de HTML nos conteúdos novos. */

export type RichToken =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'term'; id: string; label: string }
  /** Citação de fonte numerada (`[3]`), só reconhecida quando o chamador pede (`cites`). */
  | { kind: 'cite'; n: number }

const TOKEN = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\{\{[a-z0-9-]+(?:\|[^{}\n]+)?\}\})/g
const TOKEN_CITES = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\{\{[a-z0-9-]+(?:\|[^{}\n]+)?\}\}|\[\d{1,2}\])/g

export function parseRich(text: string, opts: { cites?: boolean } = {}): RichToken[] {
  const out: RichToken[] = []
  for (const part of text.split(opts.cites ? TOKEN_CITES : TOKEN)) {
    if (!part) continue
    if (opts.cites && /^\[\d{1,2}\]$/.test(part)) {
      out.push({ kind: 'cite', n: Number(part.slice(1, -1)) })
      continue
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) out.push({ kind: 'bold', text: part.slice(2, -2) })
    else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) out.push({ kind: 'code', text: part.slice(1, -1) })
    else if (part.startsWith('{{') && part.endsWith('}}')) {
      const [id, label] = part.slice(2, -2).split('|')
      out.push({ kind: 'term', id, label: label ?? id })
    } else out.push({ kind: 'text', text: part })
  }
  return out
}

/** Termos do glossário citados no texto, sem repetição. */
export const termsIn = (text: string): string[] => [...new Set(parseRich(text).flatMap((t) => (t.kind === 'term' ? [t.id] : [])))]

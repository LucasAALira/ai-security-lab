import { cn } from '@/lib/utils'
import type { CodeLanguage } from '@/data/types'

const languageNames: Record<CodeLanguage, string> = {
  ts: 'TypeScript',
  py: 'Python',
  yaml: 'YAML',
  json: 'JSON',
  http: 'HTTP',
  kt: 'Kotlin',
  swift: 'Swift',
  xml: 'XML',
  plist: 'plist',
  sql: 'SQL',
  diff: 'diff',
  dockerfile: 'Dockerfile',
  text: 'texto',
}

export const languageName = (language: CodeLanguage) => languageNames[language]

interface Props {
  lines: string[]
  language: CodeLanguage
  title: string
  className?: string
}

/** Listagem somente leitura, com número de linha. Em `diff`, adições e remoções recebem sinal visível
 *  e texto para leitores de tela (a cor nunca é o único indicador). */
export function CodeBlock({ lines, language, title, className }: Props) {
  return (
    <figure className={cn('m-0', className)}>
      <figcaption className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span>{title}</span>
        <span>{languageName(language)}</span>
      </figcaption>
      <div className="overflow-x-auto rounded-b-lg border border-border bg-[#120a0b]" tabIndex={0} role="region" aria-label={`${title} (${languageName(language)}), rolável`}>
        <ol className="m-0 min-w-max list-none p-0 py-1.5 font-mono text-[12.5px] leading-6">
          {lines.map((text, i) => {
            const diff = language === 'diff'
            const added = diff && text.startsWith('+') && !text.startsWith('+++')
            const removed = diff && text.startsWith('-') && !text.startsWith('---')
            return (
              <li key={i} className={cn('flex border-l-[3px] border-transparent', added && 'border-primary bg-primary/12', removed && 'border-destructive bg-destructive/12')}>
                <span aria-hidden="true" className="w-8 shrink-0 pr-3 text-right text-muted-foreground select-none">
                  {i + 1}
                </span>
                {added ? <span className="sr-only">Adicionada: </span> : removed ? <span className="sr-only">Removida: </span> : null}
                <code className="flex-1 pr-3 whitespace-pre text-foreground/90">{text || ' '}</code>
              </li>
            )
          })}
        </ol>
      </div>
    </figure>
  )
}

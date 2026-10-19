import { Lightbulb } from 'lucide-react'
import type { Analogy } from '@/data/analogies'
import { RichText } from '@/components/rich/RichText'
import { cn } from '@/lib/utils'

/** Analogia do módulo: a comparação e, logo abaixo, onde ela deixa de valer.
 *  As duas partes andam juntas de propósito — analogia sem limite ensina errado. */
export function AnalogyCard({ analogy, className }: { analogy: Analogy; className?: string }) {
  return (
    <aside className={cn('gx-panel border p-4', className)} aria-label="Analogia do módulo">
      <p className="gx-inscription">
        <Lightbulb className="size-3.5" aria-hidden="true" /> Em poucas palavras
      </p>
      <RichText text={analogy.text} className="mt-2.5 text-[14px] leading-relaxed text-foreground/90" />
      <p className="mt-2.5 flex gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
        <span aria-hidden="true" className="mt-[7px] h-px w-4 shrink-0 bg-[var(--line-strong)]" />
        <span>
          <strong className="font-semibold text-[var(--gold-anodized)]">Onde a comparação quebra:</strong> {analogy.limit}
        </span>
      </p>
    </aside>
  )
}

import { ArrowRight, Crosshair } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { describeObjective } from '@/lib/objective-text'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

/** O próximo objetivo real da trilha, sempre visível. `bar` é a faixa fina de todas as páginas;
 *  `card` é a versão maior das páginas de estudo. */
export function NextObjective({ variant = 'bar', className }: { variant?: 'bar' | 'card'; className?: string }) {
  const { derived } = useProgress()
  const view = describeObjective(derived.objective)
  const isCard = variant === 'card'
  return (
    <aside
      aria-label="Próximo objetivo"
      className={cn(
        'flex items-center gap-3 border-tint-line bg-tint-strong',
        isCard ? 'rounded-xl border p-4' : 'border-b px-1 py-2 text-[13px]',
        className,
      )}
    >
      <Crosshair className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <p className="min-w-0 flex-1 leading-snug">
        <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">Próximo objetivo</span>
        <span className={cn('block font-medium', isCard ? 'text-[15px]' : 'truncate')}>{view.title}</span>
        <span className={cn('text-xs text-muted-foreground', isCard ? 'block' : 'hidden truncate md:block')}>{view.detail}</span>
      </p>
      <Button asChild size="sm" className="shrink-0">
        <Link to={view.to}>
          {view.cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </aside>
  )
}

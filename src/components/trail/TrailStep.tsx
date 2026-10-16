import { Check, ChevronRight, Lock, Circle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { StepStatus } from '@/lib/progress'
import { cn } from '@/lib/utils'

const statusText: Record<StepStatus, string> = { done: 'Concluída', available: 'Disponível', locked: 'Bloqueada' }

interface Props {
  label: string
  /** Complemento curto (por exemplo, "2 de 3"). */
  detail?: string
  status: StepStatus
  optional?: boolean
  /** XP que ainda pode render (só a primeira vez). */
  xp?: number
  /** Destino ao clicar. Etapas bloqueadas não têm link. */
  to?: string
  /** Ação no lugar do link (abrir o diálogo do chefe). */
  onSelect?: () => void
  icon?: ReactNode
  /** Rótulo do convite à direita, quando já concluída (por exemplo, "Revisar"). */
  doneCta?: string
  cta?: string
}

/** Etapa da trilha: ícone de estado, nome, progresso e o que fazer em seguida. O estado aparece
 *  também em texto (Concluída, Disponível, Bloqueada), nunca só pela cor ou pelo ícone. */
export function TrailStep({ label, detail, status, optional, xp, to, onSelect, icon, doneCta = 'Revisar', cta = 'Continuar' }: Props) {
  const Mark = status === 'done' ? Check : status === 'locked' ? Lock : Circle
  const interactive = status !== 'locked' && (to || onSelect)
  const body = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-7 shrink-0 place-items-center rounded-full border',
          status === 'done' && 'border-primary bg-primary text-primary-foreground',
          status === 'available' && 'border-primary text-primary',
          status === 'locked' && 'border-dashed border-muted-foreground/60 text-muted-foreground',
        )}
      >
        {icon ?? <Mark className="size-3.5" strokeWidth={2.6} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-snug font-medium">
          {label}
          {optional ? <span className="ml-1.5 text-[10px] font-normal tracking-wide text-muted-foreground uppercase">opcional</span> : null}
        </span>
        <span className="block text-[11px] text-muted-foreground">
          {statusText[status]}
          {detail ? ` · ${detail}` : ''}
          {xp && status !== 'done' ? ` · +${xp} XP` : ''}
        </span>
      </span>
      {interactive ? (
        <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary">
          {status === 'done' ? doneCta : cta}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  )
  const base = 'flex items-center gap-3 rounded-lg px-2.5 py-2'
  return (
    <li>
      {interactive && to ? (
        <Link to={to} className={cn(base, 'hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none')}>
          {body}
        </Link>
      ) : interactive ? (
        <button type="button" onClick={onSelect} className={cn(base, 'w-full text-left hover:bg-tint-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none')}>
          {body}
        </button>
      ) : (
        <div className={cn(base, status === 'locked' && 'opacity-80')}>{body}</div>
      )}
    </li>
  )
}

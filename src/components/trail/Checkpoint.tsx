import { Flame, FlameKindling } from 'lucide-react'
import { Link } from 'react-router'
import { formatDay } from '@/lib/progress'
import { cn } from '@/lib/utils'

interface Props {
  lit: boolean
  /** Dia (AAAA-MM-DD) em que a fogueira foi acesa. */
  day: string
  /** Módulo, para o link de revisão da aula. */
  lessonTo: string
}

/** Fogueira: ponto de controle de um módulo. Acende quando todas as etapas obrigatórias terminam;
 *  acesa, vira o lugar de revisar a aula e liberar o chefe. Apagada, diz o que falta. */
export function Checkpoint({ lit, day, lessonTo }: Props) {
  const Icon = lit ? Flame : FlameKindling
  return (
    <li className={cn('rounded-lg border px-3 py-2.5', lit ? 'border-tint-line bg-tint-strong' : 'border-dashed border-border bg-card/50')}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className={cn('grid size-7 shrink-0 place-items-center rounded-full', lit ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}>
          <Icon className={cn('size-4', lit && 'motion-safe:animate-pulse')} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug font-medium">Fogueira {lit ? 'acesa' : 'apagada'}</p>
          <p className="text-[11px] text-muted-foreground">
            {lit ? `Ponto de descanso e revisão${day ? ` · acesa em ${formatDay(day)}` : ''}` : 'Conclua as etapas obrigatórias acima para acendê-la e liberar o chefe.'}
          </p>
        </div>
      </div>
      {lit ? (
        <div className="mt-2 ml-10 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link to={lessonTo} className="font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring">
            Revisar a aula
          </Link>
          <Link to="/revisao" className="font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring">
            Revisão com vidas
          </Link>
        </div>
      ) : null}
    </li>
  )
}

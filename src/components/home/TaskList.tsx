import { ArrowRight, Check, Circle } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { modules } from '@/data/modules'
import { remediationCases } from '@/data/scenarios'
import { isModuleComplete, moduleXp, XP } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

export type TaskFilter = 'pending' | 'all' | 'completed'

/** Uma linha por módulo, uma para o laboratório e uma por cenário de correção. */
export function TaskList({ filter, onOpenCase }: { filter: TaskFilter; onOpenCase: (index: number) => void }) {
  const { state } = useProgress()
  const show = (done: boolean) => !((filter === 'pending' && done) || (filter === 'completed' && !done))
  const rows: React.ReactNode[] = []

  modules.forEach((m, i) => {
    const s = state.modules[i]
    const done = isModuleComplete(s)
    if (!show(done)) return
    const entries: Array<[string, boolean, number]> = [
      ['Leitura 1', s.reads[0], XP.read],
      ['Leitura 2', s.reads[1], XP.read],
      ['Leitura 3', s.reads[2], XP.read],
      ['Pesquisa', s.research, XP.research],
      ['Atividade', s.practice, XP.practice],
      ['Questão 1', s.solved[0], XP.question],
      ['Questão 2', s.solved[1], XP.question],
    ]
    rows.push(
      <TaskRow key={m.slug} title={`${m.number}. ${m.title}`} meta={`${moduleXp(s)}/100 XP`}>
        <ul className="my-3.5 flex flex-wrap gap-2">
          {entries.map(([name, yes, xp]) => (
            <li key={name} className={cn('rounded border px-2 py-1 text-[11px]', yes ? 'border-tint-line bg-tint-strong text-primary' : 'border-border bg-card text-foreground/70')}>
              {yes ? <Check className="mr-0.5 inline size-3 align-[-1px]" aria-label="concluída:" /> : <Circle className="mr-0.5 inline size-3 align-[-1px]" aria-label="pendente:" />} {name} <small className="ml-0.5 text-[10px]">{xp} XP</small>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" size="sm">
          <Link to={`/modulo/${i}`} state={{ overlay: true }}>{done ? 'Revisar conteúdo' : 'Abrir tarefas'}</Link>
        </Button>
      </TaskRow>,
    )
  })

  if (show(state.lab)) {
    rows.push(
      <TaskRow key="lab" title={<StatusTitle done={state.lab}>Laboratório de injeção de prompt</StatusTitle>} meta={`${state.lab ? XP.lab : 0}/${XP.lab} XP`}>
        <p className="my-2 text-xs text-muted-foreground">Analise um cenário e confirme que revisou o resultado.</p>
        <Link to="/?secao=laboratorio" className="text-xs text-primary hover:underline">
          Ir ao laboratório <ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
        </Link>
      </TaskRow>,
    )
  }

  remediationCases.forEach((c, i) => {
    const done = state.cases[i]
    if (!show(done)) return
    rows.push(
      <TaskRow key={c.id} title={<StatusTitle done={done}>{c.title}</StatusTitle>} meta={`${done ? XP.fix : 0}/${XP.fix} XP`}>
        <p className="my-2 text-xs text-muted-foreground">Sandbox de correção · Empresa {c.size.toLowerCase()}</p>
        <Button variant="outline" size="sm" onClick={() => onOpenCase(i)}>
          {done ? 'Revisar solução' : 'Resolver cenário'}
        </Button>
      </TaskRow>,
    )
  })

  if (!rows.length) {
    return (
      <p role="status" className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        {filter === 'completed' ? 'Nenhuma tarefa concluída ainda. Comece por um módulo.' : 'Não há tarefas nesta seleção. Escolha “Todas” para revisar.'}
      </p>
    )
  }
  return <div>{rows}</div>
}

/** Título de tarefa com o estado em ícone e em texto para leitores de tela. */
function StatusTitle({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {done ? <Check className="size-4 text-primary" aria-hidden="true" /> : <Circle className="size-4 text-muted-foreground" aria-hidden="true" />}
      <span className="sr-only">{done ? 'Concluída: ' : 'Pendente: '}</span>
      {children}
    </span>
  )
}

function TaskRow({ title, meta, children }: { title: React.ReactNode; meta: string; children: React.ReactNode }) {
  return (
    <article className="mb-2.5 rounded-lg border border-border bg-tint px-5 py-4 max-sm:px-4 max-sm:py-3.5">
      <div className="flex justify-between gap-3 text-sm text-foreground/90 max-sm:text-xs">
        <strong>{title}</strong>
        <span className="font-mono whitespace-nowrap text-primary">{meta}</span>
      </div>
      {children}
    </article>
  )
}


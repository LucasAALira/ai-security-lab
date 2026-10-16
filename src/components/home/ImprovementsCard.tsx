import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { modules } from '@/data/modules'
import { plural } from '@/lib/format'
import type { Improvement } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

interface View {
  tag: string
  text: string
  label: string
  to: string
}

function view(x: Improvement): View {
  const title = 'module' in x ? modules[x.module]?.title : ''
  switch (x.kind) {
    case 'retry':
      return {
        tag: 'Revisar',
        text: `Refaça a questão ${x.question + 1} de “${title}”: ${x.misses} ${plural(x.misses, 'tentativa incorreta', 'tentativas incorretas')}. Releia a seção antes de responder.`,
        label: 'Abrir módulo',
        to: `/modulo/${x.module}`,
      }
    case 'finish': {
      const l = x.left
      const parts = [l.reads && `${l.reads} ${plural(l.reads, 'leitura', 'leituras')}`, l.research && 'pesquisa', l.practice && 'atividade', l.questions && `${l.questions} ${plural(l.questions, 'questão', 'questões')}`].filter(Boolean)
      return { tag: 'Concluir', text: `Falta pouco em “${title}”: ${parts.join(', ')}.`, label: 'Abrir módulo', to: `/modulo/${x.module}` }
    }
    case 'start':
      return { tag: 'Começar', text: `Próximo módulo com pré-requisitos em dia: “${title}”.`, label: 'Abrir módulo', to: `/modulo/${x.module}` }
    case 'lab':
      return { tag: 'Praticar', text: 'Analise o laboratório de injeção de prompt e registre a revisão.', label: 'Ir ao laboratório', to: '/?secao=laboratorio' }
    case 'cases':
      return { tag: 'Corrigir', text: `${x.left} ${plural(x.left, 'cenário de correção ainda sem solução', 'cenários de correção ainda sem solução')}.`, label: 'Ver cenários', to: '/?secao=cenarios' }
  }
}

/** Próximos passos sugeridos: questões erradas, módulos quase prontos e o que vem a seguir. */
export function ImprovementsCard() {
  const { derived } = useProgress()
  return (
    <section aria-labelledby="improve-title" className="rounded-lg border border-border bg-card p-5 max-sm:p-4">
      <h3 id="improve-title" className="mb-1.5 text-base font-semibold">
        Pontos de melhoria
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">Próximos passos sugeridos pelo seu progresso: questões que ainda não acertou, módulos quase concluídos e o que vem a seguir.</p>
      <ul className="grid gap-2">
        {derived.improvements.length ? (
          derived.improvements.map((x, i) => {
            const v = view(x)
            return (
              <li key={`${x.kind}-${i}`} className="grid items-center gap-3 rounded-md border border-border p-3 text-xs leading-relaxed sm:grid-cols-[auto_1fr_auto] max-sm:justify-items-start">
                <span className="rounded-sm bg-tint-strong px-2 py-0.5 text-[9px] font-bold tracking-[1px] text-primary uppercase">{v.tag}</span>
                <span>
                  {v.text} <span className="font-semibold whitespace-nowrap text-primary">+{x.xp} XP</span>
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link to={v.to} state={v.to.startsWith('/modulo/') ? { overlay: true } : undefined}>{v.label}</Link>
                </Button>
              </li>
            )
          })
        ) : (
          <li className="text-xs text-muted-foreground">Nenhum ponto de melhoria agora. Revise os módulos concluídos para manter o conteúdo em dia.</li>
        )}
      </ul>
    </section>
  )
}

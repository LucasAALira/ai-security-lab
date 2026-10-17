import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { modules } from '@/data/modules'
import { useProgress } from '@/state/ProgressProvider'

export function LibrarySection() {
  const { derived } = useProgress()
  return (
    <section id="fontes" aria-labelledby="fontes-titulo" className="mb-14">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">BIBLIOTECA INTERNA</div>
      <h2 id="fontes-titulo" className="my-3 text-[26px] leading-tight font-medium tracking-tight sm:text-3xl">
        As matérias, explicadas aqui.
      </h2>
      <p className="text-sm text-muted-foreground">Textos completos com conceitos, exemplos e atividades de revisão. Escolha uma matéria para estudar dentro do AI Security Lab.</p>
      <div className="mt-6 grid border-t border-border sm:grid-cols-2 min-[1151px]:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.slug} to={`/materias/${m.slug}`} className="border-b border-border px-2 py-5 text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-ring">
            {m.title} <ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
            <small className="mt-1 block text-xs text-muted-foreground">
              Módulo {m.number} · {m.earlyAccess && !derived.trail[m.id].unlocked ? 'acesso antecipado' : 'leitura completa'}
            </small>
          </Link>
        ))}
      </div>
    </section>
  )
}

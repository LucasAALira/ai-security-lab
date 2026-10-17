import { ArrowRight, CheckCircle2, FileText } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { architectProjects } from '@/data/architect'
import { areaById } from '@/data/curriculum'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

/** Lista dos projetos do modo Arquiteto de Segurança. */
export function ArchitectListPage() {
  useDocumentTitle('Modo Arquiteto')
  const { state } = useProgress()
  const approved = architectProjects.filter((p) => state.architect[p.id]?.evaluated).length

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="MODO ARQUITETO"
        level="h1"
        title="Arquiteto de Segurança"
        description="Receba um projeto, examine os componentes, marque as ameaças que se aplicam, escolha onde cada controle deve existir dentro do orçamento e registre a decisão em uma ADR. Os dados são sintéticos."
        aside={`${approved}/${architectProjects.length} revisões aprovadas`}
      />

      <div className="mt-5 grid gap-3 rounded-xl border border-tint-line bg-tint p-4 text-[13px] leading-relaxed md:grid-cols-3">
        <p>
          <strong>Corrigido por regras:</strong> ameaças que se aplicam (há distratores), controles obrigatórios, onde cada controle fica, ameaças críticas tratadas, custo e complexidade.
        </p>
        <p>
          <strong>Mais de uma solução:</strong> há escolhas que dependem do contexto, e duas soluções defensáveis comentadas em cada projeto. Adicionar controles sem necessidade não ajuda.
        </p>
        <p>
          <strong>ADR com autoavaliação:</strong> o texto não é corrigido por palavras-chave. Você compara com a rubrica e com a resposta comentada.
        </p>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {architectProjects.map((p) => {
          const a = state.architect[p.id]
          return (
            <li key={p.id} className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                {p.company} · {p.level}
              </p>
              <h2 className="mt-1.5 text-xl font-medium">
                <Link to={`/arquiteto/${p.id}`} className="hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed">{p.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Cerca de {p.minutes} min · {p.components.length} componentes · áreas: {p.areas.map((id) => areaById(id)?.title ?? id).join(', ')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className={a?.evaluated ? 'rounded border-primary text-primary' : 'rounded'}>
                  {a?.evaluated ? (
                    <>
                      <CheckCircle2 aria-hidden="true" /> Revisão aprovada
                    </>
                  ) : a?.started ? (
                    'Em andamento'
                  ) : (
                    'Não iniciada'
                  )}
                </Badge>
                <Badge variant="outline" className={a?.adrDone ? 'rounded border-primary text-primary' : 'rounded'}>
                  <FileText aria-hidden="true" /> {a?.adrDone ? 'ADR registrada' : 'ADR pendente'}
                </Badge>
              </div>
              <div className="mt-auto pt-4">
                <Button asChild size="sm">
                  <Link to={`/arquiteto/${p.id}`}>
                    {a?.started ? 'Continuar a revisão' : 'Começar a revisão'} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

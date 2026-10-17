import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { AreaCard } from '@/components/curriculum/AreaCard'
import { ResumeCard } from '@/components/curriculum/ResumeCard'
import { Button } from '@/components/ui/button'
import { areas } from '@/data/curriculum'

/** As sete áreas de estudo, com o progresso de cada uma, e o atalho para retomar de onde parou. */
export function AreasSection() {
  return (
    <section id="areas" aria-labelledby="areas-titulo" className="mb-14">
      <SectionHeading
        id="areas-titulo"
        eyebrow="ÁREAS DE ESTUDO"
        title="Escolha por onde começar"
        description="Cada área tem módulos e submódulos com aula e atividades. O progresso mostra só o que já existe para concluir."
      />
      <div className="mt-4 grid gap-4">
        <ResumeCard />
        <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-4 p-0 md:grid-cols-2 min-[1151px]:grid-cols-3">
          {areas.map((a) => (
            <AreaCard key={a.id} area={a} />
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/areas">
              Ver todas as áreas <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/explorar">Buscar no conteúdo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

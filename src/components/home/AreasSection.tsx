import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { AreaCard } from '@/components/curriculum/AreaCard'
import { Button } from '@/components/ui/button'
import { areas } from '@/data/curriculum'

/** Os Arquivos: as áreas de estudo, cada uma com brasão, nome e progresso. */
export function AreasSection() {
  return (
    <section id="areas" aria-labelledby="areas-titulo" className="mb-14">
      <SectionHeading
        id="areas-titulo"
        eyebrow="Arquivos"
        title="Escolha por onde começar"
        description="Cada área guarda módulos e submódulos com aula e atividades. O progresso conta só o que já existe para concluir."
      />
      <div className="mt-4 grid gap-4">
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

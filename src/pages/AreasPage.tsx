import { AreaCard } from '@/components/curriculum/AreaCard'
import { ResumeCard } from '@/components/curriculum/ResumeCard'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { areas } from '@/data/curriculum'
import { useDocumentTitle } from '@/lib/use-document-title'
import { Link } from 'react-router'

export function AreasPage() {
  useDocumentTitle('Áreas de estudo')
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 py-8 md:py-10">
      <SectionHeading
        eyebrow="ESTUDO"
        level="h1"
        title="Áreas de estudo"
        description="Cada área tem módulos, e cada módulo tem submódulos com aula e atividades. O progresso conta só as atividades obrigatórias que já existem; o que está planejado aparece como planejado e não entra em porcentagem nenhuma."
      />
      <ResumeCard />
      <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-4 p-0 md:grid-cols-2">
        {areas.map((a) => (
          <AreaCard key={a.id} area={a} headingLevel="h2" />
        ))}
      </ul>
      <div>
        <Button asChild variant="outline" size="sm">
          <Link to="/explorar">Buscar em todo o conteúdo</Link>
        </Button>
      </div>
    </div>
  )
}

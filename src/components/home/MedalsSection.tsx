import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { AchievementGallery } from '@/components/gamification/AchievementGallery'
import { Button } from '@/components/ui/button'
import { TIER_XP } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

const PREVIEW = 6

/** Prévia das conquistas na página inicial. A galeria completa, com filtros, está em /conquistas. */
export function MedalsSection() {
  const { derived } = useProgress()
  const got = derived.medals.filter((m) => m.unlocked).length
  // As conquistas do sistema de aprendizado vêm primeiro na lista; a prévia mostra as primeiras.
  const preview = derived.medals.slice(0, PREVIEW)

  return (
    <section id="medalhas" aria-labelledby="medals-title" className="mt-9 mb-3">
      <SectionHeading level="h3" eyebrow="CONQUISTAS" id="medals-title" title="Conquistas" aside={`${got}/${derived.medals.length} desbloqueadas`} />
      <p className="mt-2 mb-4 text-xs text-muted-foreground">
        Cada conquista dá XP bônus uma única vez: bronze {TIER_XP.bronze}, prata {TIER_XP.prata}, ouro {TIER_XP.ouro} e dragão {TIER_XP.dragao}. As bloqueadas mostram quanto falta; as secretas aparecem só depois de desbloqueadas.
      </p>
      <AchievementGallery medals={preview} empty="Nenhuma conquista para mostrar." />
      <Button asChild variant="outline" className="mt-4">
        <Link to="/conquistas">
          Ver todas as conquistas <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </section>
  )
}

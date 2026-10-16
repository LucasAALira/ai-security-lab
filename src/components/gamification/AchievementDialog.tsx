import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { tierNames } from '@/lib/format'
import { browserTimezone, formatDay, type Medal } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { categoryNames, whereToEarn } from './achievement-meta'
import { MedalBadge } from './MedalBadge'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 text-[13px] last:border-b-0">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

/** Detalhes de uma conquista: regra, meta, progresso, nível, XP e data. Secretas bloqueadas só mostram a dica. */
export function AchievementDialog({ medal, onClose }: { medal: Medal | null; onClose: () => void }) {
  const { state } = useProgress()
  const where = medal ? whereToEarn(medal) : null
  return (
    <Dialog open={medal !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${medal ? `tier-${medal.tier}` : ''} border-tint-line bg-card sm:max-w-[460px]`}>
        {medal ? (
          <>
            <div className="flex items-center gap-4">
              <MedalBadge icon={medal.icon} tier={medal.tier} locked={!medal.unlocked} hidden={medal.masked} className="size-24" />
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                  {medal.unlocked ? 'Conquista desbloqueada' : medal.masked ? 'Conquista secreta' : 'Conquista bloqueada'}
                </div>
                <DialogTitle className="mt-1.5 text-xl leading-tight font-medium">{medal.name}</DialogTitle>
                <DialogDescription className="mt-1.5 text-[13px] leading-relaxed">{medal.desc}</DialogDescription>
              </div>
            </div>

            <dl className="rounded-lg border border-border bg-tint px-3.5 py-1">
              <Row label="Categoria">{medal.masked ? 'Oculta' : categoryNames[medal.category]}</Row>
              <Row label="Nível">
                {tierNames[medal.tier]} · +{medal.xp} XP
              </Row>
              {medal.masked ? (
                <Row label="Progresso">Oculto até o desbloqueio</Row>
              ) : (
                <Row label="Meta">
                  {medal.value} de {medal.target}
                </Row>
              )}
              <Row label="Situação">{medal.unlocked ? `Obtida${medal.date ? ` em ${formatDay(medal.date)}` : ''}` : 'Ainda não obtida'}</Row>
            </dl>

            {!medal.masked && !medal.unlocked && medal.target > 0 ? (
              <div role="progressbar" aria-label={`Progresso de ${medal.name}`} aria-valuemin={0} aria-valuemax={medal.target} aria-valuenow={medal.value} className="h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((medal.value / medal.target) * 100)}%` }} />
              </div>
            ) : null}

            {medal.id === 'persistencia' ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Só contam dias em que você realmente estudou; escudos da loja não preenchem lacunas aqui. Os dias seguem o fuso do navegador ({browserTimezone()}). Sequência atual: {state.study.current} · melhor: {state.study.best}.
              </p>
            ) : null}
            {medal.masked && medal.hint ? <p className="text-xs leading-relaxed text-muted-foreground">Dica: {medal.hint}</p> : null}
            <p className="text-[11px] leading-relaxed text-muted-foreground">Não há estatística de raridade: este site é local e não compara você com outras pessoas.</p>

            {where ? (
              <Button asChild className="justify-self-start">
                <Link to={where.to}>
                  {where.label}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

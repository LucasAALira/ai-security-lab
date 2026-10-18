import { CalendarClock, Lightbulb, Rocket, ScrollText } from 'lucide-react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { EarlyAccessPreview } from '@/components/shop/EarlyAccessPreview'
import { UnlockModuleCard } from '@/components/shop/UnlockModuleCard'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { modules } from '@/data/modules'
import { upcoming, upcomingStatus, type UpcomingItem, type UpcomingStatus } from '@/data/upcoming'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

const GROUPS: { status: UpcomingStatus; title: string; icon: typeof Rocket }[] = [
  { status: 'early', title: 'Disponível agora, em acesso antecipado', icon: Rocket },
  { status: 'planned', title: 'Em planejamento', icon: CalendarClock },
  { status: 'idea', title: 'Ideias em avaliação', icon: Lightbulb },
]

function Topics({ item }: { item: UpcomingItem }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] text-foreground/85">
      {item.topics.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

export function UpcomingPage() {
  useDocumentTitle('Em breve')
  const { derived } = useProgress()

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="NOVIDADES"
        level="h1"
        title="Em breve no laboratório"
        description="O que já está disponível em acesso antecipado e o que está sendo planejado. Não há datas prometidas: o plano muda conforme o estudo e o tempo permitem."
      />

      {GROUPS.map(({ status, title, icon: Icon }) => {
        const items = upcoming.filter((u) => u.status === status)
        if (!items.length) return null
        return (
          <section key={status} aria-labelledby={`grupo-${status}`} className="mt-10">
            <h2 id={`grupo-${status}`} className="mb-1 flex items-center gap-2 text-lg font-semibold">
              <Icon className="size-5 text-primary" aria-hidden="true" /> {title}
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-muted-foreground">{upcomingStatus[status].description}</p>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
              {items.map((item) => (
                <Card key={item.id} className="gap-3 p-5">
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="min-w-0 text-lg leading-snug font-medium">
                      {item.module !== undefined ? <span className="mr-2 font-mono text-sm text-muted-foreground">{modules[item.module].number}</span> : null}
                      {item.title}
                    </h3>
                    <Badge variant="secondary" className="rounded text-[10px] text-primary">
                      {upcomingStatus[item.status].label}
                    </Badge>
                  </header>
                  <p className="text-sm text-foreground/80">{item.summary}</p>

                  {item.module !== undefined ? (
                    <>
                      {derived.trail[item.module].unlocked ? (
                        <>
                          <Topics item={item} />
                          <UnlockModuleCard module={item.module} className="mt-2" />
                        </>
                      ) : (
                        <EarlyAccessPreview module={item.module} headingLevel={4} className="mt-1" />
                      )}
                    </>
                  ) : (
                    <>
                      <Topics item={item} />
                      {item.plan ? (
                        <p className="flex items-start gap-2 text-[13px] text-foreground/80">
                          <ScrollText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>
                            <strong>Como deve chegar:</strong> {item.plan}
                          </span>
                        </p>
                      ) : null}
                    </>
                  )}
                  {item.note ? <p className="text-[11px] leading-relaxed text-muted-foreground">{item.note}</p> : null}
                </Card>
              ))}
            </div>
          </section>
        )
      })}

      <p className="mt-10 max-w-2xl text-xs text-muted-foreground">
        Moedas vêm do estudo (1 a cada 5 XP, mais missões, baús e revisões) e ficam só neste navegador. Veja o seu saldo na{' '}
        <Link to="/loja" className="text-primary underline underline-offset-2">
          loja de moedas
        </Link>
        .
      </p>
    </div>
  )
}

import { BookOpen, ChevronDown, Swords } from 'lucide-react'
import { Link } from 'react-router'
import { BossPortrait, formaDoModulo } from '@/components/gothic/BossArt'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { bossOfModule } from '@/data/bosses'
import { modules } from '@/data/modules'
import { useProgress } from '@/state/ProgressProvider'

/** Quem enfrentar agora. Aparece quando um guardião cai: em vez de o site decidir o próximo passo,
 *  a escolha fica com quem venceu. Em cima, os chefes já liberados (fogueira acesa e ainda de pé);
 *  embaixo, num submenu fechado, os demais temas que ainda faltam estudar — eles continuam ali, mas
 *  não disputam a atenção com a escolha do momento. */
export function NextOpponents({ vencido, className }: { vencido?: number; className?: string }) {
  const { derived } = useProgress()
  const trail = derived.trail

  const liberados = trail.filter((t) => t.boss.available && !t.boss.won && t.module !== vencido)
  const aEstudar = trail.filter((t) => !t.complete && t.unlocked && t.module !== vencido)
  const trancados = trail.filter((t) => !t.complete && !t.unlocked)

  if (!liberados.length && !aEstudar.length && !trancados.length) {
    return (
      <Card className={className}>
        <p className="text-[13px] text-muted-foreground">
          Todos os guardiões da trilha estão derrubados e os módulos, concluídos. Repita um chefe quando quiser, ou veja o que ficou guardado no{' '}
          <Link to="/conquistas" className="text-primary underline underline-offset-2">
            Relicário
          </Link>
          .
        </p>
      </Card>
    )
  }

  return (
    <section aria-labelledby="proximos-oponentes" className={className}>
      <h2 id="proximos-oponentes" className="text-[19px] leading-snug">
        {liberados.length ? 'Quem você enfrenta agora' : 'O que estudar agora'}
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {liberados.length
          ? 'Estes guardiões estão de pé e com a fogueira do módulo acesa. A ordem é sua.'
          : 'Nenhum guardião está liberado ainda: acenda a fogueira de um módulo para chamá-lo.'}
      </p>

      {liberados.length ? (
        <ul className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
          {liberados.map((t) => {
            const boss = bossOfModule(t.module)
            const m = modules[t.module]
            return (
              <li key={t.module}>
                <Card className="h-full gap-2 p-4">
                  <div className="flex items-start gap-3">
                    <BossPortrait shape={formaDoModulo(t.module)} className="trail-boss-icon !size-12 shrink-0" />
                    <div className="min-w-0">
                      <p className="gx-inscription">
                        Módulo {m.number} · {m.category}
                      </p>
                      <h3 className="mt-1 text-[17px] leading-tight">{boss?.name ?? m.title}</h3>
                      {boss ? <p className="text-[12.5px] text-muted-foreground">{boss.epithet}</p> : null}
                    </div>
                  </div>
                  <Button asChild size="sm" className="mt-1 w-fit">
                    <Link to={`/chefe/${t.module}`}>
                      <Swords aria-hidden="true" /> Enfrentar
                    </Link>
                  </Button>
                </Card>
              </li>
            )
          })}
        </ul>
      ) : null}

      {aEstudar.length || trancados.length ? (
        <details className="group mt-4 border border-[var(--line)] bg-tint">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-primary marker:content-none focus-visible:outline-2">
            <BookOpen aria-hidden="true" className="size-4 shrink-0" />
            Demais temas a estudar ({aEstudar.length + trancados.length})
            <ChevronDown aria-hidden="true" className="ml-auto size-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="m-0 grid list-none gap-0.5 border-t border-[var(--line)] p-2">
            {[...aEstudar, ...trancados].map((t) => {
              const m = modules[t.module]
              return (
                <li key={t.module}>
                  <Link
                    to={`/modulo/${t.module}`}
                    className="block border border-transparent px-2.5 py-2 leading-tight transition-colors hover:border-[var(--ornament-soft)] hover:bg-tint-strong hover:text-primary focus-visible:outline-2"
                  >
                    <span className="block text-[13.5px] font-semibold">
                      Módulo {m.number} · {m.title}
                    </span>
                    <span className="block text-[11.5px] text-muted-foreground">
                      {m.category} · {t.unlocked ? 'liberado' : `falta a fogueira de ${t.missing.map((p) => modules[p].title).join(' e ')}`}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </details>
      ) : null}
    </section>
  )
}

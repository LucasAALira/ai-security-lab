import { Check, Lock } from 'lucide-react'
import { KnightArt, KNIGHT_VIEWBOX } from '@/components/gothic/KnightArt'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Card } from '@/components/ui/card'
import { GEAR, knightGear } from '@/lib/knight'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

/** O que o cavaleiro do santuário está vestindo e o que falta para a próxima peça.
 *  Só mostra o estado: nada aqui compra, gasta moeda ou muda preço. */
export function KnightArmor() {
  const { state, derived } = useProgress()
  const xp = derived.summary.xp
  const cavaleiro = knightGear(state, xp)
  return (
    <section aria-labelledby="armadura-titulo" className="mt-10">
      <SectionHeading
        eyebrow="Cavaleiro"
        id="armadura-titulo"
        level="h2"
        title="A armadura do cavaleiro"
        description="A figura ao lado da fogueira, na página inicial, é você. Começa descalço, de faca na mão, e veste cada peça com o estudo e com o que compra aqui."
        aside={`${cavaleiro.completo}/${cavaleiro.total} peças`}
      />
      <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
        <Card className="items-center justify-center gap-2 border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5">
          <svg
            viewBox={`0 0 ${KNIGHT_VIEWBOX.width} ${KNIGHT_VIEWBOX.height}`}
            width="150"
            height="250"
            role="img"
            aria-label={`${cavaleiro.titulo}, com ${cavaleiro.completo} de ${cavaleiro.total} peças de equipamento.`}
            className="max-w-full text-[var(--foreground)]"
          >
            <KnightArt gear={cavaleiro} />
          </svg>
          <p className="gx-inscription text-center">{cavaleiro.titulo}</p>
        </Card>
        <Card className="gap-0 p-0">
          <ul className="m-0 list-none divide-y divide-border p-0">
            {GEAR.map((peca) => {
              const tem = cavaleiro.tem(peca.id) || (peca.id === 'faca' && cavaleiro.tem('espada'))
              // A faca não tem marco nem compra: é com o que se começa.
              const comoObter = peca.xp !== undefined ? `${peca.xp} XP acumulados` : (peca.compra?.como ?? 'Você já começa com ela')
              return (
                <li key={peca.id} className="flex min-w-0 items-start gap-3 p-4">
                  {tem ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  ) : (
                    <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <p className={cn('text-sm font-semibold', !tem && 'text-muted-foreground')}>
                      {peca.nome}
                      <span className="sr-only">{tem ? ' — conquistada' : ' — ainda não conquistada'}</span>
                    </p>
                    <p className="text-[13px] text-muted-foreground">{peca.lore}</p>
                    <p className="mt-0.5 font-mono text-[11px] tracking-[0.06em] text-[var(--gold-anodized)] uppercase">
                      {comoObter}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </section>
  )
}

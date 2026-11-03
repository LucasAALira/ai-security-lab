import { useState } from 'react'
import { Check } from 'lucide-react'
import { HeroSprite } from './HeroSprite'
import { Button } from '@/components/ui/button'
import { HEROIS } from '@/data/herois'
import { heroOf, trajeOf } from '@/lib/hero'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

/** Escolha do caminho: os dez arquétipos, três trajes cada e a ficha do equipamento.
 *  Trocar de caminho não custa nada e não altera o progresso — é a sua cara no santuário. */
export function PathChooser({ onConfirm, confirmLabel }: { onConfirm?: () => void; confirmLabel?: string }) {
  const { state, dispatch } = useProgress()
  const atual = heroOf(state)
  const [escolhido, setEscolhido] = useState(atual.id)
  const [traje, setTraje] = useState(() => trajeOf(state))
  const heroi = HEROIS.find((h) => h.id === escolhido) ?? atual

  function confirmar() {
    dispatch({ type: 'setHero', hero: heroi.id, traje })
    onConfirm?.()
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* retrato e ficha do caminho em foco */}
      <div className="flex min-w-0 flex-col gap-3 border border-border bg-[linear-gradient(160deg,var(--tint-strong),var(--card))] p-5">
        <div className="flex justify-center py-2">
          <HeroSprite heroi={heroi} traje={traje} scale={4} title={`${heroi.nome}, ${heroi.trajes[traje].nome}`} />
        </div>
        <div>
          <p className="gx-inscription">Caminho</p>
          <h3 className="mt-1 text-[22px] leading-tight">{heroi.nome}</h3>
          <p className="mt-1 text-[13px] text-muted-foreground">{heroi.desc}</p>
          <p className="mt-2 text-[13px] text-[var(--gold-anodized)] italic">“{heroi.lema}”</p>
        </div>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-[12px]">
          {heroi.ficha.map(([rotulo, valor]) => (
            <div key={rotulo} className="contents">
              <dt className="font-mono tracking-[0.06em] text-muted-foreground uppercase">{rotulo}</dt>
              <dd className="m-0 min-w-0 break-words">{valor}</dd>
            </div>
          ))}
        </dl>
        <div role="radiogroup" aria-label="Traje" className="flex flex-wrap gap-2 border-t border-border pt-3">
          {heroi.trajes.map((t, i) => (
            <button
              key={t.nome}
              type="button"
              role="radio"
              aria-checked={i === traje}
              onClick={() => setTraje(i)}
              className={cn(
                'min-h-11 border px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors',
                i === traje ? 'border-[var(--line-hot)] text-primary' : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {t.nome}
            </button>
          ))}
        </div>
        <Button onClick={confirmar} size="lg" className="mt-1">
          <Check aria-hidden="true" /> {confirmLabel ?? 'Seguir por este caminho'}
        </Button>
      </div>

      {/* os dez caminhos */}
      <div role="radiogroup" aria-label="Caminhos do santuário" className="grid grid-cols-2 gap-2 sm:grid-cols-3 min-[900px]:grid-cols-5">
        {HEROIS.map((h) => {
          const ativo = h.id === escolhido
          return (
            <button
              key={h.id}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => {
                setEscolhido(h.id)
                setTraje((n) => Math.min(n, h.trajes.length - 1))
              }}
              className={cn(
                'flex min-h-11 min-w-0 flex-col items-center gap-1 border bg-card p-2 transition-colors',
                ativo ? 'border-[var(--line-hot)] bg-[linear-gradient(160deg,var(--tint-strong),var(--card))]' : 'border-border hover:border-[var(--line-strong)]',
              )}
            >
              <HeroSprite heroi={h} traje={ativo ? traje : 0} scale={2} />
              <span className={cn('text-center text-[12px] leading-tight', ativo ? 'text-primary' : 'text-muted-foreground')}>{h.nome}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

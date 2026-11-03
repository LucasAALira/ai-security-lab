import { KnightArt, KNIGHT_VIEWBOX } from '@/components/gothic/KnightArt'
import { HEROES, heroOf } from '@/lib/hero'
import { knightGear } from '@/lib/knight'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

/** Escolha da classe: troca a arma e o traje do cavaleiro do santuário.
 *  É só aparência — não muda XP, moeda, preço nem nada do progresso. */
export function HeroPicker() {
  const { state, derived, dispatch } = useProgress()
  const atual = heroOf(state)
  const cavaleiro = knightGear(state, derived.summary.xp)
  return (
    <div role="radiogroup" aria-label="Classe do cavaleiro" className="grid gap-3 sm:grid-cols-2 min-[1500px]:grid-cols-3">
      {HEROES.map((h) => {
        const escolhida = h.id === atual.id
        return (
          <button
            key={h.id}
            type="button"
            role="radio"
            aria-checked={escolhida}
            onClick={() => dispatch({ type: 'setHero', hero: h.id })}
            className={cn(
              'gx-candle min-h-[128px] cursor-pointer border border-border bg-card p-4 text-left transition-colors',
              escolhida && 'border-[var(--line-hot)] bg-[linear-gradient(135deg,var(--tint-strong),var(--card))]',
            )}
          >
            <span className="flex items-start gap-3">
                <svg
                  viewBox={`0 0 ${KNIGHT_VIEWBOX.width} ${KNIGHT_VIEWBOX.height}`}
                  width="54"
                  height="90"
                  aria-hidden="true"
                  className="shrink-0 text-[var(--foreground)]"
                >
                  <KnightArt gear={cavaleiro} hero={h.id} pose="guarda" animated={false} />
                </svg>
                <span className="block min-w-0">
                  <span className="block text-[15px] font-semibold">
                    {h.nome}
                    {escolhida ? <span className="ml-2 font-mono text-[11px] tracking-[0.08em] text-primary uppercase">em uso</span> : null}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">{h.descricao}</span>
                  <span className="mt-1 block font-mono text-[11px] tracking-[0.06em] text-[var(--gold-anodized)] uppercase">{h.arma}</span>
                  <span className="mt-1 block text-[12px] text-muted-foreground italic">“{h.lema}”</span>
                </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Swords } from 'lucide-react'
import { Link } from 'react-router'
import { BossArt, BOSS_VIEWBOX, type BossShape } from '@/components/gothic/BossArt'
import { KnightArt } from '@/components/gothic/KnightArt'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { bosses } from '@/data/bosses'
import { errantes } from '@/data/errantes'
import { inscricaoDoDia } from '@/data/inscricoes'
import { familiaOf, heroOf } from '@/lib/hero'
import { findMission, missionPassed } from '@/lib/progress'
import { knightGear } from '@/lib/knight'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import './battle-gallery.css'

/** Que vulto cabe a cada guardião, pelo que ele representa no site. */
const FORMA_DO_MODULO: BossShape[] = ['guardia', 'sombra', 'sombra', 'cavaleiro', 'juiza', 'juiza', 'guardia', 'juiza', 'maquina']

const data = (dia: string) => (dia ? dia.split('-').reverse().join('/') : '')

/** Crônicas do santuário: um quadro por guardião, com o seu cavaleiro diante dele.
 *  Só mostra o que já está no progresso — nada aqui concede XP nem muda regra alguma. */
export function BattleGallery() {
  const { state, ctx, derived, today } = useProgress()
  const cavaleiro = knightGear(state, derived.summary.xp)
  const classe = heroOf(state)
  const [atual, setAtual] = useState(0)
  const faixa = useRef<HTMLDivElement>(null)

  const guardioes = bosses.map((boss, i) => {
    const venceu = state.bosses[i]?.won ?? ''
    return {
      chave: `modulo-${i}`,
      to: `/modulo/${i}`,
      overlay: true,
      selo: `Módulo ${String(i + 1).padStart(2, '0')}`,
      nome: boss.name,
      epiteto: boss.epithet,
      forma: (FORMA_DO_MODULO[i] ?? 'guardia') as BossShape,
      venceu,
      legenda: venceu
        ? `Caiu em ${data(venceu)}${state.bosses[i]?.flawless ? ', sem um erro sequer' : ''}.`
        : inscricaoDoDia('batalha', today, i),
    }
  })

  /* Os errantes não guardam módulo nenhum: entram no fim das crônicas, com a própria fala. */
  const vagantes = errantes.map((e) => {
    const spec = findMission(ctx, e.id)
    const venceu = spec ? missionPassed(state, spec) : false
    return {
      chave: e.id,
      to: `/errantes/${e.id}`,
      overlay: false,
      selo: `Errante · ${e.elemento === 'gelo' ? 'Gelo' : 'Veneno'}`,
      nome: e.nome,
      epiteto: e.epiteto,
      forma: e.forma,
      venceu: venceu ? 'sim' : '',
      legenda: venceu ? 'Derrubado. O santuário respira mais fundo desde então.' : `“${e.fala}”`,
    }
  })

  const quadros = [...guardioes, ...vagantes]

  const vencidos = quadros.filter((q) => q.venceu).length
  const ir = (passo: number) => setAtual((n) => (n + passo + quadros.length) % quadros.length)

  // Mantém o quadro escolhido visível quando se navega pelo teclado ou pelos botões.
  useEffect(() => {
    const alvo = faixa.current?.children[atual] as HTMLElement | undefined
    alvo?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [atual])

  const quadro = quadros[atual]

  return (
    <section id="cronicas" aria-labelledby="cronicas-titulo" className="mb-14">
      <SectionHeading
        eyebrow="Crônicas"
        id="cronicas-titulo"
        title="Crônicas do santuário"
        description="Um quadro para cada guardião: os nove da trilha e os errantes, que não guardam módulo nenhum. Os que você ainda não enfrentou ficam no escuro."
        aside={`${vencidos}/${quadros.length} derrubados`}
      />

      <Card className="mt-4 gap-0 overflow-hidden p-0">
        <div
          className="battle-frame relative"
          role="group"
          aria-roledescription="galeria"
          aria-label={`Quadro ${atual + 1} de ${quadros.length}: ${quadro.nome}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              ir(1)
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              ir(-1)
            }
          }}
        >
          <svg viewBox="0 0 420 180" className="block w-full" role="img" aria-label={`${classe.nome} ${cavaleiro.titulo} diante de ${quadro.nome}, ${quadro.epiteto}. ${quadro.venceu ? `Derrotado em ${data(quadro.venceu)}.` : 'Ainda não enfrentado.'}`}>
            <defs>
              <radialGradient id="battle-halo" cx="0.62" cy="0.5" r="0.6">
                <stop offset="0" style={{ stopColor: 'var(--primary)', stopOpacity: 0.18 }} />
                <stop offset="1" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            <rect width="420" height="180" fill="color-mix(in oklab, var(--card) 82%, #000)" />
            <rect width="420" height="180" fill="url(#battle-halo)" />
            {/* chão e colunas, só para dar profundidade */}
            <path d="M0 168 H420" stroke="color-mix(in oklab, var(--foreground) 18%, transparent)" strokeWidth="1" fill="none" />
            <path d="M36 168 V26 M392 168 V26" stroke="color-mix(in oklab, var(--foreground) 10%, transparent)" strokeWidth="1" fill="none" />
            <ellipse cx="174" cy="169" rx="36" ry="6" fill="#05060a" opacity="0.5" />
            <ellipse cx="312" cy="169" rx="54" ry="7" fill="#05060a" opacity="0.55" />
            <g transform="translate(124 30) scale(0.70)" style={{ color: 'var(--foreground)' }}>
              <KnightArt gear={cavaleiro} hero={familiaOf(classe.id)} pose="ataque" />
            </g>
            <g transform={`translate(${420 - BOSS_VIEWBOX.width * 0.78 - 54} 16) scale(0.78)`}>
              <BossArt shape={quadro.forma} vencido={Boolean(quadro.venceu)} />
            </g>
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(0deg,color-mix(in_oklab,var(--card)_94%,transparent),transparent)] p-4">
            <div className="min-w-0">
              <p className="gx-inscription">
                {quadro.selo} · {quadro.venceu ? 'derrubado' : 'de pé'}
              </p>
              <h3 className="mt-1 text-[19px] leading-tight font-semibold">{quadro.nome}</h3>
              <p className="text-[13px] text-muted-foreground">{quadro.epiteto}</p>
              <p className="mt-1 text-[13px] text-[var(--gold-anodized)] italic">{quadro.legenda}</p>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link to={quadro.to} state={quadro.overlay ? { overlay: true } : undefined}>
                <Swords aria-hidden="true" /> {quadro.venceu ? 'Reencontrar' : 'Enfrentar'}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border p-3">
          <Button size="icon" variant="ghost" onClick={() => ir(-1)} aria-label="Quadro anterior">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <div ref={faixa} className="flex min-w-0 flex-1 gap-2 overflow-x-auto" role="tablist" aria-label="Quadros das crônicas">
            {quadros.map((q, i) => (
              /* o rótulo começa pelo número que aparece no botão, para comando de voz funcionar */
              <button
                key={q.chave}
                type="button"
                role="tab"
                aria-selected={i === atual}
                aria-label={`${String(i + 1).padStart(2, '0')} — ${q.nome}${q.venceu ? ', derrubado' : ', ainda de pé'}`}
                onClick={() => setAtual(i)}
                className={cn(
                  'min-h-11 shrink-0 border px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] uppercase transition-colors',
                  i === atual ? 'border-[var(--line-hot)] text-primary' : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {String(i + 1).padStart(2, '0')}
                <span className={cn('ml-1.5 inline-block size-1.5 rounded-full align-middle', q.venceu ? 'bg-primary' : 'bg-muted-foreground/40')} />
              </button>
            ))}
          </div>
          <Button size="icon" variant="ghost" onClick={() => ir(1)} aria-label="Próximo quadro">
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </Card>
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        Quadro {atual + 1} de {quadros.length}. Use as setas do teclado para percorrer as crônicas.
      </p>
    </section>
  )
}

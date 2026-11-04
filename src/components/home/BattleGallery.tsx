import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Swords } from 'lucide-react'
import { Link } from 'react-router'
import { BossArt, BOSS_VIEWBOX, formaDoModulo, type BossShape } from '@/components/gothic/BossArt'
import { arteDoTraje, trajeDoHeroi } from '@/components/hero/HeroArt'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { bosses } from '@/data/bosses'
import { errantes } from '@/data/errantes'
import { inscricaoDoDia } from '@/data/inscricoes'
import { heroOf, trajeOf } from '@/lib/hero'
import { findMission, missionPassed } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import '@/components/hero/hero-art.css'
import './battle-gallery.css'

const data = (dia: string) => (dia ? dia.split('-').reverse().join('/') : '')

/** Altura do personagem dentro do quadro, nas unidades do `viewBox` de 420 × 180.
 *  O guardião tem 156 e fica mais alto de propósito: quem chega é menor do que o que guarda. */
const ALTURA_HEROI = 106

/** O guardião no quadro: o sprite ocupa 200 × 200 e é reduzido para ficar um palmo acima do personagem. */
const ESCALA_CHEFE = 0.82
const CHEFE_X = 420 - BOSS_VIEWBOX.width * ESCALA_CHEFE - 36
const CHEFE_Y = 170 - BOSS_VIEWBOX.height * ESCALA_CHEFE

/** Crônicas do santuário: um quadro por guardião, com o seu personagem diante dele.
 *  Só mostra o que já está no progresso — nada aqui concede XP nem muda regra alguma. */
export function BattleGallery() {
  const { state, ctx, today } = useProgress()
  const classe = heroOf(state)
  const trajeAtual = trajeDoHeroi(classe, trajeOf(state))
  const larguraHeroi = (trajeAtual.largura / trajeAtual.altura) * ALTURA_HEROI
  const [atual, setAtual] = useState(0)
  const faixa = useRef<HTMLDivElement>(null)

  const guardioes = bosses.map((boss, i) => {
    const venceu = state.bosses[i]?.won ?? ''
    return {
      chave: `modulo-${i}`,
      to: `/chefe/${i}`,
      selo: `Módulo ${String(i + 1).padStart(2, '0')}`,
      nome: boss.name,
      epiteto: boss.epithet,
      forma: formaDoModulo(i) as BossShape,
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
          <svg viewBox="0 0 420 180" className="block w-full" role="img" aria-label={`${classe.nome}, traje ${trajeAtual.nome}, diante de ${quadro.nome}, ${quadro.epiteto}. ${quadro.venceu ? `Derrotado em ${data(quadro.venceu)}.` : 'Ainda não enfrentado.'}`}>
            <defs>
              <radialGradient id="battle-halo" cx="0.62" cy="0.5" r="0.6">
                <stop offset="0" style={{ stopColor: 'var(--primary)', stopOpacity: 0.18 }} />
                <stop offset="1" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            {/* as ruínas atrás: o piso de lajes e as tochas ficam à vista, e um véu escuro deixa os sprites se destacarem */}
            <image href={`${import.meta.env.BASE_URL}assets/cursemark/ruinas.png`} x="0" y="0" width="420" height="180" preserveAspectRatio="xMidYMax slice" />
            <rect width="420" height="180" fill="var(--background)" opacity="0.38" />
            <rect width="420" height="180" fill="url(#battle-halo)" />
            <ellipse cx="158" cy="169" rx="30" ry="6" fill="#05060a" opacity="0.55" />
            <ellipse cx={CHEFE_X + (BOSS_VIEWBOX.width * ESCALA_CHEFE) / 2} cy="170" rx="58" ry="7" fill="#05060a" opacity="0.6" />
            {/* o personagem do caminho escolhido, de pé na mesma linha de chão do guardião */}
            <image
              className="hero-art hero-art-respira"
              href={arteDoTraje(trajeAtual)}
              x={158 - larguraHeroi / 2}
              y={168 - ALTURA_HEROI}
              width={larguraHeroi}
              height={ALTURA_HEROI}
            />
            <g transform={`translate(${CHEFE_X} ${CHEFE_Y}) scale(${ESCALA_CHEFE})`}>
              <BossArt shape={quadro.forma} vencido={Boolean(quadro.venceu)} />
            </g>
          </svg>

          <div className="battle-caption flex items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="gx-inscription">
                {quadro.selo} · {quadro.venceu ? 'derrubado' : 'de pé'}
              </p>
              <h3 className="mt-1 text-[19px] leading-tight font-semibold">{quadro.nome}</h3>
              <p className="text-[13px] text-muted-foreground">{quadro.epiteto}</p>
              <p className="mt-1 text-[13px] text-[var(--gold-anodized)] italic">{quadro.legenda}</p>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link to={quadro.to}>
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

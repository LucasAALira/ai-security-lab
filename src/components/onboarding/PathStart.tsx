import { useState } from 'react'
import { ArrowRight, BookOpen, Check } from 'lucide-react'
import { useNavigate } from 'react-router'
import { BossPortrait, formaDoModulo } from '@/components/gothic/BossArt'
import { Button } from '@/components/ui/button'
import { bossOfModule } from '@/data/bosses'
import { modules } from '@/data/modules'
import { CAMINHOS, moduloInicial, type Caminho } from '@/lib/caminhos'
import { isModuleComplete } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { Overlay } from './Overlay'

/** Por onde começar a jornada: as três trilhas de tema, logo depois do tutorial.
 *
 *  A escolha não tranca nada — os outros módulos continuam abrindo pelas regras de pré-requisito de
 *  sempre, e dá para estudar qualquer um pela trilha. Ela diz por onde a pessoa quer entrar, e o
 *  site a leva direto ao primeiro módulo dessa trilha. */
export function PathStart() {
  const { state, dispatch } = useProgress()
  const navegar = useNavigate()
  const [escolhido, setEscolhido] = useState<Caminho>(CAMINHOS[0])
  const completo = (i: number) => isModuleComplete(state.modules[i])
  const primeiro = moduloInicial(escolhido, completo)

  function seguir() {
    dispatch({ type: 'setAbertura', caminho: escolhido.id })
    navegar(`/modulo/${primeiro}`)
  }

  return (
    <Overlay labelledBy="caminho-titulo" describedBy="caminho-texto">
      <p className="gx-inscription">Começo da jornada</p>
      <h1 id="caminho-titulo" className="gx-display mt-2 text-[24px] leading-tight sm:text-[30px]">
        Escolha por onde começar
      </h1>
      <p id="caminho-texto" className="mt-2 max-w-prose text-sm text-muted-foreground">
        Três trilhas saem dos fundamentos. Nenhuma tranca as outras: você pode trocar quando quiser, e os demais temas continuam na trilha de módulos. A
        escolha só diz para onde o santuário aponta agora.
      </p>

      <div role="radiogroup" aria-label="Trilhas para começar" className="mt-6 grid gap-3 md:grid-cols-3">
        {CAMINHOS.map((c) => {
          const ativo = c.id === escolhido.id
          const inicial = moduloInicial(c, completo)
          const boss = bossOfModule(inicial)
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => setEscolhido(c)}
              className={cn(
                'grid content-start gap-2 border p-4 text-left transition-colors',
                ativo ? 'border-[var(--line-hot)] bg-tint-strong' : 'border-border hover:border-[var(--ornament-soft)] hover:bg-tint',
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="gx-inscription">{c.modulos.length === 1 ? '1 módulo' : `${c.modulos.length} módulos`}</span>
                {ativo ? <Check aria-hidden="true" className="size-4 shrink-0 text-primary" /> : null}
              </span>
              <span className="text-[18px] leading-tight font-semibold">{c.categoria}</span>
              <span className="text-[13px] text-muted-foreground">{c.resumo}</span>
              <span className="mt-1 flex items-center gap-2 border-t border-border pt-2.5">
                <BossPortrait shape={formaDoModulo(inicial)} className="trail-boss-icon !size-10 shrink-0" />
                <span className="min-w-0 text-[12px] leading-tight text-muted-foreground">
                  Primeiro guardião: <span className="text-[var(--gold-anodized)]">{boss?.name ?? '—'}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 border border-border bg-background/30 p-4">
        <p className="gx-inscription">Você escolheu</p>
        <h2 className="mt-1 text-[19px] leading-snug">{escolhido.categoria}</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{escolhido.jeito}</p>
        <ul className="mt-3 grid list-none gap-1 p-0 text-[13px]">
          {escolhido.modulos.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <BookOpen aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Módulo {modules[i].number} · {modules[i].title}
                {completo(i) ? ' (concluído)' : ''}
              </span>
            </li>
          ))}
        </ul>
        <Button size="lg" className="mt-4" onClick={seguir}>
          Começar por {modules[primeiro].title} <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </Overlay>
  )
}

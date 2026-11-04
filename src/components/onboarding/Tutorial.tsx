import { useState } from 'react'
import { ArrowRight, Check, SkipForward } from 'lucide-react'
import { QuestionCard } from '@/components/study/QuestionCard'
import { Button } from '@/components/ui/button'
import { modules } from '@/data/modules'
import { eventsToText } from '@/lib/events-text'
import { MODULO_TUTORIAL } from '@/lib/caminhos'
import { useProgress } from '@/state/ProgressProvider'
import { Overlay } from './Overlay'

const ETAPAS = ['Conceito', 'Exemplo', 'Como corrigir'] as const

/** Tutorial de abertura: a primeira matéria de Fundamentos, uma ideia por vez, antes de o
 *  santuário aparecer.
 *
 *  Não é um conteúdo à parte: são as mesmas três etapas do módulo 01 e a primeira questão dele, com
 *  o mesmo progresso e o mesmo XP. A diferença é a forma — uma etapa por tela, sem menu em volta,
 *  para a primeira visita não começar por um mapa de vinte páginas. Dá para pular; quem pula
 *  continua vendo o convite na jornada e não perde nada. */
export function Tutorial() {
  const { state, dispatch } = useProgress()
  const m = modules[MODULO_TUTORIAL]
  const s = state.modules[MODULO_TUTORIAL]
  const [passo, setPasso] = useState(0)
  const [aviso, setAviso] = useState('')
  const ultima = m.parts.length
  const pergunta = m.questions[0]

  /** Mostra no rodapé o que a etapa rendeu, como a página do módulo faz. */
  function anunciar(linhas: string[]) {
    if (linhas.length) setAviso(`${linhas.join(' · ')}.`)
  }

  function ler(parte: number) {
    if (!s.reads[parte]) anunciar(eventsToText(dispatch({ type: 'read', module: MODULO_TUTORIAL, index: parte }).events))
    setPasso(parte + 1)
  }

  function responder(_choice: number, ok: boolean): string | void {
    if (!ok) {
      dispatch({ type: 'miss', module: MODULO_TUTORIAL, index: 0 })
      return
    }
    const linhas = eventsToText(dispatch({ type: 'answer', module: MODULO_TUTORIAL, index: 0 }).events)
    anunciar(linhas)
    return linhas.join(' · ') || undefined
  }

  const sair = (tutorial: 'feito' | 'pulado') => dispatch({ type: 'setAbertura', tutorial })

  return (
    <Overlay labelledBy="tutorial-titulo" describedBy="tutorial-texto">
      <p className="gx-inscription">Tutorial · módulo {m.number}</p>
      <h1 id="tutorial-titulo" className="gx-display mt-2 text-[24px] leading-tight sm:text-[30px]">
        {m.title}
      </h1>
      <p id="tutorial-texto" className="mt-2 max-w-prose text-sm text-muted-foreground">
        {m.summary} Esta é a primeira matéria da trilha, apresentada uma ideia por vez. Ela conta no seu progresso como qualquer outra, e você pode pular e
        voltar depois.
      </p>

      <ol aria-label="Etapas do tutorial" className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        {[...ETAPAS, 'Questão'].map((nome, i) => (
          <li
            key={nome}
            aria-current={i === passo ? 'step' : undefined}
            className={`inline-flex items-center gap-1 border px-2.5 py-1 ${i === passo ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
          >
            {i < passo ? <Check className="size-3" aria-hidden="true" /> : null}
            {nome}
          </li>
        ))}
      </ol>

      <div className="mt-4 border border-border bg-background/30 p-4 sm:p-5">
        {passo < ultima ? (
          <>
            <h2 className="text-xl leading-snug">{ETAPAS[passo]}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{m.parts[passo]}</p>
            <Button className="mt-5" onClick={() => ler(passo)}>
              {passo === ultima - 1 ? 'Ir para a questão' : 'Continuar'} <ArrowRight aria-hidden="true" />
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl leading-snug">Uma questão para fechar</h2>
            <p className="mt-1 mb-4 text-[13px] text-muted-foreground">Errar não trava nada: a explicação aparece e você tenta de novo.</p>
            <QuestionCard
              number={1}
              title={pergunta.title}
              options={pergunta.options}
              correct={pergunta.correct}
              feedback={pergunta.feedback}
              hint={pergunta.hint}
              solved={s.solved[0]}
              onAnswer={responder}
            />
            <Button className="mt-5" onClick={() => sair('feito')}>
              Entrar no santuário <ArrowRight aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-xs text-muted-foreground">
          {aviso || 'O restante do módulo 01 (pesquisa, atividade prática e o quiz) continua esperando na trilha.'}
        </p>
        <Button variant="ghost" size="sm" onClick={() => sair('pulado')}>
          <SkipForward aria-hidden="true" /> Pular o tutorial
        </Button>
      </div>
    </Overlay>
  )
}

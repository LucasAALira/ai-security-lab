import { useReducedMotion } from 'motion/react'
import { lazy, Suspense, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const RiveCanvas = lazy(() => import('./RiveCanvas'))

/** Arquivos `.riv` que existem em `src/assets/rive/`, resolvidos na hora de gerar o site:
 *  sem arquivo não há busca na rede nem erro no console. */
const files = import.meta.glob<string>('/src/assets/rive/*.riv', { query: '?url', import: 'default', eager: true })

interface Props {
  /** Nome do arquivo dentro de `src/assets/rive/`, por exemplo `hero.riv`. */
  src: string
  /** Máquina de estados a iniciar, se o arquivo tiver uma. */
  stateMachine?: string
  /** O que aparece enquanto não há `.riv`, se ele falhar ou se a pessoa prefere menos movimento. */
  fallback?: ReactNode
  /** Descrição para leitores de tela; sem ela, a animação é tratada como decorativa. */
  label?: string
  className?: string
}

/**
 * Espaço reservado para uma animação do Rive.
 *
 * O site funciona sem nenhum `.riv`: enquanto `src/assets/rive/<src>` não existir, mostra o `fallback`.
 * Basta salvar o arquivo ali (veja `src/assets/rive/LEIA-ME.md`) e gerar o site de novo para a animação
 * aparecer no lugar. A biblioteca do Rive só é baixada nesse caso.
 */
export function RiveSlot({ src, stateMachine, fallback = null, label, className }: Props) {
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const url = files[`/src/assets/rive/${src}`]

  if (!url || failed || reduced) return <>{fallback}</>
  return (
    <div className={cn(className)} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <Suspense fallback={fallback}>
        <RiveCanvas src={url} stateMachine={stateMachine} onError={() => setFailed(true)} />
      </Suspense>
    </div>
  )
}

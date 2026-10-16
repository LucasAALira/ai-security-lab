import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { flashcardsOfModule } from '@/data/flashcards'
import { useProgress } from '@/state/ProgressProvider'
import { Flashcard } from './Flashcard'

/** Baralho de revisão de um módulo: um cartão por vez, com contagem dos que já foram marcados como sabidos.
 *  Flashcards não rendem XP (são revisão), mas contam como dia de estudo. */
export function FlashcardDeck({ module }: { module: number }) {
  const { state, dispatch } = useProgress()
  const cards = flashcardsOfModule(module)
  const [i, setI] = useState(() => {
    const firstPending = cards.findIndex((c) => !state.cards[c.id])
    return firstPending === -1 ? 0 : firstPending
  })
  if (!cards.length) return <p className="text-sm text-muted-foreground">Este módulo ainda não tem cartões de revisão.</p>

  const card = cards[i]
  const known = cards.filter((c) => state.cards[c.id]).length
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 text-foreground/85">
          <Layers className="size-4 text-primary" aria-hidden="true" />
          Cartão {i + 1} de {cards.length}
        </span>
        <span>
          {known} de {cards.length} marcados como sabidos
        </span>
      </div>
      <Flashcard key={card.id} front={card.front} back={card.back} known={Boolean(state.cards[card.id])} onMark={(value) => dispatch({ type: 'card', id: card.id, known: value })} />
      <div className="mt-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>
          <ChevronLeft aria-hidden="true" /> Anterior
        </Button>
        <Button variant="ghost" size="sm" disabled={i === cards.length - 1} onClick={() => setI(i + 1)}>
          Próximo <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

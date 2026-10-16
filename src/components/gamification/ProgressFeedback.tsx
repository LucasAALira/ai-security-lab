import { useEffect } from 'react'
import { toast } from 'sonner'
import { eventsToText, rejectText } from '@/lib/events-text'
import type { Action, ApplyResult } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { MedalToast } from './MedalToast'

const MAX_MEDAL_TOASTS = 3

export function notifyResult(result: ApplyResult, action: Action) {
  if (!result.changed) {
    if (result.rejected) toast.error(rejectText[result.rejected])
    return
  }
  if (action.type === 'note' || action.type === 'setTheme') return

  // Medalhas ganham aviso próprio; o resto vira um aviso só, para não empilhar.
  // Com um diálogo aberto (a lição), o aviso fixo dele já diz o que mudou: não repete em toast.
  const medals = result.events.filter((e) => e.kind === 'medal')
  const lines = eventsToText(result.events.filter((e) => e.kind !== 'medal'))
  const inDialog = typeof document !== 'undefined' && document.querySelector('[role="dialog"][data-state="open"]') !== null
  if (lines.length && !inDialog) toast.success(lines[0], { description: lines.slice(1).join(' · ') || undefined })
  medals.slice(0, MAX_MEDAL_TOASTS).forEach((e) => toast.custom(() => <MedalToast medal={e.medal} />, { duration: 6000 }))
  if (medals.length > MAX_MEDAL_TOASTS) toast(`e mais ${medals.length - MAX_MEDAL_TOASTS} medalhas`, { duration: 6000 })
}

/** Liga os resultados do progresso aos avisos em tela. Não renderiza nada. */
export function ProgressFeedback() {
  const { store } = useProgress()
  useEffect(() => store.onResult(notifyResult), [store])
  return null
}

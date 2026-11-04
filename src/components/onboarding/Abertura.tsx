import { FirstChoice } from '@/components/hero/FirstChoice'
import { MODULO_TUTORIAL } from '@/lib/caminhos'
import { heroEscolhido } from '@/lib/hero'
import { isModuleComplete, moduleSteps } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
import { PathStart } from './PathStart'
import { Tutorial } from './Tutorial'

/** A abertura, em três telas: o caminho (a figura), o tutorial (a primeira matéria) e a trilha por
 *  onde começar. Elas vêm antes do santuário, uma de cada vez, e só na primeira visita.
 *
 *  Quem já estudava antes de a abertura existir não vê nada disso: o progresso salvo mostra que a
 *  pessoa passou dessa parte, e cair numa tela de boas-vindas no meio do curso seria um atraso, não
 *  uma ajuda. */
export function Abertura() {
  const { state } = useProgress()
  if (!heroEscolhido(state)) return <FirstChoice />

  const veterano =
    isModuleComplete(state.modules[MODULO_TUTORIAL]) ||
    Object.keys(state.modules).some((i) => Number(i) !== MODULO_TUTORIAL && moduleSteps(state.modules[Number(i)]) > 0)
  if (veterano) return null

  if (!state.prefs.tutorial) return <Tutorial />
  if (!state.prefs.caminho) return <PathStart />
  return null
}

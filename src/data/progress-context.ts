import { buildContext, type ProgressContext } from '@/lib/progress'
import { bossAnswers } from './bosses'
import { challengeSpecs } from './challenges'
import { modules } from './modules'
import { remediationCases } from './scenarios'

/** Contexto do progresso com todo o conteúdo do site: módulos, cenários, desafios de código e chefes. */
export const progressContext: ProgressContext = buildContext(modules, remediationCases, { challenges: challengeSpecs, bosses: bossAnswers })

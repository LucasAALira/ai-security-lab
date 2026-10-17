import { buildContext, type ProgressContext } from '@/lib/progress'
import { bossAnswers } from './bosses'
import { challengeSpecs } from './challenges'
import { curriculumSpec, lessonIds } from './curriculum'
import { modules } from './modules'
import { remediationCases } from './scenarios'

/** Contexto do progresso com todo o conteúdo do site: módulos, cenários, desafios de código, chefes e hierarquia. */
export const progressContext: ProgressContext = buildContext(modules, remediationCases, {
  challenges: challengeSpecs,
  bosses: bossAnswers,
  lessons: lessonIds,
  curriculum: curriculumSpec,
})

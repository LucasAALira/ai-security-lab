import { buildContext, type ProgressContext } from '@/lib/progress'
import { bossAnswers } from './bosses'
import { campaignSpecs, missionSpecs } from './campaigns'
import { challengeSpecs } from './challenges'
import { curriculumSpec, lessonIds } from './curriculum'
import { modules } from './modules'
import { remediationCases } from './scenarios'

/** Contexto do progresso com todo o conteúdo do site: módulos, cenários, desafios de código, chefes e hierarquia. */
export const progressContext: ProgressContext = buildContext(modules, remediationCases, {
  challenges: challengeSpecs,
  bosses: bossAnswers,
  missions: missionSpecs,
  campaigns: campaignSpecs,
  lessons: lessonIds,
  curriculum: curriculumSpec,
})

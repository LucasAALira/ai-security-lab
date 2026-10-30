import { buildContext, type ProgressContext } from '@/lib/progress'
import { architectSpecs } from './architect'
import { bossAnswers } from './bosses'
import { campaignSpecs, missionSpecs } from './campaigns'
import { challengeSpecs } from './challenges'
import { reviewSpecs } from './code-review'
import { curriculumSpec, lessonIds } from './curriculum'
import { modules } from './modules'
import { remediationCases } from './scenarios'

/** Contexto do progresso com todo o conteúdo do site: módulos, cenários, desafios de código, chefes,
 *  campanhas, dossiês, amostras de análise de código e hierarquia. */
export const progressContext: ProgressContext = buildContext(modules, remediationCases, {
  challenges: challengeSpecs,
  bosses: bossAnswers,
  missions: [...missionSpecs, ...reviewSpecs],
  campaigns: campaignSpecs,
  lessons: lessonIds,
  architect: architectSpecs,
  curriculum: curriculumSpec,
})

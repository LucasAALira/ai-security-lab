import type { CurriculumSpec, SubSpec } from '@/lib/progress'
import { challenges } from '../challenges'
import { curriculumAreas, curriculumModules, curriculumSubs } from './tree'
import { lessons } from './lessons'
import { integrators } from './integrators'
import type { Area, AreaId, CurriculumModule, Lesson, Submodule } from './types'

export * from './types'
export { lessons } from './lessons'

/* Currículo Área -> Módulo -> Submódulo. Um submódulo só tem progresso quando há conteúdo real:
   uma aula, um desafio de código que aponta para ele ou o progresso de um módulo clássico.
   O que não tem nada disso aparece como "planejado" e nunca entra em porcentagem nenhuma. */

export const areas: Area[] = curriculumAreas
export const curriculumModuleList: CurriculumModule[] = curriculumModules.map((m) => ({ ...m, integrator: integrators[m.id] ?? null }))
export const submodules: Submodule[] = curriculumSubs

export const areaById = (id: string): Area | undefined => areas.find((a) => a.id === id)
export const moduleById = (id: string): CurriculumModule | undefined => curriculumModuleList.find((m) => m.id === id)
export const subById = (id: string): Submodule | undefined => submodules.find((s) => s.id === id)
export const lessonOf = (id: string): Lesson | undefined => lessons[id]

export const modulesOfArea = (area: string): CurriculumModule[] => curriculumModuleList.filter((m) => m.area === area)
export const subsOfModule = (module: string): Submodule[] => submodules.filter((s) => s.module === module)

/** Título da área de um submódulo (usado nos desafios que não pertencem a um módulo clássico). */
export const areaTitleOf = (submodule: string): string => {
  const sub = subById(submodule)
  return sub ? (areaById(sub.area)?.title ?? 'Laboratório') : 'Laboratório'
}

export const areaIdOfSub = (submodule: string): AreaId | undefined => subById(submodule)?.area

/** Desafios de código que pertencem ao submódulo. */
export const challengeIdsOf = (submodule: string): string[] => challenges.filter((c) => c.submodule === submodule).map((c) => c.id)

/** O submódulo tem o que estudar ou praticar. */
export function isAvailable(sub: Submodule): boolean {
  return sub.legacy !== null || Boolean(lessons[sub.id]) || challengeIdsOf(sub.id).length > 0
}

const subSpecs: SubSpec[] = submodules.map((s) => ({
  id: s.id,
  module: s.module,
  area: s.area,
  available: isAvailable(s),
  legacy: s.legacy,
  lesson: s.legacy === null && Boolean(lessons[s.id]),
  challenges: challengeIdsOf(s.id),
}))

/** Gabarito da hierarquia para o motor de progresso. */
export const curriculumSpec: CurriculumSpec = {
  areas: areas.map((a) => ({ id: a.id, modules: a.modules })),
  modules: curriculumModuleList.map((m) => ({ id: m.id, area: m.area, subs: m.subs })),
  subs: subSpecs,
}

/** Ids dos submódulos cuja aula rende XP ao ser marcada como lida. */
export const lessonIds: string[] = subSpecs.filter((s) => s.lesson).map((s) => s.id)

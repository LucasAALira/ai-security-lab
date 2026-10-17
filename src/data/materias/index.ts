import type { Materia } from '../types'
import { owaspTop10Llm } from './owasp-top-10-llm'
import { injecaoDePrompt } from './injecao-de-prompt'
import { mitreAtlas } from './mitre-atlas'
import { redTeamingIa } from './red-teaming-ia'
import { nistAiRmf } from './nist-ai-rmf'
import { isoIec42001 } from './iso-iec-42001'
import { lgpdIa } from './lgpd-ia'
import { euAiAct } from './eu-ai-act'
import { engenhariaReversa } from './engenharia-reversa'

/** As matérias, na mesma ordem dos módulos. */
export const materias: Materia[] = [owaspTop10Llm, injecaoDePrompt, mitreAtlas, redTeamingIa, nistAiRmf, isoIec42001, lgpdIa, euAiAct, engenhariaReversa]

export const materiaBySlug = (slug: string): Materia | undefined => materias.find((m) => m.slug === slug)

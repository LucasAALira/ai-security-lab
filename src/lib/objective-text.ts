import { modules } from '@/data/modules'
import { challengeById } from '@/data/challenges'
import { formatNumber, plural } from '@/lib/format'
import type { Objective } from '@/lib/progress'

export interface ObjectiveView {
  /** Frase curta: o que fazer. */
  title: string
  /** Complemento: de onde vem o XP, quanto falta. */
  detail: string
  to: string
  /** Rótulo do botão: ícone mais uma palavra. */
  cta: string
}

const STEP_TEXT = {
  aulas: (left: number) => `Concluir ${left === 3 ? 'as 3 etapas da aula' : `${left} ${plural(left, 'etapa', 'etapas')} da aula`}`,
  pesquisa: () => 'Fazer a pesquisa orientada',
  pratica: () => 'Fazer a atividade prática',
  questoes: (left: number) => `Responder ${left} ${plural(left, 'questão', 'questões')} do quiz`,
} as const

/** Texto do próximo objetivo e o destino do botão. */
export function describeObjective(o: Objective): ObjectiveView {
  switch (o.kind) {
    case 'step': {
      const m = modules[o.module]
      return {
        title: `${STEP_TEXT[o.step](o.left)} · módulo ${m.number}`,
        detail: `${m.title}${o.xp ? ` · +${formatNumber(o.xp)} XP` : ''}${o.started ? '' : ' · próximo módulo liberado'}`,
        to: `/modulo/${o.module}`,
        cta: 'Continuar',
      }
    }
    case 'boss':
      return {
        title: `Enfrentar o chefe do módulo ${modules[o.module].number}`,
        detail: `${modules[o.module].title} · fogueira acesa · +${o.xp} XP na primeira vitória`,
        to: `/trilha?chefe=${o.module}`,
        cta: 'Enfrentar',
      }
    case 'lab':
      return { title: 'Analisar o cenário do laboratório de injeção de prompt', detail: `+${o.xp} XP`, to: '/?secao=laboratorio', cta: 'Praticar' }
    case 'cases':
      return {
        title: `Resolver ${o.left} ${plural(o.left, 'cenário de correção', 'cenários de correção')}`,
        detail: `+${o.xp} XP por cenário`,
        to: '/?secao=cenarios',
        cta: 'Praticar',
      }
    case 'challenge':
      return {
        title: `Resolver o desafio de código: ${challengeById(o.id)?.title ?? 'desafio'}`,
        detail: `Laboratório de código · +${o.xp} XP`,
        to: `/desafios?desafio=${o.id}`,
        cta: 'Praticar',
      }
    case 'done':
      return { title: 'Trilha completa: todos os módulos, chefes e desafios concluídos', detail: 'Revise as conquistas ou repita desafios sempre que quiser.', to: '/conquistas', cta: 'Revisar' }
  }
}

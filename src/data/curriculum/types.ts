import type { CodeLanguage, FrameworkRef, Level } from '../types'

export type { FrameworkRef }

export type AreaId = 'web' | 'api' | 'ia' | 'mobile' | 'supply' | 'arq' | 'gov'

/** Onde o conteúdo se aplica. Serve de filtro, nunca de pontuação. */
export type Platform = 'web' | 'api' | 'android' | 'ios' | 'ia' | 'cicd' | 'geral'

export interface Area {
  id: AreaId
  title: string
  summary: string
  /** Chave do ícone (ver `AreaIcon`). */
  icon: 'globe' | 'server' | 'brain' | 'smartphone' | 'package' | 'blocks' | 'scale'
  modules: string[]
}

export interface CurriculumModule {
  id: string
  area: AreaId
  title: string
  summary: string
  /** Módulos recomendados antes deste. Só recomendam: o conteúdo nunca fica bloqueado por eles. */
  recommends: string[]
  subs: string[]
  /** Desafio integrador do módulo: missão, desafio ou projeto do modo Arquiteto que reúne os submódulos. `null` enquanto não há um. */
  integrator: { kind: 'challenge' | 'mission' | 'architect'; id: string } | null
}

export interface LessonExample {
  title: string
  language: CodeLanguage
  code: string[]
  /** O que observar no exemplo. */
  caption: string
}

/** Aula curta de um submódulo. O texto usa o formato leve do `RichText` (negrito e código). */
export interface Lesson {
  /** Situação de negócio ou história curta. */
  context: string
  /** Explicação curta, em parágrafos. */
  concept: string[]
  /** Aprofundamento opcional (botão "Aprofundar"). */
  deeper?: string[]
  example?: LessonExample
  /** Como verificar se o controle funciona. */
  validation: string
  /** Pares pergunta/resposta para revisão (viram flashcards do submódulo). */
  review?: { front: string; back: string }[]
  refs?: FrameworkRef[]
  /** Fontes externas para aprofundamento (o conteúdo principal funciona offline). */
  links?: { label: string; url: string }[]
}

export interface Submodule {
  id: string
  module: string
  area: AreaId
  title: string
  level: Level
  objective: string
  platforms: Platform[]
  /** Índice do módulo clássico cujas aulas e tarefas este submódulo usa. */
  legacy: number | null
  /** Só recomenda: submódulos a estudar antes. */
  recommends: string[]
}

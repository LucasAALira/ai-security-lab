export type Category = 'Fundamentos' | 'Ataques e defesa' | 'Governança' | 'Regulação'
export type Level = 'Básico' | 'Intermediário'
export type CompanySize = 'Pequena' | 'Média' | 'Grande'

/** Questão de múltipla escolha: `feedback[i]` explica a alternativa `i`. */
export interface Question {
  title: string
  options: string[]
  correct: number
  hint: string
  feedback: string[]
}

/** Módulo de estudo. `id` é a posição no array e a chave usada no progresso salvo. */
export interface StudyModule {
  id: number
  slug: string
  number: string
  title: string
  category: Category
  level: Level
  summary: string
  /** Resumos das três leituras: Compreender, Conectar e Aplicar. */
  parts: string[]
  practice: string
  research: string
  requires: string[]
  objectives: string[]
  /** Índices dos módulos recomendados antes deste. */
  prereqs: number[]
  questions: Question[]
}

export interface RemediationCase {
  id: string
  size: CompanySize
  title: string
  risk: string
  context: string
  signal: string
  goal: string
  options: string[]
  correct: number
  feedback: string[]
  solution: string[]
  test: string
  tradeoff: string
  residual: string
  source: string
}

export interface MateriaSection {
  id: 'compreender' | 'conectar' | 'aplicar'
  eyebrow: string
  heading: string
  /** HTML estático e confiável do repositório (validado por teste). */
  html: string
}

export interface Materia {
  slug: string
  moduleIndex: number
  number: string
  title: string
  summary: string
  note: string
  sections: MateriaSection[]
  research: { heading: string; html: string }
  bibliography: { heading: string; html: string }
}

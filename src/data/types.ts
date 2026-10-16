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

/** Desafio de código: identificar a(s) linha(s) vulnerável(is) e escolher a correção. */
export interface CodeChallenge {
  /** Identificador estável, usado no progresso salvo. Nunca renomeie um desafio já publicado. */
  id: string
  /** Módulo a que o desafio pertence; ele só abre quando o módulo está liberado na trilha. */
  module: number
  /** `vuln`: identificação de falhas em geral. `auth`: falhas de autorização. */
  kind: 'vuln' | 'auth'
  title: string
  /** Contexto curto: o que o código faz. */
  scenario: string
  file: string
  language: 'ts' | 'py'
  code: string[]
  /** Linhas (a partir de 0) que formam a falha principal: todas precisam ser marcadas. */
  vulnerable: number[]
  /** Linhas relacionadas também aceitas como corretas, sem serem obrigatórias. */
  also: number[]
  /** Linhas de uma falha opcional. Não são pedidas no enunciado; achá-las revela uma conquista secreta. */
  extra: number[]
  extraNote: string
  /** Por que algumas linhas parecidas não são o problema (mostrado após um erro na identificação). */
  notes: Record<number, string>
  /** Explicação mostrada depois de identificar a falha. */
  why: string
  fixes: { text: string; feedback: string }[]
  fix: number
  /** Duas dicas para identificar e uma para escolher a correção, em ordem crescente de ajuda. */
  hints: [string, string, string]
}

export interface Flashcard {
  /** `m{módulo}-c{n}`: o formato é validado pelo progresso. */
  id: string
  module: number
  front: string
  back: string
}

/** Um cenário do chefe: combina conhecimentos do módulo e exige uma única resposta certa. */
export interface BossQuestion {
  scenario: string
  options: string[]
  correct: number
  feedback: string[]
}

export interface Boss {
  module: number
  name: string
  epithet: string
  intro: string
  questions: BossQuestion[]
}

export type Category = 'Fundamentos' | 'Ataques e defesa' | 'Governança' | 'Regulação' | 'Engenharia reversa'
export type Level = 'Básico' | 'Intermediário' | 'Avançado'
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
  /** Módulo de acesso antecipado: o conteúdo só abre depois do desbloqueio (moedas ou pré-requisitos). */
  earlyAccess?: boolean
  /** Assuntos do módulo, mostrados como prévia enquanto ele está bloqueado. */
  topics?: string[]
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

export interface GlossaryEntry {
  term: string
  definition: string
}

export interface Materia {
  slug: string
  moduleIndex: number
  number: string
  title: string
  summary: string
  note: string
  sections: MateriaSection[]
  /** Pontos-chave para fixar depois da leitura. */
  recap?: string[]
  /** Termos da matéria, em ordem alfabética. */
  glossary?: GlossaryEntry[]
  research: { heading: string; html: string }
  bibliography: { heading: string; html: string }
}

/** Linguagens e formatos exibidos nos exemplos e desafios (rótulo e destaque simples; nada é executado). */
export type CodeLanguage = 'ts' | 'py' | 'yaml' | 'json' | 'http' | 'kt' | 'swift' | 'xml' | 'plist' | 'sql' | 'diff' | 'text'

/** Referência a um item de um framework, com a edição confirmada em `data/frameworks.ts`. */
export interface FrameworkRef {
  /** Chave em `frameworks` (por exemplo `owasp-top10`). */
  framework: string
  /** Identificador do item naquela edição (por exemplo `A01`, `API1`, `M9`, `MASVS-STORAGE-1`, `CWE-639`). */
  id: string
}

/** Comportamento de uma API em três momentos, com requisições e respostas sintéticas (nada aponta para sistemas reais). */
export interface ApiBehavior {
  /** Como a API deve se comportar. */
  expected: string[]
  /** Como a versão vulnerável se comporta diante do mesmo pedido. */
  vulnerable: string[]
  /** Como a versão corrigida responde. */
  fixed: string[]
}

/** Desafio de código: identificar a(s) linha(s) vulnerável(is) e escolher a correção. */
export interface CodeChallenge {
  /** Identificador estável, usado no progresso salvo. Nunca renomeie um desafio já publicado. */
  id: string
  /** Módulo clássico a que o desafio pertence; ele só abre quando o módulo está liberado na trilha. `null` nos desafios das áreas novas (sempre abertos). */
  module: number | null
  /** Submódulo do currículo (`data/curriculum/tree.ts`) em que o desafio aparece. */
  submodule: string
  /** `vuln`: identificação de falhas em geral. `auth`: falhas de autorização. */
  kind: 'vuln' | 'auth'
  level: Level
  /** Áreas e plataformas (`web`, `api`, `mobile`, `android`, `ios`, `ia`, `supply`...), para filtros e conquistas. */
  tags: string[]
  title: string
  /** Contexto curto: o que o código faz. */
  scenario: string
  /** Objetivo de aprendizagem em uma frase. */
  purpose?: string
  /** Fronteira de confiança: de onde vem o dado não confiável e onde ele é usado. */
  boundary?: string
  file: string
  language: CodeLanguage
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
  /** Alternativas de correção. O feedback de cada alternativa errada explica por que ela não basta. */
  fixes: { text: string; feedback: string }[]
  fix: number
  /** Código com a correção aplicada (mostrado depois da escolha certa). */
  fixedCode?: string[]
  /** Como verificar a correção: teste automatizado ou procedimento. */
  validation?: string
  /** Comportamento esperado, vulnerável e corrigido (desafios de API). */
  behaviors?: ApiBehavior
  frameworks?: FrameworkRef[]
  /** Desafio integrador do submódulo ou módulo. */
  integrator?: boolean
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

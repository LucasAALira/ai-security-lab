import type { ActivityContent, DecisionOption } from '../campaigns/types'
import type { CodeLanguage, FrameworkRef, Level } from '../types'

/* Treino de análise de código: um achado chega para triagem, o trecho está à vista e a pergunta é
   sempre a mesma — o alerta procede? Parte das amostras é de falso positivo de propósito: fechar um
   alerta com justificativa também é trabalho de análise. Depois do veredito vem a pergunta que a
   ferramenta não responde: o que fazer em seguida. */

/** Resultado da triagem de um achado. */
export type Verdict = 'procede' | 'falso-positivo' | 'falta-contexto'

/** As três opções de veredito, sempre na mesma ordem e com o mesmo texto. */
export const VERDICTS: { id: Verdict; label: string }[] = [
  { id: 'procede', label: 'O alerta procede: há falha explorável do jeito que o código está.' },
  { id: 'falso-positivo', label: 'Falso positivo: a regra disparou, mas este código não tem a falha apontada.' },
  { id: 'falta-contexto', label: 'Indeterminado: falta informação que o trecho não traz, e sem ela o veredito seria chute.' },
]

export interface Finding {
  /** Ferramenta fictícia que gerou o achado. */
  tool: string
  /** Identificador da regra, como apareceria no relatório. */
  rule: string
  severity: 'crítica' | 'alta' | 'média' | 'baixa'
  /** Linha apontada (a partir de 1, como a ferramenta mostraria). */
  line: number
  message: string
  /** Confiança declarada pela ferramenta. Ela erra: faz parte do treino. */
  confidence: 'alta' | 'média' | 'baixa'
}

export interface ReviewSample {
  id: string
  title: string
  /** O que a pessoa vai treinar nesta amostra, em uma frase. */
  subtitle: string
  area: 'web' | 'api' | 'mobile' | 'supply' | 'ia' | 'config'
  level: Level
  minutes: number
  finding: Finding
  /** O que o sistema faz e de onde vem a chamada: o contexto que a triagem precisa ter. */
  context: string[]
  file: string
  language: CodeLanguage
  code: string[]
  /** Evidência adicional liberada depois do veredito (configuração, rota, log, teste). */
  extra?: { title: string; language: CodeLanguage; lines: string[]; note?: string }
  verdict: Verdict
  /** Por que cada veredito está certo ou errado, na ordem de `VERDICTS`. */
  verdictFeedback: [string, string, string]
  verdictHints: [string, string, string]
  verdictExplain: string
  /** Sinais do trecho: quais sustentam o veredito e por quê (certos e distratores). */
  signals: { text: string; feedback: string }[]
  correctSignals: number[]
  signalPrompt: string
  signalHints: [string, string, string]
  signalExplain: string
  /** A pergunta que a ferramenta não responde: o que fazer em seguida. */
  next: {
    prompt: string
    options: DecisionOption[]
    hints: [string, string, string]
    explain: string
  }
  /** Atividade extra opcional, quando o caso pede (ordenar uma correção, classificar achados). */
  bonus?: ActivityContent
  closing: string
  review: { solution: string[]; residual: string; validation: string }
  frameworks?: FrameworkRef[]
  tags: string[]
}

import type { CodeLanguage, FrameworkRef, Level } from '../types'
import type { Quality } from '@/lib/progress'

/* Conteúdo das campanhas. Texto, gabarito e regras de pontuação ficam em camadas separadas:
   este arquivo descreve o conteúdo; `index.ts` extrai dele o gabarito (sem textos) que o motor
   de progresso usa, e a interface só desenha o que está aqui. Todos os dados são sintéticos. */

export type EvidenceKind = 'code' | 'table' | 'text' | 'diagram'

/** Um item examinável. É liberado por etapas: aparece quando o aluno chega à atividade `from`. */
export interface Evidence {
  id: string
  title: string
  kind: EvidenceKind
  /** Posição da atividade a partir da qual a evidência aparece (0 = desde o início). Depois de liberada, não some. */
  from: number
  /** Ramificação: só aparece quando a tentativa tem todas essas marcas (deixadas por decisões anteriores). */
  when?: string[]
  /** `code`: linhas e linguagem (log, diff, YAML, JSON...). */
  language?: CodeLanguage
  lines?: string[]
  /** `table`: cabeçalho e linhas. */
  head?: string[]
  rows?: string[][]
  /** `text`: parágrafos no formato leve do `RichText`. */
  paragraphs?: string[]
  /** `diagram`: componentes clicáveis e ligações. */
  nodes?: DiagramNode[]
  edges?: DiagramEdge[]
  /** O que observar nesta evidência (sem entregar a resposta). */
  note?: string
}

export interface DiagramNode {
  id: string
  label: string
  /** Coluna e linha na grade (0 a 5). */
  x: number
  y: number
  kind: 'cliente' | 'borda' | 'servico' | 'dados' | 'terceiro' | 'pipeline' | 'ia' | 'identidade'
  /** Descrição mostrada ao selecionar o componente. */
  detail: string
  /** Fronteira de confiança a que o componente pertence (por rótulo). */
  zone?: string
}

export interface DiagramEdge {
  from: string
  to: string
  label: string
}

interface Base {
  id: string
  title: string
  prompt: string
  /** Três dicas, da mais leve à mais direta. Nunca escondem evidência: só orientam o olhar. */
  hints: [string, string, string]
  /** Por que a resposta é essa (mostrado depois de responder). */
  explain: string
}

export interface DecisionOption {
  text: string
  quality: Quality
  flags?: string[]
  /** Por que esta opção é (ou não é) uma boa escolha, em linguagem específica ao caso. */
  feedback: string
  /** O que acontece na simulação por causa desta escolha (etapa Consequências). */
  consequence: string
}

export type ActivityContent =
  | (Base & { kind: 'decide'; options: DecisionOption[] })
  | (Base & { kind: 'adr'; options: DecisionOption[]; fields: { label: string; hint: string }[]; rubric: string[]; model: string[] })
  | (Base & { kind: 'multi'; variant: 'multi' | 'compare' | 'inspect'; options: { text: string; feedback: string }[]; correct: number[] })
  | (Base & { kind: 'order'; items: { text: string; why: string }[]; before: [number, number][] })
  | (Base & { kind: 'assign'; variant: 'classify' | 'match'; rows: { text: string; why: string }[]; choices: string[]; accept: number[][] })
  | (Base & { kind: 'budget'; unit: string; budget: number; risks: string[]; controls: { text: string; cost: number; covers: number[]; note: string }[]; critical: number[]; mandatory: number[] })
  /** As dicas e o gabarito vêm do desafio de código; aqui só ficam o enunciado e a explicação do papel dele na missão. */
  | (Omit<Base, 'hints'> & { kind: 'spot'; challenge: string })

export interface Reference {
  label: string
  /** Fonte externa para aprofundar (o conteúdo principal funciona sem ela). */
  url?: string
  framework?: FrameworkRef
  note?: string
}

export interface MissionContent {
  id: string
  campaign: string
  /** Posição na campanha, a partir de 1. */
  order: number
  title: string
  level: Level
  minutes: number
  /** Em linguagem simples: o que ajuda ter estudado antes. */
  prereqs: string
  objective: string
  /** Contexto curto da história (formato leve). */
  context: string[]
  /** O que será avaliado, em linguagem do aluno. */
  criteria: string[]
  evidence: Evidence[]
  activities: ActivityContent[]
  /** Marcas que tornam a tentativa "limpa" (contenção e preservação, por exemplo). */
  clean?: { require: string[]; forbid: string[] }
  /** Texto de fechamento por marca: o primeiro cujas marcas coincidem com a tentativa é mostrado. */
  closing: { when?: string[]; text: string }[]
  review: {
    /** Explicação completa da solução. */
    solution: string[]
    residual: string
    validation: string
  }
  deeper?: string[]
  refs: Reference[]
  /** Conquistas ligadas a esta missão (ids), mostradas no fim. */
  medals: string[]
  tags: string[]
}

export interface CampaignContent {
  id: string
  title: string
  /** Empresa fictícia da história. */
  company: string
  tagline: string
  summary: string
  area: string
  requires: string[]
  missions: MissionContent[]
}

/** Dossiê de caso real. As três camadas ficam em campos separados e rotuladas na interface. */
export interface DossierContent {
  id: string
  title: string
  subtitle: string
  /** Quando o incidente ocorreu e quando foi divulgado, como as fontes consultadas informam. */
  incidentDate: string
  publishedDate: string
  /** Data em que o dossiê foi consultado e revisado. */
  reviewed: string
  /** Fatos documentados (com fonte). */
  summary: string[]
  timeline: { when: string; what: string; source: number }[]
  /** Componente comprometido e relação de confiança explorada. */
  component: { name: string; trust: string }
  impact: string[]
  uncertainties: string[]
  /** Análise educacional (interpretação nossa, rotulada como tal). */
  analysis: string[]
  lessons: string[]
  /** Simulação fictícia inspirada no caso. */
  exercise: { intro: string; evidence: Evidence[]; activities: ActivityContent[] }
  sources: { label: string; url: string; kind: 'primária' | 'secundária' }[]
  /** Itens de frameworks que o caso ilustra (só correspondências reais, conferidas em `data/frameworks.ts`). */
  frameworks?: FrameworkRef[]
  tags: string[]
  /** Aviso, quando o caso não envolve IA ou quando faltam dados. */
  notice?: string
}

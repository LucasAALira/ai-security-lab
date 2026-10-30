import type { MissionSpec } from '@/lib/progress'
import { toActivitySpec } from '../campaigns'
import { refLabel } from '../frameworks'
import type { ActivityContent, MissionContent } from '../campaigns/types'
import { chaveNoCodigo } from './s06-chave-no-codigo'
import { corsDoPainel } from './s11-cors-do-painel'
import { dependenciaComCve } from './s14-dependencia-com-cve'
import { downloadDoAnexo } from './s09-download-do-anexo'
import { filtroDeRelatorio } from './s02-filtro-de-relatorio'
import { htmlDoEditor } from './s03-html-do-editor'
import { linkDoPerfil } from './s04-link-do-perfil'
import { modeloDoBucket } from './s10-modelo-do-bucket'
import { ordenacaoConcatenada } from './s01-ordenacao-concatenada'
import { reciboPorId } from './s05-recibo-por-id'
import { resumoDaPagina } from './s13-resumo-da-pagina'
import { telaExportada } from './s12-tela-exportada'
import { tokenNoTeste } from './s07-token-no-teste'
import { webhookDeEntrega } from './s08-webhook-de-entrega'
import { VERDICTS, type ReviewSample } from './types'

/* Treino de análise de código: ver `docs/COMO-ADICIONAR-CONTEUDO.md` ("Amostra de análise de código"). */
export const reviewSamples: ReviewSample[] = [
  ordenacaoConcatenada,
  filtroDeRelatorio,
  htmlDoEditor,
  linkDoPerfil,
  reciboPorId,
  chaveNoCodigo,
  tokenNoTeste,
  webhookDeEntrega,
  downloadDoAnexo,
  modeloDoBucket,
  corsDoPainel,
  telaExportada,
  resumoDaPagina,
  dependenciaComCve,
]

export const reviewById = (id: string): ReviewSample | undefined => reviewSamples.find((s) => s.id === id)

/** Rótulos das áreas, para o filtro da lista. */
export const REVIEW_AREAS: { id: ReviewSample['area']; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'api', label: 'APIs' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'supply', label: 'Cadeia de suprimentos' },
  { id: 'ia', label: 'IA' },
  { id: 'config', label: 'Configuração' },
]

export const verdictLabel = (v: ReviewSample['verdict']): string => (v === 'procede' ? 'Procede' : v === 'falso-positivo' ? 'Falso positivo' : 'Indeterminado')

/** As três etapas da triagem, no mesmo motor das missões: veredito, sinais e próximo passo. */
export function reviewActivities(s: ReviewSample): ActivityContent[] {
  const activities: ActivityContent[] = [
    {
      id: 'veredito',
      kind: 'multi',
      variant: 'compare',
      title: 'O alerta procede?',
      prompt: `Leia o achado e o trecho. **Qual é o veredito** desta triagem? Escolha uma única opção.`,
      options: VERDICTS.map((v, i) => ({ text: v.label, feedback: s.verdictFeedback[i] })),
      correct: [VERDICTS.findIndex((v) => v.id === s.verdict)],
      hints: s.verdictHints,
      explain: s.verdictExplain,
    },
    {
      id: 'sinais',
      kind: 'multi',
      variant: 'inspect',
      title: 'O que sustenta o veredito',
      prompt: s.signalPrompt,
      options: s.signals,
      correct: s.correctSignals,
      hints: s.signalHints,
      explain: s.signalExplain,
    },
    {
      id: 'proximo-passo',
      kind: 'decide',
      title: 'O que fazer em seguida',
      prompt: s.next.prompt,
      options: s.next.options,
      hints: s.next.hints,
      explain: s.next.explain,
    },
  ]
  return s.bonus ? [...activities, s.bonus] : activities
}

/** A amostra no formato das missões, para reaproveitar o mesmo motor e a mesma interface. */
export function reviewAsMission(s: ReviewSample): MissionContent {
  return {
    id: s.id,
    campaign: '',
    order: 1,
    title: s.title,
    level: s.level,
    minutes: s.minutes,
    prereqs: 'Nenhum pré-requisito: a amostra traz o contexto de que a triagem precisa.',
    objective: 'Decidir se o achado procede, apontar o que sustenta o veredito e escolher a conduta seguinte, com a justificativa que fica registrada.',
    context: s.context,
    criteria: [
      'Você separa a forma que a regra detectou da origem do valor que importa.',
      'Você sustenta o veredito com sinais do próprio trecho, sem supor o que não está lá.',
      'Você escolhe uma conduta que resolve o achado e deixa registro para quem vier depois.',
    ],
    evidence: [
      {
        id: 'achado',
        title: `Achado: ${s.finding.rule}`,
        kind: 'table',
        from: 0,
        head: ['Ferramenta', 'Severidade', 'Confiança', 'Linha', 'Mensagem'],
        rows: [[s.finding.tool, s.finding.severity, s.finding.confidence, String(s.finding.line), s.finding.message]],
        note: 'Severidade e confiança são declaradas pela ferramenta: elas descrevem a regra, não o seu código.',
      },
      {
        id: 'trecho',
        title: s.file,
        kind: 'code',
        from: 0,
        language: s.language,
        lines: s.code,
        note: `A linha apontada é a ${s.finding.line}. Leia o trecho inteiro antes de decidir.`,
      },
      ...(s.extra ? [{ id: 'apoio', title: s.extra.title, kind: 'code' as const, from: 1, language: s.extra.language, lines: s.extra.lines, note: s.extra.note }] : []),
    ],
    activities: reviewActivities(s),
    closing: [{ text: s.closing }],
    review: s.review,
    refs: (s.frameworks ?? []).map((framework) => ({ label: refLabel(framework), framework })),
    medals: ['triagem-certeira', 'mesa-de-escrutinio'],
    tags: s.tags,
  }
}

export const reviewSpecs: MissionSpec[] = reviewSamples.map((s) => ({
  id: s.id,
  kind: 'review',
  campaign: null,
  order: 1,
  activities: reviewActivities(s).map(toActivitySpec),
  clean: { require: [], forbid: [] },
  tags: s.tags,
}))

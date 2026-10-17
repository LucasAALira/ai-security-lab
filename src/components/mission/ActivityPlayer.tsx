import type { ActivityContent } from '@/data/campaigns/types'
import type { ActivitySpec } from '@/lib/progress'
import { AdrActivity, DecideActivity, MultiActivity } from './players-choice'
import { AssignActivity, BudgetActivity, OrderActivity, SpotActivity } from './players-structured'

interface Props {
  missionId: string
  content: ActivityContent
  spec: ActivitySpec
  index: number
  total: number
}

/** Escolhe o jogador do formato. O conteúdo e o gabarito vêm da mesma fonte, então os tipos coincidem. */
export function ActivityPlayer({ missionId, content, spec, index, total }: Props) {
  const common = { missionId, index, total }
  if (content.kind === 'decide' && spec.kind === 'decide') return <DecideActivity {...common} content={content} spec={spec} />
  if (content.kind === 'adr' && spec.kind === 'adr') return <AdrActivity {...common} content={content} spec={spec} />
  if (content.kind === 'multi' && spec.kind === 'multi') return <MultiActivity {...common} content={content} spec={spec} />
  if (content.kind === 'order' && spec.kind === 'order') return <OrderActivity {...common} content={content} spec={spec} />
  if (content.kind === 'assign' && spec.kind === 'assign') return <AssignActivity {...common} content={content} spec={spec} />
  if (content.kind === 'budget' && spec.kind === 'budget') return <BudgetActivity {...common} content={content} spec={spec} />
  if (content.kind === 'spot' && spec.kind === 'spot') return <SpotActivity {...common} content={content} spec={spec} />
  return null
}

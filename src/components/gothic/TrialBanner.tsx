import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { architectById } from '@/data/architect'
import { dossierById, missionContentById } from '@/data/campaigns'
import { challengeById } from '@/data/challenges'
import { modules } from '@/data/modules'
import type { ApplyResult } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

/** Quanto tempo a faixa fica na tela. Ela não bloqueia nada: é só uma celebração por cima. */
export const BANNER_MS = 2600

export interface Trial {
  title: string
  detail: string
}

/**
 * A faixa só celebra uma vitória nova: o mesmo resultado precisa render XP agora. Repetir um desafio,
 * uma missão ou um chefe já vencido não mostra a faixa de novo (nem conquista antiga, nem erro escondido).
 */
export function trialOf(result: ApplyResult): Trial | null {
  if (!result.changed) return null
  const gainedXp = result.events.some((e) => e.kind === 'xp' && e.amount > 0)
  if (!gainedXp) return null
  for (const e of result.events) {
    if (e.kind === 'challenge' && e.phase === 'done' && e.first) return { title: 'Provação superada', detail: challengeById(e.challenge)?.title ?? 'Desafio de código' }
    if (e.kind === 'boss' && e.first) return { title: 'Provação superada', detail: `Chefe do módulo ${modules[e.module]?.number ?? e.module + 1}` }
    if (e.kind === 'mission' && e.passed) {
      const m = missionContentById(e.mission)
      const d = m ? undefined : dossierById(e.mission)
      return { title: 'Provação superada', detail: m ? `Missão: ${m.title}` : d ? `Simulação: ${d.exercise.title}` : 'Missão concluída' }
    }
    if (e.kind === 'architect' && e.passed && e.first) return { title: 'Provação superada', detail: `Revisão de arquitetura: ${architectById(e.project)?.title ?? e.project}` }
  }
  return null
}

/** Faixa solene "Provação superada". Decorativa para o leitor de tela: o aviso em texto já sai pelo toast. */
export function TrialBanner() {
  const { store } = useProgress()
  const [trial, setTrial] = useState<(Trial & { n: number }) | null>(null)

  useEffect(() => {
    let n = 0
    return store.onResult((result) => {
      const t = trialOf(result)
      if (t) setTrial({ ...t, n: ++n })
    })
  }, [store])

  useEffect(() => {
    if (!trial) return
    const timer = window.setTimeout(() => setTrial(null), BANNER_MS)
    return () => window.clearTimeout(timer)
  }, [trial])

  if (!trial) return null
  /* Vai direto ao `body`: dentro da árvore da página, qualquer ancestral com transform ou filtro
     criaria um contexto de empilhamento e a faixa sumiria atrás de um diálogo aberto (o chefe). */
  return createPortal(
    <div key={trial.n} className="gx-banner" aria-hidden="true" data-testid="trial-banner">
      <div className="relative">
        <p className="gx-banner-text uppercase">
          {trial.title}
          <span className="gx-banner-text gx-banner-ghost uppercase">{trial.title}</span>
        </p>
        <p className="gx-banner-sub text-center">{trial.detail}</p>
      </div>
    </div>,
    document.body,
  )
}

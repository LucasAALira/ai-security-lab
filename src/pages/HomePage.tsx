import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AreasSection } from '@/components/home/AreasSection'
import { DailyPanel } from '@/components/home/DailyPanel'
import { RecentRelics } from '@/components/home/RecentRelics'
import { SanctuaryHero } from '@/components/home/SanctuaryHero'
import { LabSection } from '@/components/home/LabSection'
import { LibrarySection } from '@/components/home/LibrarySection'
import { ModulesSection, type ModuleFilter } from '@/components/home/ModulesSection'
import { PentestSection } from '@/components/home/PentestSection'
import { RemediationSection } from '@/components/home/RemediationSection'
import { RequirementsSection } from '@/components/home/RequirementsSection'
import { StatsRow } from '@/components/home/StatsRow'
import { TasksSection } from '@/components/home/TasksSection'
import { remediationCases } from '@/data/scenarios'
import type { CompanySize } from '@/data/types'
import { useDocumentTitle } from '@/lib/use-document-title'

/** Seções que os links de navegação (`/?secao=...`) sabem alcançar. */
export const HOME_SECTIONS = ['inicio', 'areas', 'hoje', 'relicario', 'tarefas', 'medalhas', 'requisitos', 'trilhas', 'laboratorio', 'cenarios', 'pentest', 'fontes'] as const

export function HomePage() {
  useDocumentTitle()
  const { search, key } = useLocation()
  const [filter, setFilter] = useState<ModuleFilter>('Todos')
  const [size, setSize] = useState<CompanySize>('Pequena')
  const [activeCase, setActiveCase] = useState<number | null>(null)
  const [reveal, setReveal] = useState(0)

  // `/?secao=trilhas` rola até a seção; o hash é do roteador, então não dá para usar âncoras.
  useEffect(() => {
    const id = new URLSearchParams(search).get('secao')
    if (!id || !(HOME_SECTIONS as readonly string[]).includes(id)) return
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [search, key])

  function openCase(index: number) {
    setSize(remediationCases[index].size)
    setActiveCase(index)
    setReveal((n) => n + 1)
  }

  return (
    <>
      <SanctuaryHero />
      <AreasSection />
      <DailyPanel />
      <RecentRelics />
      <StatsRow />
      <TasksSection onPickTrack={(track) => setFilter(track as ModuleFilter)} onOpenCase={openCase} />
      <RequirementsSection />
      <ModulesSection filter={filter} onFilterChange={setFilter} />
      <LabSection />
      <RemediationSection
        size={size}
        onSizeChange={(s) => {
          setSize(s)
          setActiveCase(null)
        }}
        active={activeCase}
        onActiveChange={openCase}
        revealToken={reveal}
      />
      <PentestSection />
      <LibrarySection />
      <Outlet />
    </>
  )
}

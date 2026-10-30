import { lazy, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import { LessonRoute } from '@/components/lesson/LessonRoute'
import { AppSplash } from '@/components/gothic/AppSplash'
import { Shell } from '@/components/layout/Shell'
import { setupBackButton } from '@/lib/native'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// As outras páginas (com o texto das matérias, a revisão e a loja) só são baixadas quando abertas.
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })))
const TrailPage = lazy(() => import('@/pages/TrailPage').then((m) => ({ default: m.TrailPage })))
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage').then((m) => ({ default: m.ChallengesPage })))
const MateriaPage = lazy(() => import('@/pages/MateriaPage').then((m) => ({ default: m.MateriaPage })))
const ReferencesPage = lazy(() => import('@/pages/ReferencesPage').then((m) => ({ default: m.ReferencesPage })))
const ReviewPage = lazy(() => import('@/pages/ReviewPage').then((m) => ({ default: m.ReviewPage })))
const UpcomingPage = lazy(() => import('@/pages/UpcomingPage').then((m) => ({ default: m.UpcomingPage })))
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage').then((m) => ({ default: m.CampaignsPage })))
const CampaignPage = lazy(() => import('@/pages/CampaignPage').then((m) => ({ default: m.CampaignPage })))
const MissionPage = lazy(() => import('@/pages/MissionPage').then((m) => ({ default: m.MissionPage })))
const CodeReviewPage = lazy(() => import('@/pages/CodeReviewPage').then((m) => ({ default: m.CodeReviewPage })))
const CodeReviewSamplePage = lazy(() => import('@/pages/CodeReviewSamplePage').then((m) => ({ default: m.CodeReviewSamplePage })))
const DossiersPage = lazy(() => import('@/pages/DossiersPage').then((m) => ({ default: m.DossiersPage })))
const DossierPage = lazy(() => import('@/pages/DossierPage').then((m) => ({ default: m.DossierPage })))
const DossierSimulationPage = lazy(() => import('@/pages/DossierSimulationPage').then((m) => ({ default: m.DossierSimulationPage })))
const CoveragePage = lazy(() => import('@/pages/CoveragePage').then((m) => ({ default: m.CoveragePage })))
const AreasPage = lazy(() => import('@/pages/AreasPage').then((m) => ({ default: m.AreasPage })))
const AreaPage = lazy(() => import('@/pages/AreaPage').then((m) => ({ default: m.AreaPage })))
const ModulePage = lazy(() => import('@/pages/ModulePage').then((m) => ({ default: m.ModulePage })))
const SubmodulePage = lazy(() => import('@/pages/SubmodulePage').then((m) => ({ default: m.SubmodulePage })))
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then((m) => ({ default: m.ExplorePage })))
const ArchitectListPage = lazy(() => import('@/pages/ArchitectListPage').then((m) => ({ default: m.ArchitectListPage })))
const ArchitectProjectPage = lazy(() => import('@/pages/ArchitectProjectPage').then((m) => ({ default: m.ArchitectProjectPage })))
const TrophyRoomPage = lazy(() => import('@/pages/TrophyRoomPage').then(m => ({ default: m.TrophyRoomPage })))
const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))

/** Rotas em hash (`#/materias/...`): o site funciona aberto de qualquer pasta ou servidor estático. */
export function App() {
  // No app Android, o botão Voltar fecha diálogos e volta páginas (no navegador, não faz nada).
  useEffect(() => setupBackButton(), [])
  return (
    <HashRouter>
      <AppSplash />
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />}>
            <Route path="modulo/:n" element={<LessonRoute />} />
          </Route>
          <Route path="trilha" element={<TrailPage />}>
            <Route path="modulo/:n" element={<LessonRoute />} />
          </Route>
          <Route path="areas" element={<AreasPage />} />
          <Route path="areas/:area" element={<AreaPage />} />
          <Route path="areas/:area/:module" element={<ModulePage />} />
          <Route path="areas/:area/:module/:sub" element={<SubmodulePage />} />
          <Route path="explorar" element={<ExplorePage />} />
          <Route path="desafios" element={<ChallengesPage />} />
          <Route path="campanhas" element={<CampaignsPage />} />
          <Route path="campanhas/:campaign" element={<CampaignPage />} />
          <Route path="campanhas/:campaign/:mission" element={<MissionPage />} />
          <Route path="arquiteto" element={<ArchitectListPage />} />
          <Route path="arquiteto/:project" element={<ArchitectProjectPage />} />
          <Route path="analise" element={<CodeReviewPage />} />
          <Route path="analise/:amostra" element={<CodeReviewSamplePage />} />
          <Route path="casos" element={<DossiersPage />} />
          <Route path="casos/:dossier" element={<DossierPage />} />
          <Route path="casos/:dossier/simulacao" element={<DossierSimulationPage />} />
          <Route path="conquistas" element={<AchievementsPage />} />
          <Route path="materias/:slug" element={<MateriaPage />} />
          <Route path="revisao" element={<ReviewPage />} />
          <Route path="sala-de-trofeus" element={<TrophyRoomPage />} />
          <Route path="loja" element={<ShopPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="em-breve" element={<UpcomingPage />} />
          <Route path="cobertura" element={<CoveragePage />} />
          <Route path="referencias" element={<ReferencesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

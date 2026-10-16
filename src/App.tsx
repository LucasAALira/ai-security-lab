import { lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import { LessonRoute } from '@/components/lesson/LessonRoute'
import { Shell } from '@/components/layout/Shell'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// As outras páginas (com o texto das matérias, a revisão e a loja) só são baixadas quando abertas.
const MateriaPage = lazy(() => import('@/pages/MateriaPage').then((m) => ({ default: m.MateriaPage })))
const ReferencesPage = lazy(() => import('@/pages/ReferencesPage').then((m) => ({ default: m.ReferencesPage })))
const ReviewPage = lazy(() => import('@/pages/ReviewPage').then((m) => ({ default: m.ReviewPage })))
const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })))

/** Rotas em hash (`#/materias/...`): o site funciona aberto de qualquer pasta ou servidor estático. */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />}>
            <Route path="modulo/:n" element={<LessonRoute />} />
          </Route>
          <Route path="materias/:slug" element={<MateriaPage />} />
          <Route path="revisao" element={<ReviewPage />} />
          <Route path="loja" element={<ShopPage />} />
          <Route path="referencias" element={<ReferencesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

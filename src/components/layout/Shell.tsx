import { SanctuaryPlayer } from '@/components/audio/SanctuaryPlayer'
import { Suspense, useEffect, useRef, type RefObject } from 'react'
import { Outlet, useLocation } from 'react-router'
import { NextObjective } from '@/components/gamification/NextObjective'
import { LoadingSigil, PageVeil } from '@/components/gothic/PageVeil'
import { TrialBanner } from '@/components/gothic/TrialBanner'
import { useProgress } from '@/state/ProgressProvider'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/** O tema ativo (comprado na loja) vai para o `data-theme` do documento. */
function useApplyTheme() {
  const { state } = useProgress()
  useEffect(() => {
    document.documentElement.dataset.theme = state.shop.theme
  }, [state.shop.theme])
}

/** A página (inicial ou trilha) e o módulo aberto sobre ela contam como uma só. */
const pageOf = (pathname: string) => (pathname.startsWith('/modulo/') ? '/' : pathname.startsWith('/trilha') ? '/trilha' : pathname)

/** Entre páginas volta ao topo e leva o foco ao conteúdo, para o teclado e o leitor de tela recomeçarem pela página nova. */
function usePageChange(main: RefObject<HTMLElement | null>) {
  const { pathname, search } = useLocation()
  const page = pageOf(pathname)
  const hasSection = new URLSearchParams(search).has('secao')
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!hasSection) {
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
    }
    // só a troca de página importa; o parâmetro `secao` é tratado por quem rola até a seção
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
}

export function Shell() {
  useApplyTheme()
  const main = useRef<HTMLElement>(null)
  usePageChange(main)
  const page = pageOf(useLocation().pathname)
  // Estas páginas já mostram o objetivo em destaque no próprio conteúdo.
  const showObjective = !['/', '/conquistas', '/trilha', '/sala-de-trofeus'].includes(page)
  return (
    <div className="min-h-screen">
      <button
        type="button"
        className="gx-btn gx-btn-plate sr-only z-[80] px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        onClick={() => main.current?.focus()}
      >
        Ir para o conteúdo
      </button>
      <Sidebar />
      <div className="px-5 md:ml-[205px] md:px-7 min-[1151px]:ml-[245px] min-[1151px]:px-[52px] min-[1450px]:px-[75px]">
        <TopBar />
        <SanctuaryPlayer />
        {showObjective ? <NextObjective className="mx-auto max-w-[1400px]" /> : null}
        <main id="conteudo" ref={main} tabIndex={-1} className="mx-auto max-w-[1400px] pt-0 outline-none">
          <div key={page} className="gx-page-enter">
            <Suspense fallback={<LoadingSigil />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
      <PageVeil page={page} />
      <TrialBanner />
    </div>
  )
}

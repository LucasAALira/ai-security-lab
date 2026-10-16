import { motion } from 'motion/react'
import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
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

/** A página inicial e o módulo aberto sobre ela contam como uma só. */
const pageOf = (pathname: string) => (pathname.startsWith('/modulo/') ? '/' : pathname)

/** Entre páginas volta ao topo. */
function useScrollToTopOnPageChange() {
  const { pathname, search } = useLocation()
  const page = pageOf(pathname)
  const hasSection = new URLSearchParams(search).has('secao')
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!hasSection) window.scrollTo(0, 0)
    // só a troca de página importa; o parâmetro `secao` é tratado por quem rola até a seção
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
}

export function Shell() {
  useApplyTheme()
  useScrollToTopOnPageChange()
  const main = useRef<HTMLElement>(null)
  const page = pageOf(useLocation().pathname)
  return (
    <div className="min-h-screen">
      <button
        type="button"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        onClick={() => main.current?.focus()}
      >
        Ir para o conteúdo
      </button>
      <Sidebar />
      <div className="px-5 md:ml-[205px] md:px-7 min-[1151px]:ml-[245px] min-[1151px]:px-[52px] min-[1450px]:px-[75px]">
        <TopBar />
        <main id="conteudo" ref={main} tabIndex={-1} className="mx-auto max-w-[1400px] pt-0 outline-none">
          <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <Suspense fallback={<p role="status" className="py-24 text-center text-sm text-muted-foreground">Carregando…</p>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

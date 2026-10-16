import { useEffect } from 'react'

export const SITE_NAME = 'AI Security Lab'

/** Título da aba: "Página | AI Security Lab". Sem argumento, só o nome do site. */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | ${SITE_NAME}` : `${SITE_NAME} | Central de estudos`
  }, [page])
}

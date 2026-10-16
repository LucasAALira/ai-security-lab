import { useEffect, useState } from 'react'
import { TrustedHtml } from '@/components/common/TrustedHtml'

/** Texto completo de uma parte da matéria. As matérias são pesadas, então só são baixadas quando
 *  alguém abre o "Saiba mais" (o conteúdo do acordeão só existe enquanto está aberto). */
export function SaibaMais({ slug, section }: { slug: string; section: number }) {
  const [html, setHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    import('@/data/materias')
      .then((m) => alive && setHtml(m.materiaBySlug(slug)?.sections[section]?.html ?? ''))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [slug, section])

  if (failed) return <p className="text-sm text-muted-foreground">Não foi possível carregar o texto completo agora. Use o link “Ler matéria completa”.</p>
  if (html === null) return <p role="status" className="text-sm text-muted-foreground">Carregando…</p>
  return <TrustedHtml html={html} className="study-prose is-compact" />
}

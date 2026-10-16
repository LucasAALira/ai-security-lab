import { useEffect, useState } from 'react'
import type { Materia } from '@/data/types'

/** Resumo em pontos-chave ou glossário de uma matéria. Como o "Saiba mais", só baixa o texto quando o
 *  acordeão é aberto (o conteúdo dele só existe enquanto está aberto). */
export function MateriaExtras({ slug, kind }: { slug: string; kind: 'glossary' | 'recap' }) {
  const [materia, setMateria] = useState<Materia | null | undefined>(undefined)

  useEffect(() => {
    let alive = true
    import('@/data/materias')
      .then((m) => alive && setMateria(m.materiaBySlug(slug) ?? null))
      .catch(() => alive && setMateria(null))
    return () => {
      alive = false
    }
  }, [slug])

  if (materia === undefined) return <p role="status" className="text-sm text-muted-foreground">Carregando…</p>
  if (kind === 'recap') {
    return materia?.recap?.length ? (
      <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-foreground/85">
        {materia.recap.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">Este módulo ainda não tem resumo.</p>
    )
  }
  return materia?.glossary?.length ? (
    <dl className="grid gap-2.5">
      {materia.glossary.map((g) => (
        <div key={g.term}>
          <dt className="text-[13px] font-semibold text-primary">{g.term}</dt>
          <dd className="mt-0.5 text-[13px] leading-relaxed text-foreground/80">{g.definition}</dd>
        </div>
      ))}
    </dl>
  ) : (
    <p className="text-sm text-muted-foreground">Este módulo ainda não tem glossário.</p>
  )
}

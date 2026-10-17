import { Link } from 'react-router'

export interface Crumb {
  label: string
  /** Sem destino = página atual. */
  to?: string
}

/** Trilha de navegação (Área > Módulo > Submódulo etc.). A última entrada é a página atual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Você está em" className="mb-4 text-xs text-muted-foreground">
      <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex gap-1.5">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {c.to ? (
              <Link to={c.to} className="underline underline-offset-2 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

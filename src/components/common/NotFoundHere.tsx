import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

/** Página de erro de um endereço que não existe, com o caminho de volta. */
export function NotFoundHere({ title, back, to }: { title: string; back: string; to: string }) {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Volte e escolha pela lista.</p>
      <Button asChild>
        <Link to={to}>{back}</Link>
      </Button>
    </div>
  )
}


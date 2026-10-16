import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/lib/use-document-title'

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada')
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">ERRO 404</div>
      <h1 className="my-4 text-3xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="mb-6 text-sm text-muted-foreground">O endereço pode ter mudado. Volte para a central de estudos e escolha uma matéria ou um módulo.</p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  )
}

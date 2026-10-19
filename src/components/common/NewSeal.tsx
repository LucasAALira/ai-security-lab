import { cn } from '@/lib/utils'

/** Selo de novidade: losango de linha fina em ouro anodizado com a palavra "Novo".
 *  O texto acompanha o selo, então a informação nunca depende só da cor ou da forma. */
export function NewSeal({ label = 'Novo', title, className }: { label?: string; title?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 border border-[color-mix(in_oklab,var(--gold-anodized)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold-anodized)_12%,transparent)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--gold-anodized)] uppercase',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rotate-45 bg-[var(--gold-anodized)]" />
      {label}
      {title ? <span className="sr-only">: {title}</span> : null}
    </span>
  )
}

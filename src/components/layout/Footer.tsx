import { LogoMark } from '@/components/gothic/PageVeil'

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--stone-line)] py-7 text-xs text-foreground/75">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2">
          <LogoMark className="!size-7 !animate-none" />
          <span className="gx-brand text-[13px]">AI Security Lab</span>
        </span>
        <span className="text-muted-foreground">Conteúdo de apoio ao estudo · Referências consultadas em 15/10/2026</span>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        OWASP Top 10: base didática 2025. Consulte o projeto para novas edições. Regulação: valide a aplicação e os prazos nas fontes oficiais.
      </p>
    </footer>
  )
}

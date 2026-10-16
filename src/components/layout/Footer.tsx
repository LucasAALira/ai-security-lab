export function Footer() {
  return (
    <footer className="border-t border-border py-7 text-[11px] tracking-[1px] text-foreground/70">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <img src="./assets/dragon-lock.png" alt="" width={24} height={28} className="h-7 w-6 object-contain" />
          AI SECURITY LAB
        </span>
        <span className="tracking-normal text-muted-foreground">Conteúdo de apoio ao estudo · Referências consultadas em 15/10/2026</span>
      </div>
      <p className="mt-2 text-[10px] tracking-normal text-muted-foreground">
        OWASP Top 10: base didática 2025. Consulte o projeto para novas edições. Regulação: valide a aplicação e os prazos nas fontes oficiais.
      </p>
    </footer>
  )
}

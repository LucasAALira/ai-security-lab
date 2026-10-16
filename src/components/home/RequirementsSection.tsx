export function RequirementsSection() {
  return (
    <section id="requisitos" aria-labelledby="requisitos-titulo" className="mb-14 border-t border-tint-line pt-6">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-primary">ANTES DE COMEÇAR</div>
      <h2 id="requisitos-titulo" className="my-3 text-[26px] leading-tight font-medium tracking-tight sm:text-3xl">
        Pré-requisitos educacionais
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Não é exigido diploma ou certificação. Para aproveitar a trilha, revise os fundamentos abaixo. As recomendações por módulo ajudam a escolher a ordem; o acesso é livre.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Group title="Fundamentos técnicos" items={['Requisições HTTP, APIs e fluxo de dados.', 'Autenticação, autorização e menor privilégio.', 'LLM, contexto, RAG e chamadas de ferramentas.']} />
        <Group title="Risco e privacidade" items={['Ameaça, impacto, controle e risco residual.', 'Dados pessoais e dados pessoais sensíveis.', 'Diferença entre lei, framework e norma de gestão.']} />
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Ordem sugerida:</strong> OWASP → Prompt injection → ATLAS → Red teaming. Em paralelo: NIST AI RMF → ISO/IEC 42001 e AI Act; LGPD pode ser estudada desde o início.
      </p>
    </section>
  )
}

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-tint p-5.5">
      <h3 className="mb-2.5 text-[15px] font-semibold text-primary">{title}</h3>
      <ul className="m-0 list-disc space-y-1.5 pl-5 text-[13px] text-foreground/75">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

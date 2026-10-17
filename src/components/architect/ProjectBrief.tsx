import { RichParagraphs } from '@/components/rich/RichText'
import type { ArchitectProject } from '@/data/architect'

/** Etapa 1: o projeto como foi entregue (requisitos, perfis, serviços externos, restrições e fluxos). */
export function ProjectBrief({ project: p }: { project: ArchitectProject }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <RichParagraphs texts={p.context} className="text-[13px] leading-relaxed" />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        <section aria-labelledby="req-func" className="rounded-xl border border-border bg-card p-4">
          <h3 id="req-func" className="text-sm font-semibold">Requisitos funcionais</h3>
          <ul className="mt-2 grid gap-1 pl-4 text-[13px] leading-relaxed">
            {p.requirements.functional.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="req-nf" className="rounded-xl border border-border bg-card p-4">
          <h3 id="req-nf" className="text-sm font-semibold">Requisitos não funcionais</h3>
          <ul className="mt-2 grid gap-1 pl-4 text-[13px] leading-relaxed">
            {p.requirements.nonFunctional.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="perfis" className="rounded-xl border border-border bg-card p-4">
          <h3 id="perfis" className="text-sm font-semibold">Perfis de acesso</h3>
          <dl className="mt-2 grid gap-1.5 text-[13px]">
            {p.profiles.map((pr) => (
              <div key={pr.name}>
                <dt className="font-medium">{pr.name}</dt>
                <dd className="m-0 text-muted-foreground">{pr.access}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="externos" className="rounded-xl border border-border bg-card p-4">
          <h3 id="externos" className="text-sm font-semibold">Serviços externos e dependências</h3>
          <dl className="mt-2 grid gap-1.5 text-[13px]">
            {p.externals.map((e) => (
              <div key={e.name}>
                <dt className="font-medium">{e.name}</dt>
                <dd className="m-0 text-muted-foreground">{e.note}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section aria-labelledby="restricoes" className="rounded-xl border border-tint-line bg-tint-strong p-4">
        <h3 id="restricoes" className="text-sm font-semibold">Restrições operacionais</h3>
        <ul className="mt-2 grid gap-1 pl-4 text-[13px] leading-relaxed">
          {p.constraints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fluxos" className="rounded-xl border border-border bg-card p-4">
        <h3 id="fluxos" className="text-sm font-semibold">Fluxos de dados e fronteiras de confiança</h3>
        <div className="mt-2 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Fluxos de dados (rolável)">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
            <caption className="sr-only">Origem, destino, dados e se o fluxo cruza uma fronteira de confiança</caption>
            <thead className="bg-muted/40 text-xs">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">De</th>
                <th scope="col" className="px-3 py-2 font-medium">Para</th>
                <th scope="col" className="px-3 py-2 font-medium">Dados</th>
                <th scope="col" className="px-3 py-2 font-medium">Cruza fronteira?</th>
              </tr>
            </thead>
            <tbody>
              {p.flows.map((f) => (
                <tr key={`${f.from}-${f.to}`} className="border-t border-border align-top">
                  <td className="px-3 py-2">{f.from}</td>
                  <td className="px-3 py-2">{f.to}</td>
                  <td className="px-3 py-2 text-muted-foreground">{f.data}</td>
                  <td className="px-3 py-2">{f.boundary ? 'sim' : 'não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

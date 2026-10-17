import { BookOpenCheck, CheckCircle2, ShieldCheck } from 'lucide-react'
import { CodeBlock } from '@/components/mission/CodeBlock'
import { RichParagraphs, RichText } from '@/components/rich/RichText'
import type { Lesson } from '@/data/curriculum'
import { refLabel, resolveRef } from '@/data/frameworks'

/** Corpo de uma aula curta: situação, conceito, exemplo, como verificar, revisão e fontes. */
export function LessonBody({ lesson }: { lesson: Lesson }) {
  const refs = (lesson.refs ?? []).filter((r) => resolveRef(r))
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="rounded-lg border border-tint-line bg-tint p-3.5">
        <h3 className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Situação</h3>
        <RichText text={lesson.context} className="mt-1 text-[14px] leading-relaxed" />
      </div>

      <div>
        <h3 className="text-sm font-semibold">Conceito</h3>
        <div className="mt-2">
          <RichParagraphs texts={lesson.concept} className="text-[14px] leading-relaxed" />
        </div>
      </div>

      {lesson.example ? (
        <div>
          <h3 className="text-sm font-semibold">Exemplo</h3>
          <CodeBlock lines={lesson.example.code} language={lesson.example.language} title={lesson.example.title} className="mt-2" />
          <RichText text={lesson.example.caption} className="mt-2 text-[13px] leading-relaxed text-muted-foreground" />
        </div>
      ) : null}

      <div className="rounded-lg border border-border p-3.5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Como verificar que funciona
        </h3>
        <RichText text={lesson.validation} className="mt-1.5 text-[13px] leading-relaxed" />
      </div>

      {lesson.deeper?.length ? (
        <details className="rounded-lg border border-border p-3.5 text-[13px]">
          <summary className="cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Aprofundar</summary>
          <div className="mt-2">
            <RichParagraphs texts={lesson.deeper} className="leading-relaxed" />
          </div>
        </details>
      ) : null}

      {lesson.review?.length ? (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" /> Teste-se
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Responda de cabeça e abra para conferir. Não vale XP: serve para fixar.</p>
          <ul className="mt-2 grid list-none gap-2 p-0">
            {lesson.review.map((r, i) => (
              <li key={i}>
                <details className="rounded-lg border border-border p-3 text-[13px]">
                  <summary className="cursor-pointer leading-relaxed font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                    <RichText as="span" text={r.front} />
                  </summary>
                  <RichText text={r.back} className="mt-2 leading-relaxed text-muted-foreground" />
                </details>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {refs.length || lesson.links?.length ? (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BookOpenCheck className="size-4 text-primary" aria-hidden="true" /> Referências
          </h3>
          <ul className="mt-2 grid gap-1 pl-5 text-[13px]">
            {refs.map((r) => (
              <li key={`${r.framework}-${r.id}`}>
                <a href={resolveRef(r)!.url} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2">
                  {refLabel(r)}
                </a>
              </li>
            ))}
            {(lesson.links ?? []).map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer noopener" className="text-primary underline underline-offset-2">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Os links levam a fontes externas (precisam de internet); a aula funciona offline.</p>
        </div>
      ) : null}
    </div>
  )
}

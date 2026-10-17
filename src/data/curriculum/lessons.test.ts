import { describe, expect, it } from 'vitest'
import { termsIn } from '@/components/rich/rich-parse'
import { resolveRef } from '../frameworks'
import { glossaryById } from '../glossary'
import { lessons, subById } from '.'

function* strings(value: unknown): Generator<string> {
  if (typeof value === 'string') yield value
  else if (Array.isArray(value)) for (const v of value) yield* strings(v)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* strings(v)
}

describe.each(Object.entries(lessons))('aula %s', (id, lesson) => {
  it('pertence a um submódulo sem conteúdo clássico', () => {
    const sub = subById(id)
    expect(sub).toBeDefined()
    expect(sub!.legacy).toBeNull()
  })

  it('tem situação, conceito, verificação e revisão com conteúdo', () => {
    expect(lesson.context.length).toBeGreaterThan(60)
    expect(lesson.concept.length).toBeGreaterThanOrEqual(2)
    for (const p of lesson.concept) expect(p.length).toBeGreaterThan(80)
    expect(lesson.validation.length).toBeGreaterThan(60)
    expect(lesson.review?.length ?? 0).toBeGreaterThanOrEqual(2)
    for (const r of lesson.review ?? []) {
      expect(r.front.length).toBeGreaterThan(10)
      expect(r.back.length).toBeGreaterThan(10)
    }
    if (lesson.example) {
      expect(lesson.example.code.length).toBeGreaterThan(0)
      expect(lesson.example.caption.length).toBeGreaterThan(20)
    }
  })

  it('cita só itens de frameworks que existem no registro e termos de glossário que existem', () => {
    for (const r of lesson.refs ?? []) expect(resolveRef(r), `${r.framework} ${r.id}`).toBeTruthy()
    for (const text of strings(lesson)) for (const term of termsIn(text)) expect(glossaryById(term), term).toBeTruthy()
  })

  it('exemplos e textos só usam endereços .example ou de documentação oficial', () => {
    const { links, ...rest } = lesson
    for (const text of strings(rest)) for (const m of text.matchAll(/https?:\/\/([^/\s"'`)<>]+)/g)) expect(m[1], id).toMatch(/\.example(:\d+)?$/)
    for (const l of links ?? []) expect(l.url).toMatch(/^https:\/\//)
  })
})

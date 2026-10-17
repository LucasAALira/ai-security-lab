import type { CodeChallenge, Level } from './types'

/* Desafios de código do laboratório. O gabarito é escrito no próprio código, com marcas no fim da
   linha, para que nenhum número de linha precise ser contado à mão:

     ⟦v⟧       linha da falha principal (todas as marcadas assim precisam ser escolhidas)
     ⟦a⟧       linha relacionada, também aceita como correta, mas não obrigatória
     ⟦x⟧       linha de uma falha opcional (não é pedida no enunciado; acertá-la libera a conquista secreta)
     ⟦n=...⟧   linha parecida com a falha, mas que não é o problema: o texto explica por quê

   `defineChallenge` tira as marcas e calcula os índices. O código mostrado ao aluno não tem marcas. */

export type Draft = Omit<CodeChallenge, 'vulnerable' | 'also' | 'extra' | 'notes' | 'extraNote' | 'module' | 'submodule' | 'tags' | 'level'> & {
  extraNote?: string
  /** Só nos desafios dos módulos clássicos. Os novos omitem e ficam sempre abertos. */
  module?: number
  submodule?: string
  tags?: string[]
  level?: Level
}

/** Submódulo e etiquetas dos desafios dos módulos clássicos, que já existiam antes da hierarquia. */
const LEGACY: Record<string, { submodule: string; tags: string[] }> = {
  'saida-no-dom': { submodule: 'ia-saida-insegura', tags: ['ia'] },
  'chave-no-navegador': { submodule: 'ia-fronteiras', tags: ['ia'] },
  'apagar-sem-dono': { submodule: 'ia-permissoes-ferramentas', tags: ['ia'] },
  'agente-com-ferramentas': { submodule: 'ia-injecao-indireta', tags: ['ia'] },
  'sql-gerado-pelo-modelo': { submodule: 'ia-saida-insegura', tags: ['ia'] },
  'conta-de-servico': { submodule: 'ia-permissoes-ferramentas', tags: ['ia'] },
  'rag-sem-permissao': { submodule: 'ia-autz-recuperacao', tags: ['ia'] },
  'modelo-sem-verificacao': { submodule: 'ia-artefatos', tags: ['ia'] },
  'exportar-modelo-sem-papel': { submodule: 'ia-artefatos', tags: ['ia'] },
  'executor-que-executa': { submodule: 'ia-red-teaming', tags: ['ia'] },
  'historico-de-outra-pessoa': { submodule: 'ia-isolamento', tags: ['ia'] },
  'dados-pessoais-no-log': { submodule: 'gov-lgpd', tags: ['gov'] },
  'exportar-dados-do-titular': { submodule: 'gov-ciclo-dados', tags: ['gov'] },
  'modelo-pickle': { submodule: 'mob-engenharia-reversa', tags: ['reverse'] },
  'plano-no-corpo': { submodule: 'mob-engenharia-reversa', tags: ['reverse'] },
  'tls-desligado': { submodule: 'mob-engenharia-reversa', tags: ['reverse'] },
}

const MARK = /\s*⟦(v|a|x|n=[^⟧]*)⟧\s*$/

export function defineChallenge(draft: Draft): CodeChallenge {
  const vulnerable: number[] = []
  const also: number[] = []
  const extra: number[] = []
  const notes: Record<number, string> = {}
  const code = draft.code.map((line, i) => {
    const m = MARK.exec(line)
    if (!m) return line
    const tag = m[1]
    if (tag === 'v') vulnerable.push(i)
    else if (tag === 'a') also.push(i)
    else if (tag === 'x') extra.push(i)
    else notes[i] = tag.slice(2)
    return line.replace(MARK, '')
  })
  const legacy = LEGACY[draft.id]
  return {
    ...draft,
    module: draft.module ?? null,
    submodule: draft.submodule ?? legacy?.submodule ?? '',
    tags: draft.tags ?? legacy?.tags ?? [],
    level: draft.level ?? 'Intermediário',
    code,
    vulnerable,
    also,
    extra,
    notes,
    extraNote: draft.extraNote ?? '',
  }
}

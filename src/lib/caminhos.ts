/** As três trilhas oferecidas logo depois do tutorial de abertura.
 *
 *  São os temas dos módulos agrupados pela categoria que eles já têm (`src/data/modules.ts`), fora
 *  Fundamentos, que é o tutorial. Escolher uma trilha não tranca nem abre nada: as regras de
 *  pré-requisito continuam as mesmas. Ela só diz por onde a pessoa quer começar, e o site passa a
 *  apontar para lá na jornada. */

import { modules } from '@/data/modules'
import type { CaminhoId } from '@/lib/progress'

export interface Caminho {
  id: CaminhoId
  /** A categoria dos módulos, como ela aparece no conteúdo. */
  categoria: string
  /** O que se aprende nessa trilha, em uma linha. */
  resumo: string
  /** Como a trilha se sente na prática, para a escolha não ser às cegas. */
  jeito: string
  /** Os módulos da trilha, na ordem do conteúdo. */
  modulos: number[]
}

const RESUMOS: Record<CaminhoId, { categoria: string; resumo: string; jeito: string }> = {
  ataques: {
    categoria: 'Ataques e defesa',
    resumo: 'Como uma aplicação com IA é atacada e o que segura cada ataque.',
    jeito: 'Cenários concretos: uma instrução escondida num anexo, uma ferramenta com permissão demais, um exercício de time vermelho.',
  },
  governanca: {
    categoria: 'Governança',
    resumo: 'Como organizar risco, papéis e evidência em volta de um sistema de IA.',
    jeito: 'Estruturas de gestão: funções do NIST AI RMF e o sistema de gestão da ISO/IEC 42001.',
  },
  regulacao: {
    categoria: 'Regulação',
    resumo: 'O que a lei exige de quem constrói e opera IA, aqui e lá fora.',
    jeito: 'Texto legal aplicado a casos: LGPD no dia a dia de um produto e as obrigações do AI Act.',
  },
}

export const CAMINHOS: Caminho[] = (Object.keys(RESUMOS) as CaminhoId[]).map((id) => ({
  id,
  ...RESUMOS[id],
  modulos: modules.filter((m) => m.category === RESUMOS[id].categoria).map((m) => m.id),
}))

export const isCaminho = (v: unknown): v is CaminhoId => typeof v === 'string' && v in RESUMOS

export const caminhoById = (id: CaminhoId): Caminho => CAMINHOS.find((c) => c.id === id) ?? CAMINHOS[0]

/** O módulo do tutorial de abertura: a primeira matéria de Fundamentos. */
export const MODULO_TUTORIAL = modules.find((m) => m.category === 'Fundamentos')?.id ?? 0

/** Por onde a trilha começa: o primeiro módulo dela que ainda não foi concluído, ou o primeiro. */
export function moduloInicial(caminho: Caminho, completo: (module: number) => boolean): number {
  return caminho.modulos.find((i) => !completo(i)) ?? caminho.modulos[0]
}

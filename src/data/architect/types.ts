import type { FrameworkRef, Level } from '../types'
import type { DiagramEdge, DiagramNode, Reference } from '../campaigns/types'

/* Conteúdo do modo Arquiteto de Segurança. Todos os dados são sintéticos. O gabarito que o motor usa é
   extraído deste conteúdo em `index.ts`, para que texto e correção não divirjam. */

/** Categorias de STRIDE: falsificação, adulteração, repúdio, vazamento, negação de serviço, elevação de privilégio. */
export type Stride = 'S' | 'T' | 'R' | 'I' | 'D' | 'E'

/** Os seis critérios de avaliação. Custo e complexidade são somados e comparados com os limites do projeto; os demais são efeitos. */
export type Criterion = 'seguranca' | 'privacidade' | 'disponibilidade' | 'experiencia'

export interface ArchitectThreat {
  id: string
  title: string
  /** Se a ameaça se aplica de fato a este componente, neste projeto. As que não se aplicam são distratores plausíveis. */
  real: boolean
  /** Ameaça que precisa de tratamento antes do lançamento. As reais não críticas podem ser aceitas e registradas. */
  critical: boolean
  stride: Stride[]
  /** Por que se aplica (ou por que não), mostrado depois da avaliação. */
  why: string
  /** Correspondências conferidas no registro (`data/frameworks.ts`). */
  refs?: FrameworkRef[]
}

export interface ArchitectComponent extends DiagramNode {
  threats: ArchitectThreat[]
}

export interface ArchitectControl {
  id: string
  title: string
  /** Componentes onde o controle deve existir para funcionar. */
  places: string[]
  /** Ids das ameaças que o controle trata, quando bem posicionado. */
  mitigates: string[]
  /** Obrigatório em qualquer solução; os demais são escolhas que dependem do contexto. */
  mandatory: boolean
  cost: number
  complexity: number
  effects: Partial<Record<Criterion, number>>
  /** Por que existe, onde fica e o que custa, em uma ou duas frases. */
  note: string
}

export interface ArchitectProject {
  id: string
  title: string
  company: string
  summary: string
  level: Level
  minutes: number
  /** Áreas do currículo que o projeto cruza. */
  areas: string[]
  context: string[]
  requirements: { functional: string[]; nonFunctional: string[] }
  profiles: { name: string; access: string }[]
  externals: { name: string; note: string }[]
  constraints: string[]
  budget: number
  complexity: number
  components: ArchitectComponent[]
  edges: DiagramEdge[]
  /** Fluxos de dados, para a tabela de fluxos e fronteiras. */
  flows: { from: string; to: string; data: string; boundary: boolean }[]
  controls: ArchitectControl[]
  /** Soluções defensáveis comentadas: cada uma com os controles escolhidos e o que se troca por quê. */
  solutions: { title: string; controls: string[]; tradeoffs: string }[]
  adr: {
    fields: { label: string; hint: string }[]
    rubric: string[]
    /** Resposta comentada, um texto por campo. */
    model: string[]
  }
  refs: Reference[]
}

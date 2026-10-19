import { ADR_FIELDS } from './adr'
import type { ArchitectProject, Stride } from './types'

type Kind = ArchitectProject['components'][number]['kind']
/** Compact authoring format; all exercise-specific facts remain explicit in each scenario. */
export interface ArchitectureScenario {
  id: string; title: string; company: string; areas: string[]; story: string; mission: string
  needs: [string, string, string]; quality: [string, string, string]
  people: [string, string][]; vendors: [string, string][]
  nodes: [string, Kind, string, string][]
  links: [number, number, string][]
  // component, threat, rationale, STRIDE, primary control, alternative control
  critical: [number, string, string, Stride[], string, string][]
  optional: [number, string, string, Stride[], string][]
  distractors: [number, string, string, Stride[]][]
  tradeoff: string; residual: string; validation: string; reference: string
}

export function buildScenario(s: ArchitectureScenario): ArchitectProject {
  const components: ArchitectProject['components'] = s.nodes.map(([label, kind, zone, detail], i) => ({
    id: `n${i}`, label, kind, zone, detail, x: Math.floor(i / 2) * 2, y: (i % 2) * 2, threats: [],
  }))
  const controls: ArchitectProject['controls'] = []
  s.critical.forEach(([node, title, why, stride, primary, alternative], i) => {
    const threat = `risk-${i}`
    components[node].threats.push({ id: threat, title, why, stride, real: true, critical: true })
    controls.push({ id: `guard-${i}`, title: primary, places: [`n${node}`], mitigates: [threat], mandatory: i === 0, cost: 3, complexity: 2,
      effects: { seguranca: 2 }, note: `${primary}. Aplicar em ${s.nodes[node][0]}. ${why}` })
    if (i > 0) controls.push({ id: `alternative-${i}`, title: alternative, places: [`n${node}`], mitigates: [threat], mandatory: false, cost: 4, complexity: 3,
      effects: { seguranca: 2, disponibilidade: 1 }, note: `${alternative}. Alternativa para ${s.nodes[node][0]}; exige mais integração e validação operacional. ${s.tradeoff}` })
  })
  s.optional.forEach(([node, title, why, stride, control], i) => {
    components[node].threats.push({ id: `residual-${i}`, title, why, stride, real: true, critical: false })
    controls.push({ id: `improve-${i}`, title: control, places: [`n${node}`], mitigates: [`residual-${i}`], mandatory: false, cost: 2, complexity: 2,
      effects: { seguranca: 1 }, note: `${control}. Aplicar em ${s.nodes[node][0]}; a decisão de adiar precisa de prazo e responsável. ${why}` })
  })
  s.distractors.forEach(([node, title, why, stride], i) => components[node].threats.push({ id: `distractor-${i}`, title, why, stride, real: false, critical: false }))
  const primary = s.critical.map((_, i) => `guard-${i}`)
  const alternative = s.critical.map((_, i) => i === 0 ? 'guard-0' : `alternative-${i}`)
  const decision = s.critical.map(([n, , , , control]) => `${s.nodes[n][0]}: ${control}`).join('; ')
  return {
    id: s.id, title: s.title, company: s.company, summary: s.mission, level: 'Avançado', minutes: 45,
    areas: s.areas, context: [`${s.story} Todos os nomes, organizações e dados deste exercício são fictícios.`, `Sua missão: ${s.mission}`],
    requirements: { functional: s.needs, nonFunctional: s.quality },
    profiles: s.people.map(([name, access]) => ({ name, access })), externals: s.vendors.map(([name, note]) => ({ name, note })),
    constraints: ['A entrega dispõe de 12 pontos de esforço e 9 de complexidade operacional; são unidades didáticas, não estimativas financeiras.', 'O fluxo principal deve continuar operando durante a implantação. As mudanças precisam permitir testes e reversão controlada.', s.tradeoff],
    budget: 12, complexity: 9, components,
    edges: s.links.map(([from, to, label]) => ({ from: `n${from}`, to: `n${to}`, label })),
    flows: s.links.map(([from, to, data]) => ({ from: s.nodes[from][0], to: s.nodes[to][0], data, boundary: s.nodes[from][2] !== s.nodes[to][2] })),
    controls,
    solutions: [
      { title: 'Controles no serviço responsável', controls: primary, tradeoffs: `Custo 9/12; complexidade 6/9. ${decision}. Preserva três pontos de esforço para uma melhoria adicional. ${s.tradeoff}` },
      { title: 'Alternativas com maior integração', controls: alternative, tradeoffs: `Custo 11/12; complexidade 8/9. Mantém ${s.critical[0][4]} e substitui as outras duas medidas por ${s.critical.slice(1).map(c => c[5]).join(' e ')}. As duas alternativas tratam as mesmas ameaças do cenário; não tornam o sistema imune. ${s.tradeoff}` },
    ],
    adr: { fields: ADR_FIELDS, rubric: [
      'Relaciona decisões aos fluxos e às fronteiras do projeto.', 'Explica a posição de cada controle e as ameaças tratadas.',
      'Compara as duas alternativas sem supor que mais controles sempre são melhores.', 'Mantém custo e complexidade dentro dos limites.',
      'Define responsável e prazo para o risco residual.', 'Inclui testes negativos e uma condição de revisão.',
    ], model: [
      `${s.story} A revisão precisa preservar: ${s.needs.join('; ')}. As fronteiras separam ${[...new Set(s.nodes.map(n => n[2]))].join(', ')}.`,
      `Adotamos a primeira solução: ${decision}. Cada medida fica no componente que toma a decisão, e deve ser testada antes da liberação.`,
      `Consideramos ${s.critical.slice(1).map(c => c[5]).join(' e ')}. São alternativas válidas, mas custam 11 pontos e 8 de complexidade em conjunto com o controle obrigatório. ${s.tradeoff}`,
      `As medidas respondem às condições concretas do cenário: ${s.critical.map(c => c[2]).join(' ')} Não presumimos segurança apenas por estar na rede interna.`,
      `A solução usa 9 pontos de esforço e 6 de complexidade. Exige implantação gradual, testes de regressão e responsável de operação. ${s.quality.join(' ')}`,
      `${s.residual} O responsável pelo produto registra a aceitação temporária, com revisão em 30 dias ou após incidente; as ameaças críticas não podem ser adiadas nesta entrega.`,
      `${s.validation} Registrar resultados com dados sintéticos, verificar o fluxo legítimo após cada bloqueio e revisar a ADR quando a integração ou a fronteira de confiança mudar.`,
    ] },
    refs: [{ label: 'OWASP — material de apoio ao cenário', url: s.reference }],
  }
}

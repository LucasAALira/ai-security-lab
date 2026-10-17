/** Rótulos das três camadas de um dossiê. São os mesmos em todas as páginas de casos reais. */
export const LAYERS = {
  facts: { label: 'Fatos documentados', hint: 'Vêm das fontes listadas, escritos com palavras próprias, com data.' },
  analysis: { label: 'Análise educacional', hint: 'Interpretação deste site para estudo. Não é afirmação das fontes.' },
  simulation: { label: 'Simulação fictícia', hint: 'Empresa, nomes e dados inventados. Inspirada no caso, sem reproduzi-lo.' },
} as const

/** `2026-10-17` vira `17/10/2026`. Textos que não começam com data ISO voltam como estão. */
export function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

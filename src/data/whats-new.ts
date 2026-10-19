/** Selo "Novo" das áreas e dos módulos recém-publicados.
 *
 *  A lista é mantida à mão: quando uma área ou um módulo deixa de ser novidade, o id sai daqui.
 *  Nada aqui entra em progresso, pontuação ou ordenação — o selo é só uma marca visual com texto. */

export const NEW_AREAS: readonly string[] = ['rev']

export const NEW_MODULES: readonly string[] = ['rev-fundamentos', 'rev-estatica', 'rev-segredos', 'rev-aplicativos', 'rev-modelos', 'rev-dinamica']

/** Módulos clássicos da trilha (por índice) publicados ou reescritos nesta versão. */
export const NEW_CLASSIC_MODULES: readonly number[] = [8]

/** Dossiês de casos reais publicados nesta versão. */
export const NEW_DOSSIERS: readonly string[] = [
  'stj-2020',
  'tse-2020',
  'ministerio-saude-2021',
  'datasus-scpa-2022',
  'seedf-formulario-2021',
  'isac-ransomware-2025',
  'telekall-2023',
  'tiktok-anpd-2026',
  'claro-serasa-2026',
  'pix-sumup-dict-2024',
  'pix-chaves-vazamentos',
  'cm-software-2025',
  'netshoes-2018',
  'banco-inter-2018',
  'venda-de-dados-2020',
]

export const isNewDossier = (id: string): boolean => NEW_DOSSIERS.includes(id)

export const isNewArea = (id: string): boolean => NEW_AREAS.includes(id)
export const isNewModule = (id: string): boolean => NEW_MODULES.includes(id)
export const isNewClassicModule = (index: number): boolean => NEW_CLASSIC_MODULES.includes(index)

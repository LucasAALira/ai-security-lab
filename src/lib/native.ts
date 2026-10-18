/* Ponte com o app Android (android/). O app é um WebView que carrega este mesmo site e expõe
   `window.AslNative`. No navegador nada daqui muda o comportamento: sem a ponte, tudo segue como antes. */

interface AslNative {
  version(): string
  /** Grava o backup e abre o compartilhamento do Android. `false` se não deu para gravar. */
  shareBackup(name: string, json: string): boolean
}

declare global {
  interface Window {
    AslNative?: AslNative
    /** Chamado pelo botão Voltar do Android. Devolve `'exit'` quando o app deve fechar. */
    __aslBack?: () => 'handled' | 'exit'
  }
}

export const isNativeApp = (): boolean => typeof window !== 'undefined' && typeof window.AslNative?.shareBackup === 'function'

/** Há um diálogo (Radix) aberto? O botão Voltar fecha o diálogo antes de mudar de página. */
const openDialog = (): boolean => document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]') !== null

/** Página inicial: `#/` ou só seções dela (`#/?secao=...`). */
const atHome = (hash: string): boolean => hash === '' || hash === '#' || hash === '#/' || hash.startsWith('#/?')

/** O que o botão Voltar faz: fecha um diálogo aberto; fora da página inicial, volta; na inicial, sai do app. */
export function handleBack(): 'handled' | 'exit' {
  if (openDialog()) {
    const target = document.activeElement ?? document.body
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }))
    return 'handled'
  }
  if (atHome(window.location.hash)) return 'exit'
  if (window.history.length > 1) window.history.back()
  else window.location.hash = '#/'
  return 'handled'
}

/** Liga o botão Voltar do app à página. No navegador é inofensivo (ninguém chama a função). */
export function setupBackButton(): () => void {
  window.__aslBack = handleBack
  return () => {
    if (window.__aslBack === handleBack) delete window.__aslBack
  }
}

/** Salva o backup no app: o Android abre o compartilhamento (Drive, Arquivos, e-mail...). */
export async function shareBackupFile(name: string, json: string): Promise<string> {
  if (!window.AslNative?.shareBackup(name, json)) throw new Error('Não foi possível compartilhar o backup.')
  return name
}

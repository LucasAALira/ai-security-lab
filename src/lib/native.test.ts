import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleBack, isNativeApp, setupBackButton, shareBackupFile } from './native'

afterEach(() => {
  delete window.AslNative
  window.location.hash = ''
  document.body.innerHTML = ''
})

describe('ponte com o app Android', () => {
  it('no navegador não há app: nada muda', () => {
    expect(isNativeApp()).toBe(false)
  })

  it('o botão Voltar fecha o diálogo aberto antes de tudo', () => {
    window.location.hash = '#/loja'
    document.body.innerHTML = '<div role="dialog" data-state="open"><button>ok</button></div>'
    const seen = vi.fn()
    document.body.addEventListener('keydown', (e) => seen((e as KeyboardEvent).key))
    expect(handleBack()).toBe('handled')
    expect(seen).toHaveBeenCalledWith('Escape')
  })

  it('fora da página inicial volta; na inicial (e nas seções dela) pede para sair', () => {
    window.location.hash = '#/desafios'
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    Object.defineProperty(window.history, 'length', { configurable: true, value: 3 })
    expect(handleBack()).toBe('handled')
    expect(back).toHaveBeenCalled()
    window.location.hash = '#/'
    expect(handleBack()).toBe('exit')
    window.location.hash = '#/?secao=hoje'
    expect(handleBack()).toBe('exit')
  })

  it('sem histórico para voltar, vai para a página inicial', () => {
    window.location.hash = '#/loja'
    Object.defineProperty(window.history, 'length', { configurable: true, value: 1 })
    expect(handleBack()).toBe('handled')
    expect(window.location.hash).toBe('#/')
  })

  it('liga e desliga o gancho do botão Voltar', () => {
    const off = setupBackButton()
    expect(window.__aslBack).toBe(handleBack)
    off()
    expect(window.__aslBack).toBeUndefined()
  })

  it('o backup vai para o compartilhamento do Android; falha vira erro, sem perder nada', async () => {
    const shareBackup = vi.fn().mockReturnValue(true)
    window.AslNative = { version: () => '2.1.0', shareBackup }
    expect(isNativeApp()).toBe(true)
    await expect(shareBackupFile('backup.json', '{}')).resolves.toBe('backup.json')
    expect(shareBackup).toHaveBeenCalledWith('backup.json', '{}')
    shareBackup.mockReturnValue(false)
    await expect(shareBackupFile('backup.json', '{}')).rejects.toThrow()
  })
})

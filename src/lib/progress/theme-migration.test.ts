import { describe, expect, it } from 'vitest'
import { progressContext as ctx } from '@/data/progress-context'
import { applyAction, cleanState, DEFAULT_THEME, LEGACY_DEFAULT_THEME, THEMES } from '.'

/* A identidade "Biblioteca dos Condenados" trouxe um novo tema padrão. Compras e escolhas anteriores
   continuam valendo; só quem nunca escolheu tema acompanha o novo padrão. */

const now = new Date(2026, 9, 17, 12)

describe('tema padrão e compatibilidade com estados salvos', () => {
  it('o novo padrão é gratuito e o antigo continua gratuito', () => {
    expect(DEFAULT_THEME).toBe('library')
    expect(THEMES.find((t) => t.id === DEFAULT_THEME)?.price).toBe(0)
    expect(THEMES.find((t) => t.id === LEGACY_DEFAULT_THEME)?.price).toBe(0)
  })

  it('quem estava no padrão antigo sem nunca escolher tema passa ao novo padrão', () => {
    expect(cleanState({ shop: { theme: 'dragon', owned: [] } }).shop.theme).toBe('library')
    expect(cleanState({}).shop.theme).toBe('library')
  })

  it('quem tem tema comprado e usa o Dragão continua no Dragão', () => {
    const s = cleanState({ shop: { theme: 'dragon', owned: ['cyber'] } })
    expect(s.shop.theme).toBe('dragon')
    expect(s.shop.owned).toEqual(['cyber'])
  })

  it('tema comprado e equipado continua equipado, com as compras intactas', () => {
    const s = cleanState({ shop: { theme: 'ashes', owned: ['ashes', 'eclipse'], relics: ['ember'], display: ['ember'], room: 'stone' }, coins: { bonus: 300, spent: 140 } })
    expect(s.shop.theme).toBe('ashes')
    expect(s.shop.owned).toEqual(['ashes', 'eclipse'])
    expect(s.shop.relics).toEqual(['ember'])
    expect(s.shop.display).toEqual(['ember'])
    expect(s.coins).toEqual({ bonus: 300, spent: 140 })
  })

  it('escolher o Dragão de propósito é lembrado depois de recarregar', () => {
    const r = applyAction(cleanState({}), { type: 'setTheme', theme: 'dragon' }, ctx, now)
    expect(r.changed).toBe(true)
    expect(r.state.shop.theme).toBe('dragon')
    const reloaded = cleanState(JSON.parse(JSON.stringify(r.state)))
    expect(reloaded.shop.theme).toBe('dragon')
    expect(reloaded.shop.themeChosen).toBe(true)
  })

  it('temas gratuitos não se compram nem custam moedas; temas pagos continuam exigindo compra', () => {
    const s = cleanState({ coins: { bonus: 500 } })
    expect(applyAction(s, { type: 'buyTheme', theme: 'library' }, ctx, now).rejected).toBe('invalid')
    expect(applyAction(s, { type: 'setTheme', theme: 'ashes' }, ctx, now).rejected).toBe('locked')
    const bought = applyAction(s, { type: 'buyTheme', theme: 'ashes' }, ctx, now)
    expect(bought.state.shop.theme).toBe('ashes')
    expect(bought.state.coins.spent).toBe(THEMES.find((t) => t.id === 'ashes')!.price)
    const back = applyAction(bought.state, { type: 'setTheme', theme: 'library' }, ctx, now)
    expect(back.state.shop.theme).toBe('library')
    expect(back.state.shop.owned).toEqual(['ashes'])
  })
})

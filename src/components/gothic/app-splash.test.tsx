import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isNativeApp } from '@/lib/native'
import { AppSplash, SPLASH_MS, splashEnabled } from './AppSplash'

describe('tela de abertura do app', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(performance, 'now').mockReturnValue(0)
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('no navegador fica desligada; liga no app ou com ?splash para testar', () => {
    expect(isNativeApp()).toBe(false)
    expect(splashEnabled('')).toBe(false)
    expect(splashEnabled('?splash')).toBe(true)
    render(<AppSplash enabled={false} />)
    expect(screen.queryByTestId('app-splash')).toBeNull()
  })

  it('dura 2 segundos ao todo e some sozinha', () => {
    expect(SPLASH_MS).toBe(2000)
    render(<AppSplash enabled />)
    const splash = screen.getByTestId('app-splash')
    expect(splash).toHaveAttribute('role', 'status')
    expect(splash).toHaveTextContent('AI Security Lab')
    act(() => void vi.advanceTimersByTime(1700))
    expect(screen.getByTestId('app-splash')).toHaveAttribute('data-phase', 'show')
    act(() => void vi.advanceTimersByTime(60))
    expect(screen.getByTestId('app-splash')).toHaveAttribute('data-phase', 'fade')
    act(() => void vi.advanceTimersByTime(270))
    expect(screen.queryByTestId('app-splash')).toBeNull()
  })

  it('conta o tempo desde a abertura: se o app demorou a carregar, espera só o que falta', () => {
    vi.spyOn(performance, 'now').mockReturnValue(1500)
    render(<AppSplash enabled />)
    act(() => void vi.advanceTimersByTime(260))
    expect(screen.getByTestId('app-splash')).toHaveAttribute('data-phase', 'fade')
  })

  it('um toque pula a abertura', () => {
    render(<AppSplash enabled />)
    fireEvent.click(screen.getByTestId('app-splash'))
    act(() => void vi.advanceTimersByTime(300))
    expect(screen.queryByTestId('app-splash')).toBeNull()
  })
})

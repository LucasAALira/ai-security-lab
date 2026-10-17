import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { TrophyRoomPage } from '@/pages/TrophyRoomPage'
import { ProgressProvider } from '@/state/ProgressProvider'
import { createProgressStore } from '@/state/progress-store'
import { progressContext } from '@/data/progress-context'
import { cleanState } from '@/lib/progress'

describe('trophy room interactions',()=>{
 it('previews, buys, exhibits and removes a relic without refund or loss',async()=>{
  const store=createProgressStore({storage:null,ctx:progressContext})
  store.replace(cleanState({coins:{bonus:200}}))
  const user=userEvent.setup()
  render(<MemoryRouter><ProgressProvider store={store}><TrophyRoomPage/></ProgressProvider></MemoryRouter>)
  await user.click(screen.getByRole('button',{name:/Fundamentos Brasa do Primeiro Passo/}))
  await user.click(screen.getByRole('button',{name:/Comprar por 25 moedas/}))
  expect(store.getState().shop.relics).toContain('ember')
  await user.click(screen.getByRole('button',{name:'Expor'}))
  expect(store.getState().shop.display).toEqual(['ember'])
  await user.click(screen.getByRole('button',{name:'Retirar Brasa do Primeiro Passo'}))
  expect(store.getState().shop.display).toEqual([])
  expect(store.getState().shop.relics).toContain('ember')
  expect(store.getState().coins.spent).toBe(25)
 })
})

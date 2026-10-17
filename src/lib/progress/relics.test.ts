import { describe, it, expect } from 'vitest'
import { applyAction, emptyState, cleanState, exportProgress, parseBackup, coinBalance, summary, RELICS, dayKey, dailyView } from '.'
import { progressContext as ctx } from '@/data/progress-context'
import { rollDay, questReplacement } from './quests'
const now = new Date(2026,9,17,12)
const funded = () => {const s=emptyState(); s.coins.bonus=1000; return s}
describe('relics and trophy room',()=>{
 it('buys once without changing XP, rejects insufficient funds',()=>{
  const s=funded(), xp=summary(s,ctx).xp
  const a=applyAction(s,{type:'buyRelic',id:'ember'},ctx,now)
  expect(a.state.shop.relics).toContain('ember')
  expect(coinBalance(a.state,ctx)).toBe(975)
  expect(summary(a.state,ctx).xp).toBe(xp)
  expect(applyAction(a.state,{type:'buyRelic',id:'ember'},ctx,now).rejected).toBe('owned')
  expect(applyAction(emptyState(),{type:'buyRelic',id:'ember'},ctx,now).rejected).toBe('coins')
 })
 it('limits exhibition to six owned pieces, permits removing and replacing',()=>{
  let s=funded()
  for (const r of RELICS) s=applyAction(s,{type:'buyRelic',id:r.id},ctx,now).state
  for (const r of RELICS.slice(0,6)) s=applyAction(s,{type:'toggleDisplay',id:r.id},ctx,now).state
  expect(applyAction(s,{type:'toggleDisplay',id:'chest'},ctx,now).rejected).toBe('limit')
  s=applyAction(s,{type:'toggleDisplay',id:'ember'},ctx,now).state
  expect(applyAction(s,{type:'toggleDisplay',id:'chest'},ctx,now).state.shop.display).toContain('chest')
  expect(applyAction(emptyState(),{type:'toggleDisplay',id:'medal:fake'},ctx,now).rejected).toBe('locked')
 })
 it('round-trips room, themes and collection in backup, retaining old progress',()=>{
  let s=funded(); s.modules[0].notes='minhas notas'; s.modules[0].reads[0]=true
  for (const action of [{type:'buyRelic',id:'ember'},{type:'toggleDisplay',id:'ember'},{type:'buyRoom',id:'moon-hall'},{type:'buyTheme',theme:'eclipse'}] as const) s=applyAction(s,action,ctx,now).state
  const restored=parseBackup(exportProgress(s))
  expect(restored.ok && restored.state).toEqual(s)
  const old=JSON.parse(JSON.stringify(s));delete old.shop.relics;delete old.shop.display;delete old.shop.room
  const migrated=cleanState(old)
  expect(migrated.modules[0].notes).toBe('minhas notas')
  expect(migrated.shop.room).toBe('stone')
  expect(migrated.shop.relics).toEqual([])
 })
})
describe('daily swap',()=>{
 const setup=()=>{const s=funded();rollDay(s,ctx,now);s.quests.ids=['read-2','case-1','xp-50'];return s}
 it('charges 10 exactly once, retains counters and resets next day',()=>{
  const s=setup();s.daily.reads=1
  expect(questReplacement(s,ctx,'read-2')).toBeTruthy()
  const a=applyAction(s,{type:'swapQuest',id:'read-2',day:dayKey(now)},ctx,now)
  expect(a.changed).toBe(true);expect(a.state.coins.spent).toBe(10)
  expect(a.state.daily.reads).toBe(1)
  expect(a.state.quests.ids).not.toContain('read-2')
  expect(applyAction(a.state,{type:'swapQuest',id:'case-1',day:dayKey(now)},ctx,now).changed).toBe(false)
  const next=new Date(2026,9,18,12);rollDay(a.state,ctx,next)
  expect(a.state.quests.swaps??0).toBe(0)
 })
 it('does not charge for completed, stale, unaffordable or unavailable replacements',()=>{
  const s=setup();s.quests.done=['read-2'];s.daily.reads=2
  expect(applyAction(s,{type:'swapQuest',id:'read-2',day:dayKey(now)},ctx,now).state).toBe(s)
  const poor=setup();poor.coins.bonus=0
  expect(applyAction(poor,{type:'swapQuest',id:'read-2',day:dayKey(now)},ctx,now).rejected).toBe('coins')
  const rich=setup()
  expect(applyAction(rich,{type:'swapQuest',id:'read-2',day:'2026-10-16'},ctx,now).changed).toBe(false)
  rich.quests.ids=['xp-100']
  expect(applyAction(rich,{type:'swapQuest',id:'xp-100',day:dayKey(now)},ctx,now).state.coins.spent).toBe(0)
  expect(dailyView(rich,ctx,now).quests[0].id).toBe('xp-100')
 })
})

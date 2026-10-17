import { useState } from 'react'
import { Link } from 'react-router'
import { Coins, Crown, Gem, Plus, Check, X, Lock, ArrowRight } from 'lucide-react'
import { useProgress } from '@/state/ProgressProvider'
import { RELICS, ROOMS, DISPLAY_LIMIT, roomOwned } from '@/lib/progress'
import { RelicArt } from '@/components/gamification/RelicArt'
import { MedalBadge } from '@/components/gamification/MedalBadge'
import { AchievementDialog } from '@/components/gamification/AchievementDialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useDocumentTitle } from '@/lib/use-document-title'
import type { Medal } from '@/lib/progress'

type Relic = typeof RELICS[number]
export function TrophyRoomPage() {
  useDocumentTitle('Sala de troféus')
  const { state, derived, dispatch } = useProgress()
  const [tab, setTab] = useState('relics')
  const [selected, setSelected] = useState<Relic | null>(null)
  const [medal, setMedal] = useState<Medal | null>(null)
  const [notice, setNotice] = useState('')
  const owned = RELICS.filter(r => state.shop.relics.includes(r.id))
  const earned = derived.medals.filter(m => m.unlocked)
  const display = state.shop.display
  const toggle = (id: string) => {
    const result = dispatch({ type: 'toggleDisplay', id })
    setNotice(result.rejected ? 'Os seis nichos estão ocupados. Retire uma peça antes de adicionar outra.' : display.includes(id) ? 'Peça retirada da exposição.' : 'Peça adicionada à exposição.')
  }
  return <div className="py-8 md:py-10">
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-3 text-xs tracking-[.24em] text-primary">SEU LEGADO • AI SECURITY LAB</p><h1 className="font-serif text-4xl md:text-5xl">Sala de troféus</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Cada conquista tem uma história. Escolha as relíquias que vão contá-la.</p></div>
      <Link to="/loja" className="inline-flex items-center gap-2 rounded-lg border border-tint-line bg-tint px-4 py-3 text-sm"><Coins className="size-4 text-primary" /><strong>{derived.balance}</strong> moedas <ArrowRight className="size-4" /></Link>
    </header>
    <section className={`trophy-hall room-${state.shop.room}`} aria-labelledby="exposicao">
      <div className="hall-arch" aria-hidden="true" />
      <div className="relative mb-8 flex flex-wrap justify-between gap-3"><div><p className="text-[10px] tracking-[.25em] text-primary">EXPOSIÇÃO PESSOAL</p><h2 id="exposicao" className="mt-2 font-serif text-2xl">{ROOMS.find(r => r.id === state.shop.room)?.name}</h2></div><span className="text-xs text-muted-foreground">{display.length} / {DISPLAY_LIMIT} nichos ocupados</span></div>
      <div className="relative grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({length: DISPLAY_LIMIT}, (_, i) => {
          const id = display[i]
          const relic = RELICS.find(r => r.id === id)
          const achievement = earned.find(m => 'medal:' + m.id === id)
          return <div className="trophy-niche" key={i}>
            {relic || achievement ? <>
              <button className="niche-inspect" onClick={() => relic ? setSelected(relic) : setMedal(achievement!)} aria-label={`Ver ${relic?.name ?? achievement?.name}`}>
                {relic ? <RelicArt icon={relic.icon} tier={relic.tier} /> : <MedalBadge icon={achievement!.icon} tier={achievement!.tier} className="size-24" />}
                <span className="mt-4 block font-serif text-sm">{relic?.name ?? achievement?.name}</span>
                <span className="mt-1 block text-[10px] tracking-widest text-muted-foreground">{relic ? 'RELÍQUIA' : 'CONQUISTA'}</span>
              </button>
              <button className="niche-remove" onClick={() => toggle(id)} aria-label={`Retirar ${relic?.name ?? achievement?.name}`}><X className="size-3.5" /></button>
            </> : <a href="#/sala-de-trofeus#colecao" onClick={(e) => { e.preventDefault(); document.getElementById('colecao')?.scrollIntoView({behavior:'auto'}) }} className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground"><Plus className="size-7 opacity-50"/><span className="text-xs">Escolher uma peça</span></a>}
          </div>
        })}
      </div>
      <div className="relative mt-6 flex flex-wrap gap-2" aria-label="Decoração da sala">{ROOMS.map(r => {
        const has = roomOwned(r.id, state.shop.relics)
        return <Button key={r.id} size="sm" variant={state.shop.room === r.id ? 'secondary' : 'outline'} disabled={state.shop.room === r.id || (!has && derived.balance < r.price)} onClick={() => dispatch({type: has ? 'setRoom' : 'buyRoom', id:r.id})}>{state.shop.room === r.id && <Check className="size-3"/>}{r.name}{!has && ` · ${r.price} moedas`}</Button>
      })}</div>
    </section>
    <p role="status" className="my-4 min-h-5 text-sm text-primary">{notice}</p>
    <section id="colecao" aria-labelledby="colecao-titulo">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="colecao-titulo" className="font-serif text-2xl">O acervo</h2><div className="flex flex-wrap gap-2" aria-label="Filtrar acervo"><Button size="sm" variant={tab==='relics'?'secondary':'ghost'} onClick={()=>setTab('relics')} aria-pressed={tab==='relics'}><Gem/>Relíquias {owned.length}/{RELICS.length}</Button><Button size="sm" variant={tab==='medals'?'secondary':'ghost'} onClick={()=>setTab('medals')} aria-pressed={tab==='medals'}><Crown/>Conquistas {earned.length}</Button></div></div>
      <p className="mb-5 text-sm text-muted-foreground">Relíquias são cosméticas. Medalhas são conquistadas estudando; não estão à venda.</p>
      {tab==='relics' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{RELICS.map(r=>{
        const has=state.shop.relics.includes(r.id), shown=display.includes(r.id)
        return <article key={r.id} className={`relic-card tier-${r.tier}`}>
          <button onClick={()=>setSelected(r)} className="w-full text-left"><div className="relic-card-art"><RelicArt icon={r.icon} tier={r.tier}/></div><div className="px-4 pt-4"><p className="text-[10px] uppercase tracking-widest text-tier">{r.area}</p><h3 className="mt-2 font-serif text-lg">{r.name}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.lore}</p></div></button>
          <div className="mt-auto flex items-center justify-between gap-2 p-4"><span className="text-xs text-muted-foreground">{has?'Na coleção':`${r.price} moedas`}</span>{has?<Button size="sm" variant="outline" disabled={!shown && display.length>=DISPLAY_LIMIT} onClick={()=>toggle(r.id)}>{shown?'Retirar':'Expor'}</Button>:<Button size="sm" disabled={derived.balance<r.price} onClick={()=>setSelected(r)}>{derived.balance<r.price?<><Lock className="size-3"/>Sem saldo</>:'Adquirir'}</Button>}</div>
        </article>
      })}</div> : earned.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{earned.map(m=><article key={m.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"><button onClick={()=>setMedal(m)} aria-label={`Ver conquista ${m.name}`}><MedalBadge icon={m.icon} tier={m.tier} className="size-16"/></button><div className="flex-1"><h3 className="text-sm font-semibold">{m.name}</h3><p className="mt-1 text-xs text-muted-foreground">{m.desc}</p><Button className="mt-3" size="sm" variant="outline" disabled={!display.includes('medal:'+m.id)&&display.length>=DISPLAY_LIMIT} onClick={()=>toggle('medal:'+m.id)}>{display.includes('medal:'+m.id)?'Retirar':'Expor conquista'}</Button></div></article>)}</div>:<div className="rounded-lg border border-dashed border-border p-8 text-center"><Crown className="mx-auto mb-3 text-primary"/><p>Seu primeiro troféu começa com uma aula.</p><Button asChild className="mt-4"><Link to="/trilha">Continuar estudando</Link></Button></div>}
    </section>
    <Dialog open={Boolean(selected)} onOpenChange={open=>!open&&setSelected(null)}><DialogContent>{selected&&<><DialogHeader><DialogTitle className="font-serif text-2xl">{selected.name}</DialogTitle><DialogDescription>{selected.area} · Item cosmético</DialogDescription></DialogHeader><div className="flex justify-center py-5"><RelicArt icon={selected.icon} tier={selected.tier} className="!h-36 !w-36"/></div><p className="font-serif text-lg leading-relaxed">{selected.lore}</p><p className="text-sm text-muted-foreground">Compra única. Não altera XP, habilidades ou conquistas.</p>{state.shop.relics.includes(selected.id)?<Button disabled={!display.includes(selected.id)&&display.length>=DISPLAY_LIMIT} onClick={()=>{toggle(selected.id);setSelected(null)}}>{display.includes(selected.id)?'Retirar da sala':'Expor na sala'}</Button>:<Button disabled={derived.balance<selected.price} onClick={()=>{dispatch({type:'buyRelic',id:selected.id});setSelected(null)}}>Comprar por {selected.price} moedas · saldo {derived.balance}</Button>}</>}</DialogContent></Dialog>
    <AchievementDialog medal={medal} onClose={()=>setMedal(null)} />
    <p className="mt-8 text-xs text-muted-foreground">Símbolos de Lorc e Delapouite / Game-icons.net, CC BY 3.0. <Link className="underline" to="/referencias">Créditos</Link></p>
  </div>
}

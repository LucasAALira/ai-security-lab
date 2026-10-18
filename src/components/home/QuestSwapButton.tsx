import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { canSwapQuest, swapPrice } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'
export function QuestSwapButton({ id, title }: { id: string; title: string }) {
  const { state, ctx, derived, dispatch, today } = useProgress()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const possible = canSwapQuest(state, ctx, id)
  const SWAP_PRICE = swapPrice(state)
  const disabled = !possible || derived.balance < SWAP_PRICE
  return <div className="col-start-2 col-end-4">
    <Button size="sm" variant="ghost" className="h-7 px-0 text-xs" disabled={disabled} onClick={()=>setOpen(true)} aria-label={`Injetor de Cinzas · ${SWAP_PRICE} moedas: trocar a missão ${title}`}><Shuffle className="size-3"/>Injetor de Cinzas · {SWAP_PRICE} moedas</Button>
    {!possible && <span className="ml-2 text-[10px] text-muted-foreground">{state.quests.day===today&&(state.quests.swaps??0)>0?'Troca de hoje utilizada':'Sem alternativa equivalente'}</span>}
    {possible&&derived.balance<SWAP_PRICE&&<span className="ml-2 text-[10px] text-muted-foreground">Saldo insuficiente</span>}
    <span role="status" className="text-xs text-primary">{message}</span>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Usar o Injetor de Cinzas?</DialogTitle><DialogDescription>A seringa de vidro com circuitos purga a missão corrompida “{title}” e injeta outra possível, com recompensa equivalente. Custa {SWAP_PRICE} moedas e pode ser feito uma vez por dia. O estudo já realizado permanece salvo.</DialogDescription></DialogHeader><div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setOpen(false)}>Manter missão</Button><Button onClick={()=>{const r=dispatch({type:'swapQuest',id,day:today});setMessage(r.rejected?'Não foi possível trocar. Nenhuma moeda foi descontada.':'Missão substituída.');setOpen(false)}}>Confirmar · {SWAP_PRICE} moedas</Button></div></DialogContent></Dialog>
  </div>
}

import { ArrowRight, Check, Circle, Coins, LockOpen } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { modules } from '@/data/modules'
import { rejectText } from '@/lib/events-text'
import { formatNumber, plural } from '@/lib/format'
import { isModuleComplete } from '@/lib/progress'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'
import { SealMark } from '@/components/gothic/Seal'

interface Props {
  module: number
  className?: string
  /** Chamado depois de um desbloqueio feito aqui (para quem precisa mover o foco). */
  onUnlocked?: () => void
}

/** Dois caminhos para abrir um módulo de acesso antecipado: pagar o desbloqueio imediato com moedas,
 *  ou acender a fogueira dos módulos recomendados antes (de graça). Pagar pede confirmação, porque
 *  as moedas gastas não voltam; XP, nível e medalhas nunca mudam. */
export function UnlockModuleCard({ module, className, onUnlocked }: Props) {
  const { state, derived, dispatch } = useProgress()
  const m = modules[module]
  const t = derived.trail[module]
  const price = t.price ?? 0
  const balance = derived.balance
  const enough = balance >= price
  const left = Math.max(0, price - balance)
  const pct = price ? Math.min(100, Math.floor((balance / price) * 100)) : 100
  const [ask, setAsk] = useState(false)
  const [message, setMessage] = useState('')
  const [bought, setBought] = useState(false)
  const openRef = useRef<HTMLAnchorElement>(null)

  // Depois da compra o botão some; o foco vai para quem abre o módulo, se o cartão continuar na tela.
  useEffect(() => {
    if (bought && t.unlocked) openRef.current?.focus()
  }, [bought, t.unlocked])

  function buy() {
    setAsk(false)
    const result = dispatch({ type: 'unlockModule', module })
    if (result.changed) {
      setBought(true)
      setMessage(`Módulo liberado: ${m.title}. Foram gastas ${formatNumber(price)} moedas.`)
      onUnlocked?.()
    } else {
      setMessage(rejectText[result.rejected ?? 'invalid'])
    }
  }

  const title = `Módulo ${m.number} · ${m.title}`

  if (t.unlocked) {
    return (
      <Card className={cn('gap-3 border-tint-line bg-[linear-gradient(135deg,var(--tint-strong),var(--card))] p-5', className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-medium">
              <LockOpen className="size-4 text-primary" aria-hidden="true" /> {title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t.purchased ? 'Desbloqueado com moedas.' : 'Liberado pelos módulos recomendados, sem gastar moedas.'}</p>
          </div>
          <Button asChild size="sm">
            <Link ref={openRef} to={`/modulo/${module}`} state={{ overlay: true }}>
              Abrir módulo <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <p role="status" aria-live="polite" className={cn('text-xs text-primary', !message && 'sr-only')}>
          {message}
        </p>
      </Card>
    )
  }

  return (
    <Card className={cn('gap-4 border-tint-line p-5', className)}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            <SealMark className="!size-8" /> {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Acesso antecipado: o conteúdo abre por um destes dois caminhos.</p>
        </div>
        <Badge variant="secondary" className="rounded text-[10px] text-primary">
          Bloqueado
        </Badge>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div role="group" aria-labelledby={`imediato-${module}`} className="flex flex-col gap-2.5 rounded-lg border border-border bg-tint p-4">
          <p id={`imediato-${module}`} className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            Desbloqueio imediato
          </p>
          <p className="flex items-center gap-1.5 font-mono text-xl text-primary">
            <Coins className="size-5" aria-hidden="true" />
            {formatNumber(price)}
            <span className="sr-only">{plural(price, 'moeda', 'moedas')}</span>
          </p>
          <Progress value={pct} aria-label={`Moedas acumuladas para o desbloqueio: ${pct}%`} className="h-1.5" />
          <p className="text-xs text-foreground/80">
            {enough ? (
              <>Você tem {formatNumber(balance)} moedas: o suficiente para desbloquear agora.</>
            ) : (
              <>
                Você tem <strong>{formatNumber(balance)}</strong> de {formatNumber(price)} moedas. Faltam <strong>{formatNumber(left)}</strong>.
              </>
            )}
          </p>
          <Button className="mt-auto self-start" disabled={!enough} onClick={() => setAsk(true)}>
            <LockOpen aria-hidden="true" /> {enough ? 'Desbloquear agora' : 'Moedas insuficientes'}
          </Button>
          {!enough ? (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Moedas vêm do estudo: 1 a cada 5 XP, mais missões do dia, baús e revisões. <Link to="/?secao=hoje" className="text-primary underline underline-offset-2">Ver missões de hoje</Link>
            </p>
          ) : null}
        </div>

        <div role="group" aria-labelledby={`gratis-${module}`} className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-4">
          <p id={`gratis-${module}`} className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            Liberação gratuita
          </p>
          <p className="text-xs text-foreground/80">Acenda a fogueira dos módulos recomendados antes deste:</p>
          <ul className="grid gap-1.5 text-[13px]">
            {m.prereqs.map((p) => {
              const done = isModuleComplete(state.modules[p])
              return (
                <li key={p} className="flex items-start gap-2">
                  {done ? <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                  <span>
                    <span className="sr-only">{done ? 'Concluído: ' : 'Pendente: '}</span>
                    Módulo {modules[p].number} · {modules[p].title}
                    <span className="block text-[11px] text-muted-foreground">{done ? 'fogueira acesa' : 'a concluir'}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-auto self-start">
            <Link to="/trilha">Ver a trilha</Link>
          </Button>
        </div>
      </div>

      <p role="status" aria-live="polite" className={cn('text-xs text-destructive', !message && 'sr-only')}>
        {message}
      </p>

      <AlertDialog open={ask} onOpenChange={setAsk}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desbloquear por {formatNumber(price)} moedas?</AlertDialogTitle>
            <AlertDialogDescription>
              O módulo {m.number} ({m.title}) abre agora. Você tem {formatNumber(balance)} moedas e ficará com {formatNumber(Math.max(0, balance - price))}. As moedas gastas não voltam, mas seu XP, nível e medalhas continuam iguais. Se preferir, o módulo também abre de graça ao concluir os módulos recomendados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Agora não</AlertDialogCancel>
            <AlertDialogAction onClick={buy}>Desbloquear por {formatNumber(price)} moedas</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

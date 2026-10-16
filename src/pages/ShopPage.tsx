import { Check, Coins, Gift, Palette, Shield, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatNumber, plural } from '@/lib/format'
import { coinsEarned, REWARD_LIMITS, SHIELD, THEMES, XP_PER_COIN } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 font-mono text-sm text-primary', className)}>
      <Coins className="size-3.5" aria-hidden="true" />
      {value}
      <span className="sr-only">{plural(value, 'moeda', 'moedas')}</span>
    </span>
  )
}

export function ShopPage() {
  useDocumentTitle('Loja de moedas')
  const { state, derived, ctx, dispatch } = useProgress()
  const { balance } = derived
  const earned = coinsEarned(state, ctx)

  return (
    <div className="py-8 md:py-10">
      <SectionHeading eyebrow="LOJA DE MOEDAS" level="h1" title="Gaste o que você ganhou estudando" description="Moedas vêm do estudo e nunca reduzem seu XP, nível ou medalhas." />

      <div className="stats stats-vertical mt-6 w-full min-[1000px]:grid min-[1000px]:grid-cols-3 rounded-lg border border-border bg-[linear-gradient(135deg,var(--tint-strong),var(--card))]">
        <div className="stat">
          <div className="stat-title text-xs text-muted-foreground">Saldo</div>
          <div className="stat-value flex items-center gap-2 text-3xl text-primary" aria-live="polite">
            <Coins className="size-6" aria-hidden="true" />
            {formatNumber(balance)}
          </div>
          <div className="stat-desc whitespace-normal">para gastar agora</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs text-muted-foreground">Ganhas no total</div>
          <div className="stat-value text-2xl">{formatNumber(earned)}</div>
          <div className="stat-desc whitespace-normal">1 moeda a cada {XP_PER_COIN} XP, mais missões, baús e revisões</div>
        </div>
        <div className="stat">
          <div className="stat-title text-xs text-muted-foreground">Gastas</div>
          <div className="stat-value text-2xl">{formatNumber(state.coins.spent)}</div>
          <div className="stat-desc whitespace-normal">
            <Link to="/?secao=hoje" className="text-primary hover:underline">
              Ver missões de hoje
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="loja-escudo" className="mt-10">
        <h2 id="loja-escudo" className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Shield className="size-5 text-primary" aria-hidden="true" /> Escudo de sequência
        </h2>
        <Card className="flex-row flex-wrap items-center justify-between gap-4 p-5">
          <div className="max-w-xl text-sm">
            <p className="text-foreground/85">Cobre um dia sem estudo e mantém sua sequência de dias seguidos. Você pode guardar até {SHIELD.max} escudos; cada um é usado sozinho no primeiro estudo depois da pausa.</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Você tem {state.shop.shields} de {SHIELD.max}.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Price value={SHIELD.price} />
            <Button disabled={state.shop.shields >= SHIELD.max || balance < SHIELD.price} onClick={() => dispatch({ type: 'buyShield' })}>
              {state.shop.shields >= SHIELD.max ? 'Limite atingido' : balance < SHIELD.price ? 'Moedas insuficientes' : 'Comprar escudo'}
            </Button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="loja-temas" className="mt-10">
        <h2 id="loja-temas" className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Palette className="size-5 text-primary" aria-hidden="true" /> Temas de cor
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {THEMES.map((t) => {
            const owned = t.price === 0 || state.shop.owned.includes(t.id)
            const active = state.shop.theme === t.id
            return (
              <Card key={t.id} className="gap-3 p-4">
                {/* A prévia usa o próprio tema, para mostrar as cores reais antes de comprar. */}
                <div data-theme={t.id} className="rounded-md border border-border bg-background p-3 text-foreground" aria-hidden="true">
                  <div className="mb-2 h-1.5 w-2/3 rounded-full bg-primary" />
                  <div className="mb-2 h-1.5 w-1/2 rounded-full bg-border" />
                  <span className="inline-block rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">Botão</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Tema {t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  {owned ? <span className="text-xs text-muted-foreground">{t.price === 0 ? 'Incluído' : 'Seu'}</span> : <Price value={t.price} />}
                  {active ? (
                    <Button size="sm" variant="secondary" disabled>
                      <Check aria-hidden="true" /> Em uso
                    </Button>
                  ) : owned ? (
                    <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'setTheme', theme: t.id })}>
                      Usar tema
                    </Button>
                  ) : (
                    <Button size="sm" disabled={balance < t.price} onClick={() => dispatch({ type: 'buyTheme', theme: t.id })}>
                      {balance < t.price ? 'Moedas insuficientes' : 'Comprar'}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <Rewards balance={balance} />
    </div>
  )
}

function Rewards({ balance }: { balance: number }) {
  const { state, dispatch } = useProgress()
  const id = useId()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const full = state.shop.rewards.length >= REWARD_LIMITS.max

  function add(event: React.FormEvent) {
    event.preventDefault()
    const n = Number(price)
    if (!title.trim() || !Number.isInteger(n) || n < 1 || n > REWARD_LIMITS.price) {
      return setError(`Informe um nome e um preço inteiro de 1 a ${REWARD_LIMITS.price} moedas.`)
    }
    const result = dispatch({ type: 'addReward', title, price: n })
    if (!result.changed) return setError('Não foi possível criar a recompensa.')
    setError('')
    setTitle('')
    setPrice('')
  }

  return (
    <section aria-labelledby="loja-recompensas" className="mt-10">
      <h2 id="loja-recompensas" className="mb-1 flex items-center gap-2 text-lg font-semibold">
        <Gift className="size-5 text-primary" aria-hidden="true" /> Recompensas pessoais
      </h2>
      <p className="mb-3 max-w-2xl text-sm text-muted-foreground">Crie prêmios só seus (um café, uma pausa, um episódio) e resgate com moedas. O resgate é por conta e confiança: o app só desconta as moedas.</p>

      <form onSubmit={add} className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-t`} className="text-xs">
            Nome da recompensa
          </Label>
          <Input id={`${id}-t`} value={title} maxLength={REWARD_LIMITS.title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: um café especial" disabled={full} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-p`} className="text-xs">
            Preço em moedas
          </Label>
          <Input id={`${id}-p`} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" type="number" min={1} max={REWARD_LIMITS.price} placeholder="30" disabled={full} />
        </div>
        <Button type="submit" disabled={full}>
          Adicionar
        </Button>
        <p role="status" className="text-xs text-destructive sm:col-span-3">
          {full ? `Limite de ${REWARD_LIMITS.max} recompensas. Remova uma para criar outra.` : error}
        </p>
      </form>

      <ul className="mt-4 grid gap-2.5">
        {state.shop.rewards.length ? (
          state.shop.rewards.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-tint px-4 py-3">
              <div>
                <strong className="text-sm">{r.title}</strong>
                <span className="ml-2 text-xs text-muted-foreground">{r.redeemed ? `resgatada ${r.redeemed} ${plural(r.redeemed, 'vez', 'vezes')}` : 'ainda não resgatada'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Price value={r.price} />
                <Button size="sm" disabled={balance < r.price} onClick={() => dispatch({ type: 'redeemReward', id: r.id })}>
                  {balance < r.price ? 'Moedas insuficientes' : 'Resgatar'}
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label={`Remover recompensa ${r.title}`} onClick={() => dispatch({ type: 'removeReward', id: r.id })}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Nenhuma recompensa ainda. Crie a primeira acima.</li>
        )}
      </ul>
    </section>
  )
}


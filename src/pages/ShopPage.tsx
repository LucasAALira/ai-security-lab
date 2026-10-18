import { RelicArt } from '@/components/gamification/RelicArt'
import { Check, Coins, Cpu, FlaskConical, Gift, Palette, ShieldHalf, Syringe, Trash2, type LucideIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import { SectionHeading } from '@/components/common/SectionHeading'
import { BuyButton } from '@/components/shop/BuyButton'
import { UnlockModuleCard } from '@/components/shop/UnlockModuleCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatNumber, plural } from '@/lib/format'
import { coinsEarned, DISPLAY_LIMIT, ECONOMY_MODES, economyOf, MODULE_UNLOCKS, RELICS, REWARD_LIMITS, ROOMS, SHIELD, shieldPrice, swapPrice, THEMES, themePrice, XP_PER_COIN } from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { cn } from '@/lib/utils'
import { useProgress } from '@/state/ProgressProvider'

function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('gx-price inline-flex items-center gap-1 text-sm font-semibold text-[var(--candle)] tabular-nums', className)}>
      <Coins className="size-3.5" aria-hidden="true" />
      {value}
      <span className="sr-only">{plural(value, 'moeda', 'moedas')}</span>
    </span>
  )
}

export function ShopPage() {
  useDocumentTitle('Mercador — loja de moedas')
  const { state, derived, ctx, dispatch } = useProgress()
  const { balance } = derived
  const earned = coinsEarned(state, ctx)
  const economy = economyOf(state)
  const mode = ECONOMY_MODES.find((m) => m.id === economy.mode)!
  const shield = shieldPrice(state)

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="Mercador · mercado negro"
        level="h1"
        title="O mercado negro"
        description="Tecnologia proibida e feitiçaria digital, pagas com moedas de estudo. Gastar nunca reduz seu XP, nível ou conquistas, e os preços são fixos."
      />
      {economy.mode !== 'soulslike' || economy.custom ? (
        <p className="mt-3 inline-flex flex-wrap items-center gap-2 border border-[var(--line)] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[var(--gold-anodized)] uppercase">
          Dificuldade: {mode.name}
          {economy.custom ? ' · modo deus' : ''} · moedas ×{economy.coinMultiplier}
        </p>
      ) : null}

      {/* O terminal: saldo em destaque, o que entrou e o que saiu. */}
      <div className="gx-counter stats stats-vertical mt-6 w-full min-[1000px]:grid min-[1000px]:grid-cols-3">
        <div className="stat">
          <div className="stat-title font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Saldo</div>
          <div className="stat-value flex items-center gap-2 font-mono text-3xl text-[var(--amber)]" aria-live="polite">
            <Coins className="size-6" aria-hidden="true" />
            {formatNumber(balance)}
          </div>
          <div className="stat-desc whitespace-normal">para gastar agora</div>
        </div>
        <div className="stat">
          <div className="stat-title font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Ganhas no total</div>
          <div className="stat-value font-mono text-2xl text-[var(--heading)]">{formatNumber(earned)}</div>
          <div className="stat-desc whitespace-normal">
            1 moeda a cada {XP_PER_COIN} XP, mais missões, baús e revisões{economy.coinMultiplier !== 1 ? `, tudo ×${economy.coinMultiplier}` : ''}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Gastas</div>
          <div className="stat-value font-mono text-2xl text-[var(--heading)]">{formatNumber(state.coins.spent)}</div>
          <div className="stat-desc whitespace-normal">
            <Link to="/?secao=hoje" className="text-primary hover:underline">
              Ver missões de hoje
            </Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="loja-consumiveis" className="mt-10">
        <h2 id="loja-consumiveis" className="mb-1 flex items-center gap-2 text-lg">
          <FlaskConical className="size-5 text-primary" aria-hidden="true" /> Relíquias e consumíveis
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">Mecânicas de jogo: cada item muda uma regra a seu favor, nunca o seu XP.</p>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
          <ItemCard
            icon={Syringe}
            name="Injetor de Cinzas"
            kind="Troca de missão"
            lore="Seringa de vidro com circuitos gravados. Purga uma missão diária corrompida e injeta outra, de recompensa equivalente."
            rule="Uma vez por dia, direto nas missões de hoje."
            price={swapPrice(state)}
          >
            <Button asChild size="sm" variant="outline">
              <Link to="/?secao=hoje">Usar nas missões de hoje</Link>
            </Button>
          </ItemCard>
          <ItemCard
            icon={ShieldHalf}
            name="Escudo de Silício"
            kind="Proteção de sequência"
            lore="Runa digital que protege o registro de acessos diários. Se você falhar um dia de estudo, ela se parte no lugar da sua sequência."
            rule={`Guarde até ${SHIELD.max}; cada um é usado sozinho no primeiro estudo depois da pausa. Você tem ${state.shop.shields} de ${SHIELD.max}.`}
            price={shield}
          >
            <BuyButton price={shield} balance={balance} blocked={state.shop.shields >= SHIELD.max ? 'Limite atingido' : undefined} onBuy={() => dispatch({ type: 'buyShield' })}>
              Comprar escudo
            </BuyButton>
          </ItemCard>
        </div>
      </section>

      <section aria-labelledby="loja-modulos" className="mt-10">
        <h2 id="loja-modulos" className="mb-1 flex items-center gap-2 text-lg">
          <Cpu className="size-5 text-primary" aria-hidden="true" /> Núcleo de LLM Exilado
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-muted-foreground">
          Desbloqueio imediato de módulos restritos. Eles também abrem de graça ao concluir os módulos recomendados; o núcleo só pula a espera. Veja também <Link to="/em-breve" className="text-primary underline underline-offset-2">o que vem por aí</Link>.
        </p>
        <div className="grid gap-4">
          {Object.keys(MODULE_UNLOCKS).map((m) => (
            <UnlockModuleCard key={m} module={Number(m)} />
          ))}
        </div>
      </section>

      <Link to="/sala-de-trofeus" className="relic-shop-banner gx-frame gx-candle mt-10 flex flex-wrap items-center gap-5 p-6">
        <RelicArt icon="black-blade" />
        <div className="min-w-0 flex-1">
          <p className="gx-inscription">O acervo do guardião</p>
          <h2 className="mt-2 text-xl">Relíquias que contam sua história</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {RELICS.length} colecionáveis, como a Espada Negra da IA e o Montante Envenenado, {ROOMS.length} salas e {DISPLAY_LIMIT} pedestais para suas maiores conquistas.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-primary">Explorar a sala de troféus</span>
        </div>
      </Link>

      <section aria-labelledby="loja-temas" className="mt-10">
        <h2 id="loja-temas" className="mb-1 flex items-center gap-2 text-lg">
          <Palette className="size-5 text-primary" aria-hidden="true" /> Temas proibidos
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-muted-foreground">Todos os temas usam as mesmas linhas, vidro e chanfros; muda a luz. Temas comprados continuam seus para sempre.</p>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const price = themePrice(state, t.id, t.price)
            const owned = t.price === 0 || state.shop.owned.includes(t.id)
            const active = state.shop.theme === t.id
            return (
              <Card key={t.id} className={cn('gx-candle gap-3 p-4', active && 'border-[var(--line-hot)]')} data-selected={active ? 'true' : undefined}>
                {/* A prévia usa o próprio tema, para mostrar as cores reais antes de comprar. */}
                <div data-theme={t.id} className="theme-preview border border-[var(--line)] bg-background p-3 text-foreground" aria-hidden="true">
                  <div className="flex justify-center py-1"><RelicArt icon="crown" className="!h-20 !w-20" /></div>
                  <p className="font-display text-[12px] font-semibold tracking-[0.08em] text-[var(--heading)] uppercase">Título da página</p>
                  <div className="gx-gauge my-2 h-2"><div className="gx-gauge-fill w-full" style={{ transform: 'translateX(-35%)' }} /></div>
                  <span className="gx-btn gx-btn-plate inline-flex px-3 py-1.5 text-[11px]">Ação principal</span>
                </div>
                <div>
                  <h3 className="text-[13px]">Tema {t.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  {owned ? <span className="text-xs text-muted-foreground">{t.price === 0 ? 'Gratuito' : 'Na sua coleção'}</span> : <Price value={price} />}
                  {active ? (
                    <Button size="sm" variant="secondary" disabled aria-pressed="true">
                      <Check aria-hidden="true" /> Em uso
                    </Button>
                  ) : owned ? (
                    <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'setTheme', theme: t.id })}>
                      Usar tema
                    </Button>
                  ) : (
                    <BuyButton price={price} balance={balance} onBuy={() => dispatch({ type: 'buyTheme', theme: t.id })}>
                      Comprar
                    </BuyButton>
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

function ItemCard({
  icon: Icon,
  name,
  kind,
  lore,
  rule,
  price,
  children,
}: {
  icon: LucideIcon
  name: string
  kind: string
  lore: string
  rule: string
  price: number
  children: React.ReactNode
}) {
  return (
    <Card className="gx-candle gap-3 p-5">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid size-14 shrink-0 rotate-45 place-items-center border border-[var(--line-hot)] bg-tint shadow-[0_0_18px_-6px_var(--glow)]">
          <Icon className="size-6 -rotate-45 text-primary" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10.5px] tracking-[0.14em] text-primary uppercase">{kind}</p>
          <h3 className="mt-1 text-[15px]">{name}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/85 italic">{lore}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{rule}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <Price value={price} />
        {children}
      </div>
    </Card>
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
      <h2 id="loja-recompensas" className="mb-1 flex items-center gap-2 text-lg">
        <Gift className="size-5 text-primary" aria-hidden="true" /> Recompensas pessoais
      </h2>
      <p className="mb-3 max-w-2xl text-sm text-muted-foreground">Crie prêmios só seus (um café, uma pausa, um episódio) e resgate com moedas. O resgate é por conta e confiança: o app só desconta as moedas.</p>

      <form onSubmit={add} className="gx-panel grid gap-3 border p-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
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
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-tint px-4 py-3">
              <div>
                <strong className="text-sm">{r.title}</strong>
                <span className="ml-2 text-xs text-muted-foreground">{r.redeemed ? `resgatada ${r.redeemed} ${plural(r.redeemed, 'vez', 'vezes')}` : 'ainda não resgatada'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Price value={r.price} />
                <BuyButton price={r.price} balance={balance} onBuy={() => dispatch({ type: 'redeemReward', id: r.id })}>
                  Resgatar
                </BuyButton>
                <Button size="icon-sm" variant="ghost" aria-label={`Remover recompensa ${r.title}`} onClick={() => dispatch({ type: 'removeReward', id: r.id })}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="border border-dashed border-[var(--line-strong)] p-4 text-sm text-muted-foreground">Nenhuma recompensa ainda. Crie a primeira acima.</li>
        )}
      </ul>
    </section>
  )
}


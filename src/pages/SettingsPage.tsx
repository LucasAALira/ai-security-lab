import { RotateCcw, Save, Skull, Smartphone } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatNumber } from '@/lib/format'
import { isNativeApp } from '@/lib/native'
import {
  ECONOMY_LIMITS,
  ECONOMY_MODES,
  economyOf,
  shopItems,
  TIER_XP,
  TIERS,
  type EconomyMode,
  type EconomyOverrides,
  type Tier,
} from '@/lib/progress'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useProgress } from '@/state/ProgressProvider'

const TIER_NAME: Record<Tier, string> = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', dragao: 'Dragão' }

/** Configurações do app Android: dificuldade (Soulslike, Difícil, Médio, Fácil) e o modo deus,
 *  que edita à mão o XP por conquista, as moedas recebidas e os preços da loja. No navegador a
 *  página só mostra a dificuldade atual: o editor existe apenas no app. */
export function SettingsPage({ native = isNativeApp() }: { native?: boolean }) {
  useDocumentTitle('Configurações — dificuldade e modo deus')
  const { state, derived } = useProgress()
  const economy = economyOf(state)
  const mode = ECONOMY_MODES.find((m) => m.id === economy.mode)!

  return (
    <div className="py-8 md:py-10">
      <SectionHeading
        eyebrow="Configurações · app Android"
        level="h1"
        title="Dificuldade e modo deus"
        description="Escolha quanto cada conquista rende. O Soulslike é o padrão; os outros modos multiplicam as recompensas."
      />
      <p className="mt-4 inline-flex flex-wrap gap-x-4 gap-y-1 border border-[var(--line)] px-3 py-2 font-mono text-[12px] text-muted-foreground">
        <span>
          Modo atual: <strong className="text-[var(--heading)]">{mode.name}</strong>
          {economy.custom ? ' + modo deus' : ''}
        </span>
        <span>XP total: {formatNumber(derived.summary.xp)}</span>
        <span>Saldo: {formatNumber(derived.balance)} moedas</span>
      </p>
      {native ? (
        <>
          <ModePicker current={economy.mode} />
          <GodMode key={JSON.stringify(state.economy ?? null)} />
        </>
      ) : (
        <Card className="mt-8 flex-row items-start gap-4 p-5">
          <Smartphone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-sm">
            <p className="text-foreground/90">A dificuldade e o modo deus só podem ser alterados no app Android, em Configurações.</p>
            <p className="mt-1 text-muted-foreground">Aqui no navegador o jogo segue o modo salvo neste aparelho ({mode.name}).</p>
          </div>
        </Card>
      )}
    </div>
  )
}

function ModePicker({ current }: { current: EconomyMode }) {
  const { state, dispatch } = useProgress()
  const id = useId()
  return (
    <section aria-labelledby={`${id}-t`} className="mt-10">
      <h2 id={`${id}-t`} className="mb-1 text-lg">
        Dificuldade
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        O multiplicador vale para o XP de cada conquista e para todas as moedas recebidas, inclusive as já conquistadas. Voltar ao Soulslike restaura os valores originais; moedas gastas não voltam.
      </p>
      <RadioGroup
        value={current}
        onValueChange={(v) => dispatch({ type: 'setEconomy', economy: { ...state.economy, mode: v } })}
        className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-labelledby={`${id}-t`}
      >
        {ECONOMY_MODES.map((m) => (
          <Label
            key={m.id}
            htmlFor={`${id}-${m.id}`}
            className="gx-panel gx-candle flex cursor-pointer items-start gap-3 border p-4 has-[[data-state=checked]]:border-[var(--line-hot)] has-[[data-state=checked]]:bg-tint-strong"
          >
            <RadioGroupItem id={`${id}-${m.id}`} value={m.id} className="mt-1" />
            <span className="grid gap-1">
              <span className="flex items-center gap-2 font-display text-[14px] font-semibold tracking-[0.06em] text-[var(--heading)] uppercase">
                {m.id === 'soulslike' ? <Skull className="size-4 text-primary" aria-hidden="true" /> : null}
                {m.name}
              </span>
              <span className="font-mono text-[11px] text-[var(--gold-anodized)]">{m.multiplier === 1 ? 'Padrão · ×1' : `Recompensas ×${m.multiplier}`}</span>
              <span className="text-xs font-normal text-muted-foreground">{m.description}</span>
            </span>
          </Label>
        ))}
      </RadioGroup>
    </section>
  )
}

type Draft = { tierXp: Record<Tier, string>; coinMultiplier: string; prices: Record<string, string> }

function GodMode() {
  const { state, dispatch } = useProgress()
  const id = useId()
  const economy = economyOf(state)
  const items = useMemo(() => shopItems(), [])
  const [draft, setDraft] = useState<Draft>(() => ({
    tierXp: Object.fromEntries(TIERS.map((t) => [t, String(economy.tierXp[t])])) as Record<Tier, string>,
    coinMultiplier: String(economy.coinMultiplier),
    prices: Object.fromEntries(items.map((i) => [i.id, String(economy.price(i.id, i.base))])),
  }))
  const [message, setMessage] = useState('')

  const valid = (v: string, max: number) => /^\d+$/.test(v) && Number(v) <= max
  const errors = [
    ...TIERS.filter((t) => !valid(draft.tierXp[t], ECONOMY_LIMITS.tierXp)).map((t) => `XP de ${TIER_NAME[t]}`),
    ...(valid(draft.coinMultiplier, ECONOMY_LIMITS.coinMultiplier) ? [] : ['multiplicador de moedas']),
    ...items.filter((i) => !valid(draft.prices[i.id], ECONOMY_LIMITS.price)).map((i) => i.name),
  ]

  function save(event: React.FormEvent) {
    event.preventDefault()
    if (errors.length) return setMessage(`Corrija: ${errors.join(', ')}. Use inteiros de 0 até o limite indicado.`)
    // Só vira ajuste o que difere do valor do modo; o resto continua acompanhando a dificuldade.
    const m = economy.multiplier
    const overrides: EconomyOverrides = {}
    const tierXp: Partial<Record<Tier, number>> = {}
    for (const t of TIERS) if (Number(draft.tierXp[t]) !== TIER_XP[t] * m) tierXp[t] = Number(draft.tierXp[t])
    if (Object.keys(tierXp).length) overrides.tierXp = tierXp
    if (Number(draft.coinMultiplier) !== m) overrides.coinMultiplier = Number(draft.coinMultiplier)
    const prices: Record<string, number> = {}
    for (const i of items) if (Number(draft.prices[i.id]) !== i.base) prices[i.id] = Number(draft.prices[i.id])
    if (Object.keys(prices).length) overrides.prices = prices
    dispatch({ type: 'setEconomy', economy: { mode: economy.mode, overrides } })
    setMessage('Ajustes salvos.')
  }

  function reset() {
    dispatch({ type: 'setEconomy', economy: { mode: economy.mode } })
    setMessage('Valores do modo restaurados.')
  }

  const groups = [...new Set(items.map((i) => i.group))]

  return (
    <section aria-labelledby={`${id}-t`} className="mt-12">
      <h2 id={`${id}-t`} className="mb-1 flex items-center gap-2 text-lg">
        <Skull className="size-5 text-primary" aria-hidden="true" /> Modo deus
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
        Edite à mão o XP de cada conquista, as moedas recebidas e o preço de cada item. O que você mudar fica fixo; o resto acompanha a dificuldade escolhida. Vale só para este aparelho e entra no backup.
      </p>
      <form onSubmit={save} className="grid gap-6" noValidate>
        <Card className="gap-4 p-5">
          <h3 className="text-[13px]">XP por conquista</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TIERS.map((t) => (
              <Field
                key={t}
                id={`${id}-xp-${t}`}
                label={`Conquista de ${TIER_NAME[t]}`}
                hint={`Modo: ${formatNumber(TIER_XP[t] * economy.multiplier)} XP`}
                value={draft.tierXp[t]}
                max={ECONOMY_LIMITS.tierXp}
                onChange={(v) => setDraft((d) => ({ ...d, tierXp: { ...d.tierXp, [t]: v } }))}
              />
            ))}
          </div>
        </Card>
        <Card className="gap-4 p-5">
          <h3 className="text-[13px]">Moedas recebidas</h3>
          <div className="max-w-xs">
            <Field
              id={`${id}-coins`}
              label="Multiplicador de moedas"
              hint={`Modo: ×${economy.multiplier}. Vale para as moedas do XP, missões, baús e revisões.`}
              value={draft.coinMultiplier}
              max={ECONOMY_LIMITS.coinMultiplier}
              onChange={(v) => setDraft((d) => ({ ...d, coinMultiplier: v }))}
            />
          </div>
        </Card>
        <Card className="gap-5 p-5">
          <h3 className="text-[13px]">Preços da loja</h3>
          {groups.map((g) => (
            <fieldset key={g} className="grid gap-3">
              <legend className="mb-2 font-mono text-[11px] tracking-[0.14em] text-primary uppercase">{g}</legend>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items
                  .filter((i) => i.group === g)
                  .map((i) => (
                    <Field
                      key={i.id}
                      id={`${id}-p-${i.id}`}
                      label={i.name}
                      hint={`Padrão: ${formatNumber(i.base)} moedas`}
                      value={draft.prices[i.id]}
                      max={ECONOMY_LIMITS.price}
                      onChange={(v) => setDraft((d) => ({ ...d, prices: { ...d.prices, [i.id]: v } }))}
                    />
                  ))}
              </div>
            </fieldset>
          ))}
        </Card>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit">
            <Save aria-hidden="true" /> Salvar ajustes
          </Button>
          <Button type="button" variant="outline" onClick={reset} disabled={!economy.custom}>
            <RotateCcw aria-hidden="true" /> Restaurar valores do modo
          </Button>
          <p role="status" className="text-sm text-primary">
            {message}
          </p>
        </div>
      </form>
    </section>
  )
}

function Field({ id, label, hint, value, max, onChange }: { id: string; label: string; hint: string; value: string; max: number; onChange: (v: string) => void }) {
  const bad = !/^\d+$/.test(value) || Number(value) > max
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        inputMode="numeric"
        type="number"
        min={0}
        max={max}
        aria-invalid={bad || undefined}
        aria-describedby={`${id}-h`}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono"
      />
      <span id={`${id}-h`} className="text-[11px] text-muted-foreground">
        {hint} · máx. {formatNumber(max)}
      </span>
    </div>
  )
}

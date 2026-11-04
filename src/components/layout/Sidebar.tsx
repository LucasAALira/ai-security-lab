import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { LogoMark } from '@/components/gothic/PageVeil'
import { isNativeApp } from '@/lib/native'
import { cn } from '@/lib/utils'
import { groupOf, navGroups, type NavItem } from './nav'

/* Menu lateral como um índice de grimório. São cinco entradas; o resto fica dentro delas, e só
   aparece quando a pessoa abre. O submenu da página aberta abre sozinho, para quem chegou por um
   link saber onde está. No celular as cinco entradas viram uma faixa rolável e o submenu cai logo
   abaixo dela. */

const itemClass =
  'group relative block rounded-none border border-transparent px-2.5 py-1.5 leading-tight text-[color-mix(in_oklab,var(--foreground)_86%,transparent)] transition-colors hover:border-[var(--ornament-soft)] hover:bg-tint hover:text-primary focus-visible:outline-2 max-md:shrink-0 max-md:whitespace-nowrap max-md:px-3 max-md:py-2'
const activeClass =
  'border-[var(--ornament)] bg-tint-strong text-primary shadow-[inset_3px_0_0_var(--primary),0_0_18px_-8px_var(--glow)] max-md:shadow-[inset_0_-2px_0_var(--primary)]'

/** `resumido`: no celular as cinco entradas ficam numa faixa só, então elas vão sem a descrição,
 *  que reaparece dentro do submenu e no computador. */
function ItemText({ label, hint, resumido }: { label: string; hint?: string; resumido?: boolean }) {
  return (
    <>
      <span className="block text-[14px] font-semibold max-md:text-[13px]">{label}</span>
      {hint ? (
        <span className={cn('block text-[11.5px] font-normal text-[color-mix(in_oklab,var(--foreground)_74%,transparent)] max-md:text-[10.5px]', resumido && 'max-md:hidden')}>{hint}</span>
      ) : null}
    </>
  )
}

function Item({ item, atual }: { item: NavItem; atual: string }) {
  if (!item.to.startsWith('/?')) {
    return (
      <NavLink to={item.to} className={({ isActive }) => cn(itemClass, 'max-md:w-full', isActive && activeClass)}>
        <ItemText label={item.label} hint={item.hint} />
      </NavLink>
    )
  }
  const aqui = atual === item.to
  return (
    <Link to={item.to} aria-current={aqui ? 'location' : undefined} className={cn(itemClass, 'max-md:w-full', aqui && activeClass)}>
      <ItemText label={item.label} hint={item.hint} />
    </Link>
  )
}

export function Sidebar() {
  const location = useLocation()
  const native = isNativeApp()
  const atual = location.pathname === '/' ? `/${location.search}` : location.pathname
  const doLugar = groupOf(location.pathname, location.search)
  const [aberto, setAberto] = useState<string | undefined>(doLugar)

  // Mudou de página: o submenu que contém a página nova abre, para o menu mostrar onde se está.
  useEffect(() => {
    if (doLugar) setAberto(doLugar)
  }, [doLugar])

  return (
    <aside className="gx-glass z-20 flex flex-col overflow-y-auto border-0 border-[var(--line)] shadow-none max-md:border-b max-md:px-4 max-md:py-3 md:fixed md:top-[var(--sat)] md:bottom-[var(--sab)] md:left-[var(--sal)] md:w-[205px] md:border-r md:px-3 md:py-6 min-[1151px]:w-[245px] min-[1151px]:px-5 min-[1151px]:py-8">
      <Link to="/?secao=inicio" className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-[2px] focus-visible:outline-2">
        <LogoMark className="!size-11 shrink-0 !animate-none max-md:!size-9" />
        <span className="min-w-0 leading-none">
          <span className="gx-brand block text-[15px] max-md:text-[14px]">AI Security Lab</span>
          <span className="mt-1.5 block font-mono text-[9.5px] font-semibold tracking-[0.16em] text-primary uppercase">Forja Dracônica</span>
        </span>
      </Link>

      <nav aria-label="Navegação principal" className="mt-7 grid gap-1 max-md:mt-3 max-md:gap-0">
        {/* as cinco entradas: no celular, uma faixa rolável */}
        <div className="grid gap-1 max-md:flex max-md:gap-1.5 max-md:overflow-x-auto max-md:pb-1.5">
          {navGroups.map((group) => {
            if (group.to) {
              const aqui = atual === group.to
              return (
                <Link
                  key={group.label}
                  to={group.to}
                  aria-current={aqui ? 'location' : undefined}
                  onClick={() => setAberto(undefined)}
                  className={cn(itemClass, aqui && activeClass)}
                >
                  <ItemText label={group.label} hint={group.hint} resumido />
                </Link>
              )
            }
            const abertoAqui = aberto === group.label
            return (
              <button
                key={group.label}
                type="button"
                aria-expanded={abertoAqui}
                aria-controls={`submenu-${group.label}`}
                onClick={() => setAberto(abertoAqui ? undefined : group.label)}
                className={cn(itemClass, 'flex items-center gap-2 text-left md:w-full', doLugar === group.label && activeClass)}
              >
                <span className="min-w-0 flex-1">
                  <ItemText label={group.label} hint={group.hint} resumido />
                </span>
                <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 transition-transform', abertoAqui && 'rotate-180')} />
              </button>
            )
          })}
        </div>

        {/* o submenu aberto: no computador cai logo abaixo da entrada; no celular, abaixo da faixa */}
        {navGroups.map((group) =>
          group.to ? null : (
            <div
              key={group.label}
              id={`submenu-${group.label}`}
              hidden={aberto !== group.label}
              /* o atributo `hidden` sozinho não vence a classe de display do utilitário */
              style={aberto === group.label ? undefined : { display: 'none' }}
              className="grid gap-0.5 border-l border-[var(--line)] pt-0.5 pb-1.5 pl-2 max-md:mt-1.5 max-md:border-l-0 max-md:pl-0"
            >
              {group.items
                .filter((item) => !item.nativeOnly || native)
                .map((item) => (
                  <Item key={item.to} item={item} atual={atual} />
                ))}
            </div>
          ),
        )}
      </nav>

      <p className="mt-auto pt-8 text-xs leading-relaxed text-muted-foreground max-md:hidden">
        Seu progresso fica salvo neste navegador. Para levar a outro aparelho, use o backup no Relicário.
      </p>
    </aside>
  )
}

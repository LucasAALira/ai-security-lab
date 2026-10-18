import { Link, NavLink, useLocation } from 'react-router'
import { LogoMark } from '@/components/gothic/PageVeil'
import { isNativeApp } from '@/lib/native'
import { cn } from '@/lib/utils'
import { navGroups, type NavItem } from './nav'

/* Menu lateral como um índice de grimório: nome temático em destaque, a função logo abaixo.
   No celular vira uma faixa rolável com os mesmos itens. */

const itemClass =
  'group relative block rounded-none border border-transparent px-2.5 py-1.5 leading-tight text-[color-mix(in_oklab,var(--foreground)_86%,transparent)] transition-colors hover:border-[var(--ornament-soft)] hover:bg-tint hover:text-primary focus-visible:outline-2 max-md:shrink-0 max-md:whitespace-nowrap max-md:px-3 max-md:py-2'
const activeClass =
  'border-[var(--ornament)] bg-tint-strong text-primary shadow-[inset_3px_0_0_var(--primary),0_0_18px_-8px_var(--glow)] max-md:shadow-[inset_0_-2px_0_var(--primary)]'

function ItemText({ item }: { item: NavItem }) {
  return (
    <>
      <span className="block text-[14px] font-semibold max-md:text-[13px]">{item.label}</span>
      {item.hint ? <span className="block text-[11.5px] font-normal text-[color-mix(in_oklab,var(--foreground)_74%,transparent)] max-md:text-[10.5px]">{item.hint}</span> : null}
    </>
  )
}

export function Sidebar() {
  const location = useLocation()
  const native = isNativeApp()
  return (
    <aside className="gx-glass z-20 flex flex-col overflow-y-auto border-0 border-[var(--line)] shadow-none max-md:border-b max-md:px-4 max-md:py-3 md:fixed md:top-[var(--sat)] md:bottom-[var(--sab)] md:left-[var(--sal)] md:w-[205px] md:border-r md:px-3 md:py-6 min-[1151px]:w-[245px] min-[1151px]:px-5 min-[1151px]:py-8">
      <Link to="/?secao=inicio" className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-[2px] focus-visible:outline-2">
        <LogoMark className="!size-11 shrink-0 !animate-none max-md:!size-9" />
        <span className="min-w-0 leading-none">
          <span className="gx-brand block text-[15px] max-md:text-[14px]">AI Security Lab</span>
          <span className="mt-1.5 block font-mono text-[9.5px] font-semibold tracking-[0.16em] text-primary uppercase">Forja Dracônica</span>
        </span>
      </Link>

      <nav aria-label="Navegação principal" className="mt-7 grid gap-5 max-md:mt-3 max-md:flex max-md:gap-1.5 max-md:overflow-x-auto max-md:pb-1.5">
        {navGroups.map((group) => (
          <div key={group.label} className="grid gap-0.5 max-md:contents">
            <div className="gx-rule mb-1 font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-[color-mix(in_oklab,var(--primary)_75%,var(--muted-foreground))] max-md:hidden">
              {group.label}
            </div>
            {group.items.filter((item) => !item.nativeOnly || native).map((item) => {
              const routePage = !item.to.startsWith('/?')
              return routePage ? (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(itemClass, isActive && activeClass)}>
                  <ItemText item={item} />
                </NavLink>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={location.pathname === '/' && location.search === item.to.slice(1) ? 'location' : undefined}
                  className={cn(itemClass, location.pathname === '/' && location.search === item.to.slice(1) && activeClass)}
                >
                  <ItemText item={item} />
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <p className="mt-auto pt-8 text-xs leading-relaxed text-muted-foreground max-md:hidden">
        Seu progresso fica salvo neste navegador. Para levar a outro aparelho, use o backup no Relicário.
      </p>
    </aside>
  )
}

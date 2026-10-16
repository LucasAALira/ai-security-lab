import { Link, NavLink, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { navGroups } from './nav'

const linkClass = 'block rounded-md px-2 py-2 text-[13px] leading-snug text-[#aab8bb] transition-colors hover:bg-tint-strong hover:text-primary focus-visible:ring-2 focus-visible:ring-ring max-md:shrink-0 max-md:whitespace-nowrap max-md:px-2.5 max-md:py-1.5 max-md:text-[11px]'

export function Sidebar() {
  const location = useLocation()
  return (
    <aside className="z-20 flex flex-col overflow-y-auto border-border bg-[color-mix(in_oklab,var(--background)_92%,var(--card))] max-md:border-b max-md:px-5 max-md:py-4 md:fixed md:inset-y-0 md:left-0 md:w-[205px] md:border-r md:px-4 md:py-6 min-[1151px]:w-[245px] min-[1151px]:px-6 min-[1151px]:py-9">
      <Link to="/?secao=inicio" className="block min-h-10 shrink-0 font-bold tracking-[1px] text-[18px] max-md:text-[15px]">
        <img src="./assets/dragon-lock.png" alt="" width={44} height={48} className="float-left mr-2 h-12 w-11 object-contain max-md:h-10 max-md:w-9" />
        AI SECURITY
        <span className="block text-[10px] font-normal tracking-[3px] text-muted-foreground">LAB / ESTUDOS</span>
      </Link>

      <nav aria-label="Navegação principal" className="mt-8 grid gap-5 max-md:mt-3 max-md:flex max-md:gap-1.5 max-md:overflow-x-auto max-md:pb-1.5">
        {navGroups.map((group) => (
          <div key={group.label} className="grid gap-0.5 max-md:contents">
            <div className="mb-1.5 text-[9px] tracking-[1.6px] text-[#7a9099] max-md:hidden">{group.label}</div>
            {group.items.map((item) => {
              const routePage = !item.to.startsWith('/?')
              return routePage ? (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(linkClass, isActive && 'bg-tint-strong text-primary')}>
                  {item.label}
                </NavLink>
              ) : (
                <Link key={item.to} to={item.to} className={cn(linkClass, location.pathname === '/' && location.search === item.to.slice(1) && 'text-primary')}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-8 text-xs max-md:hidden">
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
        Aprendizado contínuo
        <p className="my-2 text-muted-foreground">
          Da mentalidade AppSec
          <br />à segurança de IA.
        </p>
        <small className="text-xs text-muted-foreground">Progresso salvo neste navegador</small>
      </div>
    </aside>
  )
}

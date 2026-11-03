import { useEffect, type RefObject } from 'react'

/** Guarda no elemento onde o ponteiro está, de -1 a 1 em cada eixo (`--px` e `--py`), para o
 *  CSS mover as camadas da cena em profundidades diferentes.
 *
 *  Só vale para ponteiro fino que passa por cima: no toque não existe "passar o mouse", e
 *  quem pediu menos movimento no sistema não recebe nada. A conta roda uma vez por quadro. */
export function usePointerParallax(alvo: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = alvo.current
    if (!el || typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let quadro = 0
    let px = 0
    let py = 0
    const aplicar = () => {
      quadro = 0
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
    }
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(aplicar)
    }
    const preso = (v: number) => Math.max(-1, Math.min(1, v))
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      px = preso(((e.clientX - r.left) / r.width) * 2 - 1)
      py = preso(((e.clientY - r.top) / r.height) * 2 - 1)
      agendar()
    }
    const sair = () => {
      px = 0
      py = 0
      agendar()
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', sair)
    return () => {
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', sair)
      if (quadro) cancelAnimationFrame(quadro)
    }
  }, [alvo])
}

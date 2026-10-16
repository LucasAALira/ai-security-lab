import { useEffect, useState } from 'react'
import ShinyText from '@/components/reactbits/ShinyText'

const readPrimary = () => (typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()) || '#ed8080'

/** Cor de destaque do tema ativo. O ShinyText calcula o brilho em um canvas, que não entende `var(--...)`,
 *  então precisa de uma cor concreta; ela é relida sempre que o tema (`data-theme`) muda. */
function usePrimaryColor() {
  const [color, setColor] = useState(readPrimary)
  useEffect(() => {
    const update = () => setColor(readPrimary())
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return color
}

type Props = Omit<React.ComponentProps<typeof ShinyText>, 'color' | 'shineColor'>

/** ShinyText na cor de destaque do tema, com brilho branco. */
export function ThemedShinyText(props: Props) {
  return <ShinyText {...props} color={usePrimaryColor()} shineColor="#ffffff" />
}

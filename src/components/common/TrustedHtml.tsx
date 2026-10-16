import { useRef, type ElementType, type HTMLAttributes, type MouseEvent } from 'react'

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'dangerouslySetInnerHTML' | 'children'> {
  /** HTML estático do próprio repositório. Nunca passe texto digitado ou vindo de fora. */
  html: string
  as?: ElementType
}

const ID = /^[\w-]+$/

/** Renderiza o HTML confiável do repositório (matérias e leitura de pentest). Como o roteador usa
 *  `#` nas URLs, os atalhos internos (`href="#secao"`) são interceptados e só rolam até o elemento. */
export function TrustedHtml({ html, as: Tag = 'div', onClick, ...props }: Props) {
  const ref = useRef<HTMLElement>(null)

  function handleClick(event: MouseEvent<HTMLElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    const link = (event.target as HTMLElement).closest('a')
    const href = link?.getAttribute('href') ?? ''
    if (!link || !href.startsWith('#') || !ID.test(href.slice(1))) return
    const target = ref.current?.querySelector<HTMLElement>(`[id="${href.slice(1)}"]`)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView()
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  return <Tag ref={ref} onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} {...props} />
}

import { motion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** Dá um "pulinho" quando o valor sobe (moedas, sequência). Não anima na primeira exibição. */
export function Bump({ value, children, className }: { value: number; children: ReactNode; className?: string }) {
  const previous = useRef(value)
  const grew = value > previous.current
  previous.current = value
  return (
    <motion.span key={value} className={className} style={{ display: 'inline-flex' }} initial={grew ? { scale: 1.45 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}>
      {children}
    </motion.span>
  )
}

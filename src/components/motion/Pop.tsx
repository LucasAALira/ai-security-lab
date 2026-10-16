import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Entrada com mola, para ícones que acabaram de ser conquistados. */
export function Pop({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span className={className} style={{ display: 'inline-flex' }} initial={{ scale: 0.3, rotate: -18, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 14, delay }}>
      {children}
    </motion.span>
  )
}

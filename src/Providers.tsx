import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { ProgressFeedback } from '@/components/gamification/ProgressFeedback'
import { Toaster } from '@/components/ui/sonner'
import { ProgressProvider } from '@/state/ProgressProvider'
import type { ProgressStore } from '@/state/progress-store'

/** Provedores globais. `reducedMotion="user"` faz as animações do Motion obedecerem ao sistema. */
export function Providers({ children, store }: { children: ReactNode; store?: ProgressStore }) {
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider store={store}>
        {children}
        <ProgressFeedback />
        <Toaster position="bottom-right" />
      </ProgressProvider>
    </MotionConfig>
  )
}

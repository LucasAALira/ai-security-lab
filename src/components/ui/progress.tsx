"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRise } from "@/components/gothic/use-rise"
import { Progress as ProgressPrimitive } from "radix-ui"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const charging = useRise(value || 0)
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "gx-gauge relative h-2 w-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("gx-gauge-fill w-full flex-1", charging && "is-charging")}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  // Every current usage of Switch in this app is the dark-mode toggle,
  // whose `checked` state is intentionally server/client-divergent (an
  // inline script in layout.tsx sets the real theme before hydration to
  // avoid a flash of the wrong theme). suppressHydrationWarning here so
  // that's a documented non-issue instead of a console error — needed on
  // both Root (`checked`/`data-state`) and Thumb (its own `data-state`,
  // a separate DOM node one level too deep for the caller to reach).
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    suppressHydrationWarning
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      suppressHydrationWarning
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

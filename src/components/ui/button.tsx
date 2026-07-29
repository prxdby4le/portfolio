import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // No shadows and no glows: this is a two-ink press, elevation is carried by
  // value and hairlines, not by drop shadow. Press feedback is a 1px push.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-semibold hover:bg-ink-lift",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/85",
        outline:
          "border border-border bg-transparent hover:border-ink hover:text-ink",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-ink-dim/80",
        ghost: "text-muted-foreground hover:bg-ink/10 hover:text-ink",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-paper-raised border border-border text-foreground hover:border-ink hover:text-ink",
        aero:
          "bg-primary text-primary-foreground font-semibold border border-primary hover:bg-ink-lift hover:border-ink-lift",
        // Tabs read as a printed index: the active one is marked by an ink
        // rule underneath, not by a tinted pill.
        tab:
          "relative bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-transparent data-[state=active]:after:bg-ink",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
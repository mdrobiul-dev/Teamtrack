import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
    }
    const variantClasses = {
      default: "bg-primary-500 text-white hover:bg-primary-600",
      outline: "border border-gray-200 bg-white hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
    }

    const buttonClassName = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    return (
      <Comp className={buttonClassName} ref={ref} {...props}>
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }

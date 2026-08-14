import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide ring-offset-background transition-all duration-normal ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evergreen focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-evergreen text-cotton shadow-soft hover:bg-evergreen-deep hover:shadow-lift',
        destructive: 'bg-[var(--error)] text-cotton shadow-soft hover:opacity-90',
        outline:
          'border border-evergreen/25 bg-transparent text-evergreen hover:bg-evergreen hover:text-cotton',
        secondary: 'bg-jade text-evergreen hover:bg-jade/80 shadow-sm',
        ghost: 'hover:bg-jade/40 hover:text-evergreen',
        link: 'text-evergreen underline-offset-4 hover:underline',
        gradient: 'bg-evergreen text-cotton shadow-lift hover:bg-evergreen-deep',
        success: 'bg-evergreen text-cotton shadow-soft hover:bg-evergreen-deep',
        warning: 'bg-[var(--warning)] text-cotton shadow-soft hover:opacity-90',
        info: 'bg-[var(--info)] text-cotton shadow-soft hover:opacity-90',
        brass: 'bg-dusty-olive text-cotton shadow-soft hover:opacity-90',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        xl: 'h-14 rounded-full px-10 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8BC34A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white shadow-lg hover:shadow-xl hover:from-[#7CB342] hover:to-[#8BC34A] hover:scale-105',
        destructive:
          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-500',
        outline:
          'border-2 border-[#8BC34A] bg-transparent text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white shadow-sm hover:shadow-lg',
        secondary: 'bg-gray-100 text-[#2d2d2d] hover:bg-gray-200 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-[#8BC34A]/10 hover:text-[#8BC34A]',
        link: 'text-[#8BC34A] underline-offset-4 hover:underline hover:text-[#7CB342]',
        gradient:
          'bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#689F38] text-white shadow-xl hover:shadow-2xl hover:scale-105',
        success:
          'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
        warning:
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-13 rounded-xl px-10 text-base',
        xl: 'h-16 rounded-2xl px-12 text-lg',
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
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

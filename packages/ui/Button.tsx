import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded font-medium transition-all duration-200'
  const variantClasses = {
    primary: 'bg-[#8BC34A] text-white hover:bg-[#7CB342]',
    secondary: 'bg-[#A5D6A7] text-[#333333] hover:bg-[#8BC34A]',
    outline: 'border-2 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

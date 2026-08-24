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
    primary: 'bg-[#5B8C51] text-white hover:bg-[#4E7A46]',
    secondary: 'bg-[#F6F0E2] text-[#1A1A1A] hover:bg-[#7BA672] hover:text-white',
    outline: 'border-2 border-[#5B8C51] text-[#5B8C51] hover:bg-[#5B8C51] hover:text-white',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
